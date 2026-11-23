import React from 'react';

/**
 * TopicNarrativeOverlays
 * Komponen Elemen Visual & Stiker Grafis Kreator (Gaya Video Edukasi TikTok @bukanahli127)
 * Menampilkan elemen grafis dinamis yang sinkron 100% dengan narasi yang sedang diucapkan:
 * - Lighting: Stiker petir ⚡, coret harga lampu Rp 2.5jt, diagram pantulan styrofoam Rp 15rb, senter HP
 * - Editing: Tombol shortcut keyboard [Q] [W], timer 3 jam vs 15 menit, color wheel DaVinci
 * - Design: Kartu perbandingan font, peringatan tabrakan 3 font, aturan 60-30-10
 * - Web/3D: Badge 60 FPS, wireframe 3D, instanced mesh Three.js
 */
export function TopicNarrativeOverlays({
  sceneIndex = 0,
  currentTime = 0,
  isPlaying = false,
  videoData = null
}) {
  if (!videoData) return null;

  const rawTitle = (videoData.judul || '').toLowerCase();
  const rawSub = (videoData.subtitles?.[sceneIndex]?.text || '').toLowerCase();
  const allText = `${rawTitle} ${rawSub}`;

  // Deteksi Topik Narasi
  let topic = 'lighting';
  if (allText.includes('light') || allText.includes('cahaya') || allText.includes('lampu') || allText.includes('studio') || allText.includes('sinematik')) {
    topic = 'lighting';
  } else if (allText.includes('edit') || allText.includes('cut') || allText.includes('premiere') || allText.includes('davinci') || allText.includes('warna') || allText.includes('timeline')) {
    topic = 'editing';
  } else if (allText.includes('font') || allText.includes('desain') || allText.includes('tipografi') || allText.includes('poster') || videoData.pilar === 'Design') {
    topic = 'design';
  } else if (allText.includes('web') || allText.includes('code') || allText.includes('3d') || allText.includes('three') || videoData.pilar === 'Web Development') {
    topic = 'web';
  }

  return (
    <div className="narrative-elements-root" aria-hidden="true">
      {/* 1. CAMERA RECORDER VIEW FINDER HUD (Khas Kamera Kreator) */}
      <div className="creator-camera-hud">
        <div className="hud-top-left">
          <span className="rec-dot-pulse">●</span>
          <span className="rec-format-txt">4K 60FPS REC</span>
        </div>
        <div className="hud-top-right">
          <span className="hud-spec-pill">ISO 400</span>
          <span className="hud-spec-pill">f/1.8</span>
          <span className="hud-spec-pill">5600K</span>
        </div>
      </div>

      {/* 2. ELEMEN GRAFIS SPESIFIK SESUAI TOPIK & SCENE */}

      {/* =================================================================== */}
      {/* TOPIK: LIGHTING & PENCAHAYAAN STUDIO                                */}
      {/* =================================================================== */}
      {topic === 'lighting' && (
        <div className={`topic-elements-container topic-lighting scene-${sceneIndex}`}>
          {/* SCENE 0: HOOK (0 - 4s) - STOP BELI LAMPU MAHAL */}
          {sceneIndex === 0 && (
            <div className="overlay-scene-block hook-lighting">
              <div className="lightning-spark-badge">
                <span className="spark-bolt-anim">⚡</span>
                <span className="spark-txt">PERINGATAN KREATOR</span>
              </div>
              <div className="price-strike-comparison">
                <div className="price-item expensive">
                  <span className="price-label">Lampu Studio Mahal</span>
                  <strong className="price-val strike">Rp 2.500.000 ❌</strong>
                </div>
                <div className="price-arrow-bounce">➔</div>
                <div className="price-item cheap glow">
                  <span className="price-label">Trik Modal Hemat</span>
                  <strong className="price-val highlight">Rp 15.000 ✅</strong>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 1: MASALAH (4 - 11s) - LAMPU PLAFON & BAYANGAN KASAR */}
          {sceneIndex === 1 && (
            <div className="overlay-scene-block problem-lighting">
              <div className="ceiling-light-callout">
                <div className="bulb-icon-warning">
                  <span className="bulb-emoji">💡</span>
                  <div className="downward-beam-harsh"></div>
                </div>
                <div className="problem-text-box">
                  <strong className="prob-title">Lampu Plafon Kamar (Top-Down)</strong>
                  <span className="prob-desc">Bayangan hitam kasar di kantung mata & hidung ❌</span>
                </div>
              </div>
              <div className="light-meter-pill">
                <span className="meter-label">Luminance Contrast:</span>
                <span className="meter-status bad">HARSH SHADOW (-2.5 EV)</span>
              </div>
            </div>
          )}

          {/* SCENE 2: SOLUSI (11 - 22s) - PANTULAN STYROFOAM & SENTER HP */}
          {sceneIndex === 2 && (
            <div className="overlay-scene-block solution-lighting">
              <div className="diy-lighting-diagram">
                <div className="diagram-node torch">
                  <span className="node-icon">📱</span>
                  <span className="node-label">Senter HP</span>
                </div>
                <div className="bounce-arrow-light">
                  <span className="arrow-line">───────▶</span>
                  <span className="beam-tag">Cahaya Keras</span>
                </div>
                <div className="diagram-node styrofoam glow">
                  <span className="node-icon">📦</span>
                  <span className="node-label">Styrofoam 15Rb</span>
                  <span className="node-sub">Diffuser Lembut</span>
                </div>
                <div className="bounce-arrow-soft">
                  <span className="arrow-line">───────▶</span>
                  <span className="beam-tag highlight">Soft Glow ✨</span>
                </div>
              </div>

              <div className="solution-floating-badge">
                <span className="badge-check">✓</span>
                <span>Pencahayaan Sinematik 3-Point Modal Seratus Ribu</span>
              </div>
            </div>
          )}

          {/* SCENE 3: CTA (22 - 30s) - AJAKAN SIMPAN & FOLLOW */}
          {sceneIndex === 3 && (
            <div className="overlay-scene-block cta-lighting">
              <div className="creator-bookmark-card pulse">
                <span className="bookmark-icon">📌</span>
                <div className="bookmark-info">
                  <strong>Simpan Video Ini Sekarang!</strong>
                  <span>Biar nggak bingung pas praktek lighting di kamar</span>
                </div>
              </div>
              <div className="floating-heart-burst">
                <span className="heart-item">❤️</span>
                <span className="heart-item delay-1">❤️</span>
                <span className="heart-item delay-2">❤️</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* TOPIK: EDITING, TIMELINE, SHORTCUT, & COLOR GRADING                 */}
      {/* =================================================================== */}
      {topic === 'editing' && (
        <div className={`topic-elements-container topic-editing scene-${sceneIndex}`}>
          {/* SCENE 0: HOOK - 3 JAM JADI 15 MENIT */}
          {sceneIndex === 0 && (
            <div className="overlay-scene-block hook-editing">
              <div className="timer-speed-badge">
                <span className="timer-icon">⏱️</span>
                <strong className="time-strike strike">3 JAM KERJA</strong>
                <span className="time-arrow">➔</span>
                <strong className="time-fast highlight">CUMA 15 MENIT!</strong>
              </div>
            </div>
          )}

          {/* SCENE 1: MASALAH - POTONG MANUAL SATU-SATU */}
          {sceneIndex === 1 && (
            <div className="overlay-scene-block problem-editing">
              <div className="manual-cut-warning">
                <span className="razor-icon">✂️</span>
                <div className="warning-content">
                  <strong>Potong Klip Manual Pakai Mouse ❌</strong>
                  <span>Leher kaku & timeline berantakan</span>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 2: SOLUSI - SHORTCUT KEYBOARD & DAVINCI COLOR WHEEL */}
          {sceneIndex === 2 && (
            <div className="overlay-scene-block solution-editing">
              <div className="shortcut-keys-row">
                <div className="keycap-pill">
                  <kbd className="key-char">Q</kbd>
                  <span className="key-action">Ripple Delete Left</span>
                </div>
                <div className="keycap-pill">
                  <kbd className="key-char">W</kbd>
                  <span className="key-action">Trim Right</span>
                </div>
              </div>
              <div className="davinci-grading-chip">
                <span className="color-dot lift"></span>
                <span className="color-dot gamma"></span>
                <span className="color-dot gain"></span>
                <strong className="chip-txt">DaVinci Rec.709 Natural Skin 60 FPS</strong>
              </div>
            </div>
          )}

          {/* SCENE 3: CTA - DOWNLOAD PRESET */}
          {sceneIndex === 3 && (
            <div className="overlay-scene-block cta-editing">
              <div className="preset-download-card pulse">
                <span className="download-icon">📥</span>
                <div className="download-info">
                  <strong>Save Preset Timeline Ini!</strong>
                  <span>Tag temen sesama editor yang sering lembur</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* TOPIK: DESIGN, TIPOGRAFI, CANVA, & POSTER                           */}
      {/* =================================================================== */}
      {topic === 'design' && (
        <div className={`topic-elements-container topic-design scene-${sceneIndex}`}>
          {/* SCENE 0: HOOK - DESAIN MURAHAN VS MAHAL */}
          {sceneIndex === 0 && (
            <div className="overlay-scene-block hook-design">
              <div className="design-tier-pill">
                <span className="tier-badge amateur">DESAIN AMATIR ❌</span>
                <span className="tier-arrow">VS</span>
                <span className="tier-badge pro highlight">DESAIN PRO ✅</span>
              </div>
            </div>
          )}

          {/* SCENE 1: MASALAH - TABRAKAN 3 FONT */}
          {sceneIndex === 1 && (
            <div className="overlay-scene-block problem-design">
              <div className="font-collision-box">
                <span className="collision-badge">❌ TABRAKAN 3 FONT</span>
                <div className="messy-font-demo">
                  <span className="sample-f1">Gothic Font</span>
                  <span className="sample-f2">Comic Brush</span>
                  <span className="sample-f3">Condensed Narrow</span>
                </div>
                <span className="caption-sub">Hierarki visual hancur & sulit dibaca</span>
              </div>
            </div>
          )}

          {/* SCENE 2: SOLUSI - FONT PAIRING & HIERARKI 60-30-10 */}
          {sceneIndex === 2 && (
            <div className="overlay-scene-block solution-design">
              <div className="font-pairing-card">
                <div className="font-item header">
                  <span className="font-role">JUDUL (Display Serif):</span>
                  <strong className="font-name serif">Playfair Display Bold</strong>
                </div>
                <div className="font-item body">
                  <span className="font-role">ISI (Clean Sans):</span>
                  <strong className="font-name sans">Inter Regular (Leading 1.5)</strong>
                </div>
                <div className="formula-tag">📐 Rumus Hierarki 60-30-10</div>
              </div>
            </div>
          )}

          {/* SCENE 3: CTA - KETIK FONT DI KOMENTAR */}
          {sceneIndex === 3 && (
            <div className="overlay-scene-block cta-design">
              <div className="comment-trigger-pill pulse">
                <span className="comment-bubble-icon">💬</span>
                <strong>Ketik "FONT" di Kolom Komentar!</strong>
              </div>
              <span className="cta-subnote">Kita kirim 5 kombinasi font premium gratis via DM</span>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* TOPIK: WEB DEVELOPMENT, 3D INTERAKTIF & THREE.JS                    */}
      {/* =================================================================== */}
      {topic === 'web' && (
        <div className={`topic-elements-container topic-web scene-${sceneIndex}`}>
          {/* SCENE 0: HOOK - 2D DATAR VS 3D INTERAKTIF */}
          {sceneIndex === 0 && (
            <div className="overlay-scene-block hook-web">
              <div className="web-evolution-tag">
                <span className="tag-old">Web 2D Statis ❌</span>
                <span className="tag-arrow">➔</span>
                <span className="tag-new highlight">3D Interaktif 60 FPS ✨</span>
              </div>
            </div>
          )}

          {/* SCENE 1: MASALAH - MODEL BERAT BIKIN NGELAG */}
          {sceneIndex === 1 && (
            <div className="overlay-scene-block problem-web">
              <div className="lag-warning-meter">
                <span className="lag-icon">⚠️</span>
                <div className="lag-text">
                  <strong className="lag-fps strike">FPS Drop: 12 FPS (Lag Berat)</strong>
                  <span>Karena poligon 3D tidak dioptimasi</span>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 2: SOLUSI - THREE.JS INSTANCED MESH 60 FPS */}
          {sceneIndex === 2 && (
            <div className="overlay-scene-block solution-web">
              <div className="fps-counter-hud">
                <div className="fps-number-badge">
                  <span className="fps-val highlight">60.00</span>
                  <span className="fps-unit">FPS SMOOTH</span>
                </div>
                <div className="tech-stack-chips">
                  <span className="stack-chip">Three.js</span>
                  <span className="stack-chip">InstancedMesh</span>
                  <span className="stack-chip">Lazy Canvas</span>
                </div>
              </div>
            </div>
          )}

          {/* SCENE 3: CTA - KONSULTASI WEB 3D */}
          {sceneIndex === 3 && (
            <div className="overlay-scene-block cta-web">
              <div className="web-consult-pill pulse">
                <span className="rocket-icon">🚀</span>
                <strong>Bikin Website 3D Keren Bareng MMA!</strong>
              </div>
              <span className="cta-subnote">Klik tautan di bio untuk konsultasi langsung</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
