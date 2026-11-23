import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * VideoPlayer3DCanvas
 * Kanvas Animasi 3D Realtime (Three.js) untuk Layar Simulator 9:16
 *
 * Fitur:
 * - Karakter Presenter 3D Editor Stylized (Kepala, Headphone Studio, Badan, Tangan Beranimasi)
 * - Studio Lighting 3-Titik Realtime (Key, Fill, Rim Light)
 * - Slider Sebelum vs Sesudah: Mengontrol interpolasi pencahayaan flat vs sinematik DaVinci
 * - Objek 3D per Scene (Kamera Sinematik, Reflektor Styrofoam, Diamond Hook, Bookmark CTA)
 * - Animasi Lip-sync & gesture sinkron dengan status pemutaran audio
 */
export function VideoPlayer3DCanvas({
  isPlaying = false,
  currentTime = 0,
  currentSceneIndex = 0,
  sliderPos = 50,
  videoData = null,
  pilar = 'Multimedia'
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // State refs for animation loop
  const stateRef = useRef({
    isPlaying,
    currentTime,
    currentSceneIndex,
    sliderPos,
    videoData,
    pilar
  });

  // Always update latest props into stateRef
  stateRef.current = {
    isPlaying,
    currentTime,
    currentSceneIndex,
    sliderPos,
    videoData,
    pilar
  };

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let animId = null;
    let renderer = null;

    try {
      const width = container.clientWidth || 320;
      const height = container.clientHeight || 560;

      // 1. Scene & Camera
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x06090e);
      scene.fog = new THREE.FogExp2(0x06090e, 0.08);

      const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
      camera.position.set(0, 1.35, 3.4);

      // 2. Renderer
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;

      // ======================================================================
      // 3. Tata Cahaya 3D Studio (Three-Point Studio Lighting)
      // ======================================================================
      // A. Ambient Light
      const ambientLight = new THREE.AmbientLight(0x0f172a, 0.6);
      scene.add(ambientLight);

      // B. Flat Overhead Light (Mewakili kondisi "Sebelum / Before" - Keras & Datar)
      const flatOverheadLight = new THREE.DirectionalLight(0xe2e8f0, 0.8);
      flatOverheadLight.position.set(0, 4, 1);
      scene.add(flatOverheadLight);

      // C. Key Light (Cahaya Utama Sinematik - Warm 3200K / Gold Orange)
      const keyLight = new THREE.SpotLight(0xffa23a, 3.2);
      keyLight.position.set(1.8, 2.5, 2.2);
      keyLight.angle = Math.PI / 4;
      keyLight.penumbra = 0.65;
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 512;
      keyLight.shadow.mapSize.height = 512;
      scene.add(keyLight);

      // D. Fill Light (Cahaya Pengisi - Cyan / Ice Blue)
      const fillLight = new THREE.PointLight(0x38bdf8, 1.8, 8);
      fillLight.position.set(-2.0, 1.6, 1.5);
      scene.add(fillLight);

      // E. Rim Light / Hair Light (Cahaya Tepi Sinematik dari Belakang Karakter)
      const rimLight = new THREE.SpotLight(0x38bdf8, 2.8);
      rimLight.position.set(0, 2.8, -1.8);
      rimLight.angle = Math.PI / 3;
      rimLight.penumbra = 0.8;
      scene.add(rimLight);

      // F. Studio Accent Neon Strip
      const neonFloorLight = new THREE.PointLight(0xf97316, 1.2, 5);
      neonFloorLight.position.set(0, 0.1, -1.2);
      scene.add(neonFloorLight);

      // ======================================================================
      // 4. Lingkungan Studio 3D (Floor & Studio Backdrop)
      // ======================================================================
      // Lantai Studio Matte dengan Refleksi Halus
      const floorGeo = new THREE.PlaneGeometry(16, 16);
      const floorMat = new THREE.MeshStandardMaterial({
        color: 0x090d16,
        roughness: 0.45,
        metalness: 0.25
      });
      const floorMesh = new THREE.Mesh(floorGeo, floorMat);
      floorMesh.rotation.x = -Math.PI / 2;
      floorMesh.position.y = 0;
      floorMesh.receiveShadow = true;
      scene.add(floorMesh);

      // Grid Halus di Lantai Studio
      const gridHelper = new THREE.GridHelper(8, 16, 0x1e293b, 0x0f172a);
      gridHelper.position.y = 0.005;
      scene.add(gridHelper);

      // Backdrop Melengkung Studio (Studio Cyc Wall)
      const wallGeo = new THREE.CylinderGeometry(5, 5, 6, 24, 1, true, -Math.PI * 0.5, Math.PI);
      const wallMat = new THREE.MeshStandardMaterial({
        color: 0x0b1120,
        roughness: 0.85,
        metalness: 0.1,
        side: THREE.BackSide
      });
      const wallMesh = new THREE.Mesh(wallGeo, wallMat);
      wallMesh.position.set(0, 3, -1.5);
      scene.add(wallMesh);

      // Panel Akustik Studio di Belakang Karakter
      const acousticGroup = new THREE.Group();
      for (let i = -3; i <= 3; i++) {
        const slatGeo = new THREE.BoxGeometry(0.08, 2.4, 0.04);
        const slatMat = new THREE.MeshStandardMaterial({
          color: 0x1e293b,
          roughness: 0.7
        });
        const slat = new THREE.Mesh(slatGeo, slatMat);
        slat.position.set(i * 0.22, 1.6, -1.8);
        acousticGroup.add(slat);
      }
      scene.add(acousticGroup);

      // ======================================================================
      // 5. Model Karakter Presenter 3D (Editor / Videographer Stylized)
      // ======================================================================
      const characterGroup = new THREE.Group();
      characterGroup.position.set(0, 0, 0);

      // Torso / Baju Hoodie Studio
      const torsoGeo = new THREE.CylinderGeometry(0.36, 0.44, 0.85, 16);
      const torsoMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.6,
        metalness: 0.15
      });
      const torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
      torsoMesh.position.set(0, 0.78, 0);
      torsoMesh.castShadow = true;
      torsoMesh.receiveShadow = true;
      characterGroup.add(torsoMesh);

      // Leher
      const neckGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.18, 12);
      const skinMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24,
        roughness: 0.55
      });
      const neckMesh = new THREE.Mesh(neckGeo, skinMat);
      neckMesh.position.set(0, 1.25, 0);
      characterGroup.add(neckMesh);

      // Kepala (Head Group)
      const headGroup = new THREE.Group();
      headGroup.position.set(0, 1.48, 0);

      const headGeo = new THREE.BoxGeometry(0.44, 0.46, 0.42);
      const headMat = new THREE.MeshStandardMaterial({
        color: 0xfcd34d,
        roughness: 0.5
      });
      const headMesh = new THREE.Mesh(headGeo, headMat);
      headMesh.castShadow = true;
      headGroup.add(headMesh);

      // Visor / Kacamata Editor Layar Reflektif
      const visorGeo = new THREE.BoxGeometry(0.40, 0.14, 0.12);
      const visorMat = new THREE.MeshStandardMaterial({
        color: 0x0284c7,
        roughness: 0.1,
        metalness: 0.9,
        emissive: 0x0284c7,
        emissiveIntensity: 0.35
      });
      const visorMesh = new THREE.Mesh(visorGeo, visorMat);
      visorMesh.position.set(0, 0.04, 0.20);
      headGroup.add(visorMesh);

      // Mata Glow di Visor
      const eyeLGeo = new THREE.BoxGeometry(0.08, 0.03, 0.02);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const eyeLMesh = new THREE.Mesh(eyeLGeo, eyeMat);
      eyeLMesh.position.set(-0.10, 0.04, 0.26);
      headGroup.add(eyeLMesh);

      const eyeRMesh = eyeLMesh.clone();
      eyeRMesh.position.x = 0.10;
      headGroup.add(eyeRMesh);

      // Mulut Karakter (Bergerak saat berbicara)
      const mouthGeo = new THREE.BoxGeometry(0.14, 0.03, 0.04);
      const mouthMat = new THREE.MeshStandardMaterial({
        color: 0x991b1b,
        roughness: 0.4
      });
      const mouthMesh = new THREE.Mesh(mouthGeo, mouthMat);
      mouthMesh.position.set(0, -0.12, 0.21);
      headGroup.add(mouthMesh);

      // Pro Studio Headset (Earcup Kiri, Kanan, Headband & Mic)
      const headsetMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.3,
        metalness: 0.6
      });
      const earcupGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 16);
      earcupGeo.rotateZ(Math.PI / 2);

      const earcupL = new THREE.Mesh(earcupGeo, headsetMat);
      earcupL.position.set(-0.24, 0.02, 0);
      headGroup.add(earcupL);

      const earcupR = new THREE.Mesh(earcupGeo, headsetMat);
      earcupR.position.set(0.24, 0.02, 0);
      headGroup.add(earcupR);

      // Headband
      const headbandGeo = new THREE.TorusGeometry(0.25, 0.03, 8, 18, Math.PI);
      const headbandMesh = new THREE.Mesh(headbandGeo, headsetMat);
      headbandMesh.rotation.z = Math.PI;
      headbandMesh.position.set(0, 0.16, 0);
      headGroup.add(headbandMesh);

      // Mic Boom
      const micArmGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 8);
      micArmGeo.rotateZ(-Math.PI / 3);
      const micArmMesh = new THREE.Mesh(micArmGeo, headsetMat);
      micArmMesh.position.set(-0.20, -0.08, 0.12);
      headGroup.add(micArmMesh);

      const micTipGeo = new THREE.SphereGeometry(0.03, 8, 8);
      const micTipMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const micTipMesh = new THREE.Mesh(micTipGeo, micTipMat);
      micTipMesh.position.set(-0.08, -0.14, 0.20);
      headGroup.add(micTipMesh);

      characterGroup.add(headGroup);

      // Lengan Kiri & Kanan (Arm Gestures)
      const armMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        roughness: 0.6
      });

      // Lengan Kiri
      const armLGroup = new THREE.Group();
      armLGroup.position.set(-0.42, 1.10, 0);
      const armLGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.50, 10);
      armLGeo.translate(0, -0.22, 0);
      const armLMesh = new THREE.Mesh(armLGeo, armMat);
      armLMesh.castShadow = true;
      armLGroup.add(armLMesh);
      characterGroup.add(armLGroup);

      // Lengan Kanan (Gestur Menjelaskan / Tunjuk)
      const armRGroup = new THREE.Group();
      armRGroup.position.set(0.42, 1.10, 0);
      const armRGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.50, 10);
      armRGeo.translate(0, -0.22, 0);
      const armRMesh = new THREE.Mesh(armRGeo, armMat);
      armRMesh.castShadow = true;
      armRGroup.add(armRMesh);

      // Tangan Kanan Stylus / Tool
      const handRGeo = new THREE.SphereGeometry(0.065, 8, 8);
      const handRMesh = new THREE.Mesh(handRGeo, skinMat);
      handRMesh.position.set(0, -0.48, 0);
      armRGroup.add(handRMesh);

      characterGroup.add(armRGroup);
      scene.add(characterGroup);

      // ======================================================================
      // 6. Properti 3D Khusus per Adegan (Scene Props)
      // ======================================================================
      // PROP 0: Diamond Peringatan Hook 3D Melayang
      const hookBadgeGroup = new THREE.Group();
      hookBadgeGroup.position.set(0.85, 1.65, 0.6);

      const diamondGeo = new THREE.OctahedronGeometry(0.22, 0);
      const diamondMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        emissive: 0xfacc15,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.8
      });
      const diamondMesh = new THREE.Mesh(diamondGeo, diamondMat);
      hookBadgeGroup.add(diamondMesh);

      const diamondHaloGeo = new THREE.TorusGeometry(0.32, 0.015, 8, 24);
      const diamondHaloMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
      const diamondHaloMesh = new THREE.Mesh(diamondHaloGeo, diamondHaloMat);
      diamondHaloMesh.rotation.x = Math.PI / 2;
      hookBadgeGroup.add(diamondHaloMesh);

      scene.add(hookBadgeGroup);

      // PROP 1: Kamera Sinematik 3D Studio di Tripod
      const cameraTripodGroup = new THREE.Group();
      cameraTripodGroup.position.set(-1.1, 0, 0.8);
      cameraTripodGroup.rotation.y = Math.PI / 4;

      const camBodyGeo = new THREE.BoxGeometry(0.28, 0.22, 0.40);
      const camBodyMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        roughness: 0.4,
        metalness: 0.8
      });
      const camBodyMesh = new THREE.Mesh(camBodyGeo, camBodyMat);
      camBodyMesh.position.set(0, 1.25, 0);
      cameraTripodGroup.add(camBodyMesh);

      const lensGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.24, 16);
      lensGeo.rotateX(Math.PI / 2);
      const lensMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.9,
        roughness: 0.1
      });
      const lensMesh = new THREE.Mesh(lensGeo, lensMat);
      lensMesh.position.set(0, 1.25, 0.26);
      cameraTripodGroup.add(lensMesh);

      // Kaki Tripod
      for (let i = 0; i < 3; i++) {
        const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.35, 8);
        const legMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7 });
        const leg = new THREE.Mesh(legGeo, legMat);
        const ang = (i * Math.PI * 2) / 3;
        leg.position.set(Math.sin(ang) * 0.25, 0.62, Math.cos(ang) * 0.25);
        leg.rotation.x = Math.cos(ang) * 0.25;
        leg.rotation.z = -Math.sin(ang) * 0.25;
        cameraTripodGroup.add(leg);
      }
      scene.add(cameraTripodGroup);

      // PROP 2: Reflektor Styrofoam 3D & Berkas Cahaya Demonstrasi
      const reflectorGroup = new THREE.Group();
      reflectorGroup.position.set(1.15, 0.85, 0.7);
      reflectorGroup.rotation.y = -Math.PI / 5;

      const boardGeo = new THREE.BoxGeometry(0.04, 0.95, 0.65);
      const boardMat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.9,
        metalness: 0.05
      });
      const boardMesh = new THREE.Mesh(boardGeo, boardMat);
      boardMesh.castShadow = true;
      reflectorGroup.add(boardMesh);

      // Stand Reflektor
      const standPoleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.1, 8);
      const standPoleMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
      const standPole = new THREE.Mesh(standPoleGeo, standPoleMat);
      standPole.position.set(0, -0.4, 0);
      reflectorGroup.add(standPole);

      // Visual Light Beam (Kerucut Cahaya Pantul)
      const beamGeo = new THREE.ConeGeometry(0.5, 1.4, 16, 1, true);
      beamGeo.rotateX(Math.PI / 2);
      const beamMat = new THREE.MeshBasicMaterial({
        color: 0xfef08a,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.set(-0.6, 0.2, -0.2);
      beamMesh.rotation.y = -Math.PI / 6;
      reflectorGroup.add(beamMesh);

      scene.add(reflectorGroup);

      // PROP 3: Ikon 3D Bookmark Pita Melayang (CTA Scene)
      const ctaGroup = new THREE.Group();
      ctaGroup.position.set(-0.85, 1.65, 0.7);

      const bookmarkGeo = new THREE.BoxGeometry(0.24, 0.38, 0.05);
      const bookmarkMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        emissive: 0xf97316,
        emissiveIntensity: 0.5,
        roughness: 0.2,
        metalness: 0.7
      });
      const bookmarkMesh = new THREE.Mesh(bookmarkGeo, bookmarkMat);
      ctaGroup.add(bookmarkMesh);

      // Bintang Rating di Bookmark
      const starGeo = new THREE.DodecahedronGeometry(0.08);
      const starMat = new THREE.MeshBasicMaterial({ color: 0xfffbeb });
      const starMesh = new THREE.Mesh(starGeo, starMat);
      starMesh.position.set(0, 0.02, 0.04);
      ctaGroup.add(starMesh);

      scene.add(ctaGroup);

      // Partikel Debu Udara Sinematik (Floating Dust Particles)
      const dustGeo = new THREE.BufferGeometry();
      const dustCount = 45;
      const dustPositions = new Float32Array(dustCount * 3);
      for (let i = 0; i < dustCount * 3; i += 3) {
        dustPositions[i] = (Math.random() - 0.5) * 4;
        dustPositions[i + 1] = Math.random() * 2.8;
        dustPositions[i + 2] = (Math.random() - 0.5) * 3 + 0.5;
      }
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
      const dustMat = new THREE.PointsMaterial({
        color: 0x38bdf8,
        size: 0.035,
        transparent: true,
        opacity: 0.55
      });
      const dustPoints = new THREE.Points(dustGeo, dustMat);
      scene.add(dustPoints);

      // ======================================================================
      // 7. Loop Animasi Realtime 3D
      // ======================================================================
      let clock = new THREE.Clock();

      const animate = () => {
        animId = requestAnimationFrame(animate);

        const delta = clock.getDelta();
        const elapsed = clock.getElapsedTime();

        const {
          isPlaying: activeIsPlaying,
          sliderPos: activeSliderPos,
          currentSceneIndex: activeSceneIdx
        } = stateRef.current;

        // A. Interpolasi Slider Sebelum vs Sesudah pada Pencahayaan
        // Slider pos 0% = Full Sebelum (Flat & Redup)
        // Slider pos 100% = Full Sesudah (Sinematik DaVinci 3-Titik)
        const cinematicRatio = THREE.MathUtils.clamp(activeSliderPos / 100, 0.05, 1.0);
        const flatRatio = 1.0 - cinematicRatio;

        // Kontrol Intensitas Lampu Berdasarkan Slider
        flatOverheadLight.intensity = 0.3 + flatRatio * 1.2;
        keyLight.intensity = cinematicRatio * 3.4;
        fillLight.intensity = cinematicRatio * 1.8;
        rimLight.intensity = cinematicRatio * 2.8;
        neonFloorLight.intensity = cinematicRatio * 1.5;

        // Ubah Warna Lampu Fill sesuai Pilar
        const curPilar = stateRef.current.pilar;
        if (curPilar === 'Design') {
          fillLight.color.setHex(0x3b82f6);
          keyLight.color.setHex(0xf59e0b);
        } else if (curPilar === 'Web Development') {
          fillLight.color.setHex(0x10b981);
          keyLight.color.setHex(0x06b6d4);
        } else {
          fillLight.color.setHex(0x38bdf8);
          keyLight.color.setHex(0xffa23a);
        }

        // B. Animasi Karakter (Idle Breathing & Speech Bobbing)
        const talkSpeed = activeIsPlaying ? 9.0 : 1.8;
        const breathAmount = activeIsPlaying ? 0.025 : 0.015;

        // Badan bernapas
        torsoMesh.scale.y = 1 + Math.sin(elapsed * talkSpeed) * breathAmount;
        torsoMesh.scale.x = 1 + Math.cos(elapsed * talkSpeed) * (breathAmount * 0.5);

        // Kepala mengangguk saat bicara
        if (activeIsPlaying) {
          headGroup.rotation.x = Math.sin(elapsed * 7.5) * 0.06;
          headGroup.rotation.y = Math.cos(elapsed * 4.2) * 0.08;
          headGroup.position.y = 1.48 + Math.sin(elapsed * 8) * 0.02;

          // Gerak mulut sinkron
          const mouthScale = 1 + Math.abs(Math.sin(elapsed * 12)) * 1.8;
          mouthMesh.scale.set(1, mouthScale, 1);

          // Gestur Tangan Kanan Menjelaskan
          armRGroup.rotation.x = -Math.PI / 4 + Math.sin(elapsed * 6) * 0.25;
          armRGroup.rotation.z = Math.cos(elapsed * 5) * 0.15;

          // Gestur Lengan Kiri Santai
          armLGroup.rotation.x = Math.sin(elapsed * 3) * 0.08;
        } else {
          headGroup.rotation.set(0, 0, 0);
          headGroup.position.y = 1.48;
          mouthMesh.scale.set(1, 1, 1);
          armRGroup.rotation.set(0, 0, 0);
          armLGroup.rotation.set(0, 0, 0);
        }

        // C. Transisi Visibilitas & Gerak Properti per Adegan (Scene)
        // Scene 0: Hook Badge Active
        hookBadgeGroup.visible = activeSceneIdx === 0;
        if (hookBadgeGroup.visible) {
          diamondMesh.rotation.y += delta * 1.8;
          diamondMesh.rotation.x += delta * 0.9;
          diamondHaloMesh.rotation.z += delta * 2.4;
          hookBadgeGroup.position.y = 1.65 + Math.sin(elapsed * 4) * 0.06;
        }

        // Scene 1: Camera Studio Active
        cameraTripodGroup.visible = activeSceneIdx === 1;
        if (cameraTripodGroup.visible) {
          cameraTripodGroup.rotation.y = Math.PI / 4 + Math.sin(elapsed * 1.5) * 0.08;
        }

        // Scene 2: Reflektor Styrofoam Active
        reflectorGroup.visible = activeSceneIdx === 2;
        if (reflectorGroup.visible) {
          beamMesh.material.opacity = 0.15 + Math.sin(elapsed * 5) * 0.08;
          reflectorGroup.position.y = 0.85 + Math.sin(elapsed * 2) * 0.02;
        }

        // Scene 3: CTA Bookmark Active
        ctaGroup.visible = activeSceneIdx === 3;
        if (ctaGroup.visible) {
          ctaGroup.rotation.y += delta * 2.0;
          ctaGroup.position.y = 1.65 + Math.sin(elapsed * 4.5) * 0.07;
        }

        // Partikel Debu Melayang
        dustPoints.rotation.y = elapsed * 0.02;

        // D. Dinamika Kamera 3D Sesuai Adegan (Cinematic Dolly & Orbit)
        let targetCamY = 1.35;
        let targetCamZ = 3.4;
        let targetCamX = 0;

        if (activeSceneIdx === 0) {
          // Zoom dramatis saat Hook
          targetCamZ = 2.95;
          targetCamY = 1.42;
          targetCamX = 0.12;
        } else if (activeSceneIdx === 1) {
          // Medium wide shot menunjukkan kamera & color scope
          targetCamZ = 3.65;
          targetCamY = 1.30;
          targetCamX = -0.22;
        } else if (activeSceneIdx === 2) {
          // Angle samping menunjukkan styrofoam
          targetCamZ = 3.35;
          targetCamY = 1.25;
          targetCamX = 0.28;
        } else {
          // Frontal CTA
          targetCamZ = 3.20;
          targetCamY = 1.38;
          targetCamX = Math.sin(elapsed * 0.8) * 0.08;
        }

        camera.position.x += (targetCamX - camera.position.x) * (delta * 2.5);
        camera.position.y += (targetCamY - camera.position.y) * (delta * 2.5);
        camera.position.z += (targetCamZ - camera.position.z) * (delta * 2.5);
        camera.lookAt(0, 1.35, 0);

        renderer.render(scene, camera);
      };

      animate();

      // Handle Resize Responsif
      const handleResize = () => {
        if (!container || !renderer) return;
        const newW = container.clientWidth || 320;
        const newH = container.clientHeight || 560;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      };

      const resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);

      // Cleanup saat unmount
      return () => {
        if (animId) cancelAnimationFrame(animId);
        resizeObserver.disconnect();

        // Dispose geometries & materials
        scene.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach(m => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        });

        if (renderer) {
          renderer.dispose();
        }
      };
    } catch (err) {
      console.error('[VideoPlayer3DCanvas] WebGL Error:', err);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="video-3d-canvas-container"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block'
        }}
      />
    </div>
  );
}
