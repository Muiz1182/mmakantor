import React, { useState, useEffect, useMemo, useRef } from 'react';
import { VIDEO_REVIEW_PRESETS, getVideoReviewPreset, buildDynamicVideoReviewData, OFFICIAL_SOCIAL_ACCOUNTS } from '../constants/videoReviewData';

// ============================================================================
// AUDIO REVIEW ENGINE (WEB AUDIO API SOUND SYNTHESIZER + SPEECH SYNTHESIS TTS)
// ============================================================================
class ReviewSoundEngine {
  constructor() {
    this.ctx = null;
    this.bgmTimer = null;
    this.isMuted = false;
    this.isPlaying = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playKick(time) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(140, time);
      osc.frequency.exponentialRampToValueAtTime(38, time + 0.12);
      gain.gain.setValueAtTime(0.28, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.22);
    } catch (e) {}
  }

  playSnare(time) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200, time);
      oscGain.gain.setValueAtTime(0.12, time);
      oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.12);

      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1000, time);
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.16, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.14);
      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      whiteNoise.start(time);
      whiteNoise.stop(time + 0.15);
    } catch (e) {}
  }

  playHiHat(time) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(6500, time);
      gain.gain.setValueAtTime(0.035, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(time);
      osc.stop(time + 0.06);
    } catch (e) {}
  }

  playChord(time, freqs) {
    if (!this.ctx || this.isMuted) return;
    try {
      freqs.forEach(f => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, time);
        gain.gain.setValueAtTime(0.035, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(time);
        osc.stop(time + 1.3);
      });
    } catch (e) {}
  }

  startBgm() {
    this.init();
    if (this.bgmTimer) return;
    this.isPlaying = true;

    const beatSec = 60 / 86;
    let step = 0;

    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [174.61, 220.00, 261.63, 329.63], // Fmaj7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ];

    const tick = () => {
      if (!this.isPlaying || !this.ctx) return;
      const now = this.ctx.currentTime;
      const barStep = step % 8;

      if (barStep === 0 || barStep === 4) {
        this.playKick(now);
      }
      if (barStep === 2 || barStep === 6) {
        this.playSnare(now);
      }
      this.playHiHat(now);

      if (barStep === 0) {
        const chordIdx = Math.floor(step / 8) % chords.length;
        this.playChord(now, chords[chordIdx]);
      }

      step++;
      this.bgmTimer = setTimeout(tick, (beatSec / 2) * 1000);
    };

    tick();
  }

  stopBgm() {
    this.isPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  speakNarration(text, speed = 1.0) {
    if (this.isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utt = new SpeechSynthesisUtterance(text);
      utt.lang = 'id-ID';
      utt.rate = 1.15 * speed;
      utt.pitch = 1.05;
      utt.volume = 0.95;

      const voices = window.speechSynthesis.getVoices();
      const idVoice = voices.find(v => v.lang.includes('id') || v.lang.includes('ID'));
      if (idVoice) utt.voice = idVoice;

      window.speechSynthesis.speak(utt);
    } catch (e) {}
  }

  stopNarration() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  destroy() {
    this.stopBgm();
    this.stopNarration();
    if (this.ctx && this.ctx.state !== 'closed') {
      try { this.ctx.close(); } catch (e) {}
    }
    this.ctx = null;
  }
}

export function VideoReviewModal({
  isOpen,
  onClose,
  approvalItem,
  allApprovals = [],
  onVerifyApproval,
  onManualPublishTrigger,
  activePilar = 'Multimedia'
}) {
  const [selectedPresetId, setSelectedPresetId] = useState(approvalItem?.id || 'a1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sliderPos, setSliderPos] = useState(55);
  const [showTikTokOverlay, setShowTikTokOverlay] = useState(true);
  const [showSafeZone, setShowSafeZone] = useState(false);
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [activeSpeed, setActiveSpeed] = useState(1.0);
  const [copiedNotification, setCopiedNotification] = useState(null);

  // Sound Engine Instance
  const soundEngineRef = useRef(null);
  if (!soundEngineRef.current) {
    soundEngineRef.current = new ReviewSoundEngine();
  }

  // Gabungkan daftar video draf dari hasil brainstorming karyawan + preset pilar
  const combinedVideoList = useMemo(() => {
    const list = [];
    const seenIds = new Set();

    // 1. Draf hasil brainstorming & naskah/editing tim karyawan (prioritas tertinggi)
    if (Array.isArray(allApprovals)) {
      allApprovals.forEach(app => {
        if (app && app.id && !seenIds.has(app.id)) {
          seenIds.add(app.id);
          list.push(buildDynamicVideoReviewData(app));
        }
      });
    }

    // 2. Preset acuan pilar MMA
    VIDEO_REVIEW_PRESETS.forEach(preset => {
      if (!seenIds.has(preset.id)) {
        seenIds.add(preset.id);
        list.push(preset);
      }
    });

    return list;
  }, [allApprovals]);

  // Tentukan data video aktif
  const videoData = useMemo(() => {
    // 1. Cek dari daftar gabungan berdasarkan selectedPresetId
    const found = combinedVideoList.find(p => p.id === selectedPresetId);
    if (found) return found;

    // 2. Jika approvalItem sedang aktif, bangun dinamis
    if (approvalItem) {
      return buildDynamicVideoReviewData(approvalItem);
    }

    return combinedVideoList[0] || VIDEO_REVIEW_PRESETS[0];
  }, [selectedPresetId, approvalItem, combinedVideoList]);

  // Sinkronisasi saat approvalItem berubah atau saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      if (approvalItem?.id) {
        setSelectedPresetId(approvalItem.id);
      } else if (combinedVideoList.length > 0) {
        setSelectedPresetId(combinedVideoList[0].id);
      }
    }
  }, [isOpen, approvalItem, combinedVideoList]);

  // Reset timer & audio saat berganti video
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    setIsRevisionMode(false);
    setRevisionNote('');
    soundEngineRef.current.stopBgm();
    soundEngineRef.current.stopNarration();
  }, [selectedPresetId]);

  // Sinkronisasi status mute dengan Sound Engine
  useEffect(() => {
    soundEngineRef.current.isMuted = isMuted;
    if (isMuted) {
      soundEngineRef.current.stopNarration();
    }
  }, [isMuted]);

  // Cleanup saat unmount modal
  useEffect(() => {
    return () => {
      soundEngineRef.current.destroy();
    };
  }, []);

  // Subtitle aktif saat detik ini
  const activeSubtitleIndex = useMemo(() => {
    const idx = videoData.subtitles.findIndex(
      s => currentTime >= s.start && currentTime < s.end
    );
    return idx !== -1 ? idx : 0;
  }, [currentTime, videoData.subtitles]);

  const activeSubtitle = videoData.subtitles[activeSubtitleIndex] || videoData.subtitles[0];

  // Identifikasi Adegan / Scene Aktif (0: Hook, 1: Problem, 2: Solusi/Praktik, 3: CTA)
  const currentSceneIndex = useMemo(() => {
    if (currentTime < 4) return 0; // Hook 3-4s awal
    if (currentTime < 11) return 1; // Studi Kasus & Masalah
    if (currentTime < 22) return 2; // Praktik Eksekusi Studio
    return 3; // Call to Action & Bookmark
  }, [currentTime]);

  // Loop pemutar video simulasi (30 FPS timer)
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setCurrentTime(prev => {
        const next = prev + 0.1 * activeSpeed;
        if (next >= videoData.durasi) {
          return 0; // Loop kembali ke awal
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, activeSpeed, videoData.durasi]);

  // Sinkronisasi Narasi Suara saat Subtitle Berganti
  const lastSpokenSubRef = useRef(-1);
  useEffect(() => {
    if (!isPlaying || isMuted) return;

    if (activeSubtitleIndex !== lastSpokenSubRef.current) {
      lastSpokenSubRef.current = activeSubtitleIndex;
      soundEngineRef.current.speakNarration(activeSubtitle.text, activeSpeed);
    }
  }, [activeSubtitleIndex, isPlaying, isMuted, activeSubtitle.text, activeSpeed]);

  if (!isOpen) return null;

  const togglePlay = () => {
    setIsPlaying(prev => {
      const next = !prev;
      if (next) {
        soundEngineRef.current.startBgm();
        lastSpokenSubRef.current = activeSubtitleIndex;
        soundEngineRef.current.speakNarration(activeSubtitle.text, activeSpeed);
      } else {
        soundEngineRef.current.stopBgm();
        soundEngineRef.current.stopNarration();
      }
      return next;
    });
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const targetSec = pct * videoData.durasi;
    setCurrentTime(targetSec);
    lastSpokenSubRef.current = -1;
    if (isPlaying && !isMuted) {
      soundEngineRef.current.speakNarration(activeSubtitle.text, activeSpeed);
    }
  };

  const formatTime = (sec) => {
    const s = Math.floor(sec);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${String(rem).padStart(2, '0')}`;
  };

  const handleApprove = () => {
    soundEngineRef.current.stopBgm();
    soundEngineRef.current.stopNarration();
    if (onVerifyApproval) {
      onVerifyApproval(videoData.id, 'ok');
    }
    onClose();
  };

  const handleSendRevision = () => {
    soundEngineRef.current.stopBgm();
    soundEngineRef.current.stopNarration();
    const note = revisionNote.trim() || 'Perbaiki hook detik ke-2 dan naikkan volume vokal +2dB agar lolos verifikasi FYP.';
    if (onVerifyApproval) {
      onVerifyApproval(videoData.id, 'rev', note);
    }
    setIsRevisionMode(false);
    onClose();
  };

  const handleCopyBundle = () => {
    const bundleText = `${videoData.judul}\n\n${videoData.socialStats.caption}\n\nAudio: ${videoData.socialStats.sound}`;
    navigator.clipboard.writeText(bundleText);
    setCopiedNotification('Caption & Hashtag SEO Berhasil Disalin ke Clipboard!');
    setTimeout(() => setCopiedNotification(null), 3000);
  };

  const presetRevisionNotes = [
    'Hook detik 0-3 kurang memicu penasaran, ganti kalimat pembuka.',
    'Volume vokal narator tertutup suara musik, sesuaikan balance ke -14 LUFS.',
    'Posisi subtitle terlalu bawah, geser naik ke zona aman safe-zone.',
    'Color grading terlalu gelap di layar smartphone, naikkan exposure shadow.'
  ];

  const sceneTitles = [
    { tag: '🔥 SCENE 1: HOOK 3 DETIK', desc: 'Scroll Stopper & Visual Kaget' },
    { tag: '💡 SCENE 2: STUDI KASUS & MASALAH', desc: 'Perbandingan Sebelum vs Sesudah' },
    { tag: '🎬 SCENE 3: DEMONSTRASI PRAKTIS', desc: 'Setup Studio & Eksekusi Trik' },
    { tag: '🚀 SCENE 4: CALL TO ACTION', desc: 'Ajakan Simpan & Share FYP' }
  ];

  return (
    <div
      className="video-review-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-review-modal-title"
    >
      <div className="video-review-modal-content">
        {/* HEADER MODAL */}
        <header className="video-review-header">
          <div className="review-title-group">
            <div className="review-tag-row">
              <span className="badge-qc-live">🎬 VIDEO QC & VERIFICATION GATE</span>
              <span className="badge-format-tag">9:16 VERTICAL (REELS & TIKTOK)</span>
              <span className="badge-pilar-tag">{videoData.pilar}</span>
              <span className="badge-audio-live">{isPlaying ? '🔊 AUDIO BEAT & VOKAL AKTIF' : '⏸ SIAP DIPUTAR'}</span>
            </div>
            <h2 id="video-review-modal-title" className="review-modal-title">
              Review Hasil Video: {videoData.judul}
            </h2>
            <p className="review-modal-sub">
              Hasil editan Editor AI & Videographer AI dari naskah brainstorming tim MMA Production.
            </p>
          </div>

          <div className="review-header-actions">
            {/* Pemilih Video Draf dari Brainstorming Tim */}
            <select
              className="preset-video-select"
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              aria-label="Pilih Video Draf untuk Direview"
            >
              {combinedVideoList.map(preset => (
                <option key={preset.id} value={preset.id}>
                  {preset.editor ? `[${preset.editor.split(' ')[0]}]` : ''} {preset.pilar}: {preset.judul}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="close-review-btn"
              onClick={() => {
                soundEngineRef.current.stopBgm();
                soundEngineRef.current.stopNarration();
                onClose();
              }}
              aria-label="Tutup Review Video"
            >
              ✕
            </button>
          </div>
        </header>

        {/* BODY DUA KOLOM: PEMUTAR VIDEO 9:16 + PANEL QC & KEPUTUSAN */}
        <div className="video-review-grid">
          {/* KOLOM 1: SIMULATOR PEMUTAR SMARTPHONE 9:16 DINAMIS */}
          <section className="phone-mockup-section" aria-label="Simulator Pemutar Video 9:16">
            <div className="phone-frame">
              {/* Dynamic Island / Notch */}
              <div className="phone-notch">
                <span className="notch-speaker" />
                <span className="notch-camera" />
              </div>

              {/* INDIKATOR SCENE ADEGAN DINAMIS DI ATAS SMARTPHONE */}
              <div className="phone-scene-tag-bar">
                <span className="scene-number-tag">{sceneTitles[currentSceneIndex].tag}</span>
                <span className="scene-desc-tag">{sceneTitles[currentSceneIndex].desc}</span>
              </div>

              {/* LAYAR VIDEO VERTIKAL DINAMIS BERGERAK */}
              <div className="phone-screen" onClick={togglePlay} title="Klik layar untuk Play / Pause">
                <div className={`video-visual-stage scene-${currentSceneIndex} ${isPlaying ? 'is-playing' : ''}`}>
                  {/* Sisi After (Cinematic Grading DaVinci) */}
                  <div className="video-after-layer">
                    <div className={`studio-light-beam ${isPlaying ? 'light-sweep' : ''}`} />
                    
                    {/* Elemen Visual Sesuai Adegan (Multi-Scene Graphics Dinamis) */}
                    {currentSceneIndex === 0 && (
                      <div className="scene-hook-overlay">
                        <div className="hook-warning-pill">⚡ HOOK VIRAL 3S • {videoData.pilar.toUpperCase()}</div>
                        <h3 className="hook-big-headline">{videoData.hook3sText || videoData.subtitles[0]?.text || 'HOOK VIRAL'}</h3>
                      </div>
                    )}

                    {currentSceneIndex === 1 && (
                      <div className="scene-vectorscope-overlay">
                        <span className="vectorscope-badge">{videoData.colorGrade}</span>
                        <div className="color-meter-bars">
                          <span className="bar r" style={{ height: '70%' }}></span>
                          <span className="bar g" style={{ height: '85%' }}></span>
                          <span className="bar b" style={{ height: '65%' }}></span>
                        </div>
                      </div>
                    )}

                    {currentSceneIndex === 2 && (
                      <div className="scene-tutorial-step-overlay">
                        <div className="step-callout-card">
                          <span className="step-num">STUDI & SOLUSI TIM</span>
                          <strong className="step-txt">{videoData.subtitles[2]?.text || videoData.judul}</strong>
                        </div>
                      </div>
                    )}

                    {currentSceneIndex === 3 && (
                      <div className="scene-cta-overlay">
                        <div className="cta-bookmark-glow">📌 {videoData.subtitles[3]?.text || 'Simpan Video Ini Sebelum Hilang!'}</div>
                      </div>
                    )}

                    {/* Presenter Karakter Dinamis dengan Lip-Sync & Gerak Berbicara */}
                    <div className={`presenter-avatar-box ${isPlaying ? 'avatar-talking' : ''}`}>
                      <div className="avatar-siluet after-glow">
                        <div className="avatar-head">
                          <span className="avatar-eyes">{isPlaying && currentTime % 3 < 0.2 ? '— —' : '● ●'}</span>
                          <span className={`avatar-mouth ${isPlaying ? 'mouth-talk' : ''}`}></span>
                        </div>
                        <div className="avatar-torso" />
                        <div className="cinematic-fill-light" />
                      </div>
                    </div>

                    <span className="stage-side-label after-label">
                      {videoData.beforeAfter.afterLabel}
                    </span>
                  </div>

                  {/* Sisi Before (Dipotong oleh slider Before/After) */}
                  <div
                    className="video-before-layer"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                  >
                    <div className="presenter-avatar-box">
                      <div className="avatar-siluet before-shadow">
                        <div className="avatar-head">
                          <span className="avatar-eyes">● ●</span>
                          <span className="avatar-mouth flat"></span>
                        </div>
                        <div className="avatar-torso flat" />
                      </div>
                    </div>
                    <span className="stage-side-label before-label">
                      {videoData.beforeAfter.beforeLabel}
                    </span>
                  </div>

                  {/* Garis Pembagi Slider Before/After */}
                  <div
                    className="split-slider-line"
                    style={{ left: `${sliderPos}%` }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="slider-handle" title="Tarik untuk membandingkan Sebelum & Sesudah">
                      ◀ ▶
                    </div>
                  </div>

                  {/* Interactive Slider Input */}
                  <input
                    type="range"
                    min="5"
                    max="95"
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    className="split-range-input"
                    aria-label="Slider Perbandingan Sebelum dan Sesudah"
                  />

                  {/* GARIS SAFE ZONE MEDSOS (Dotted Neon Line) */}
                  {showSafeZone && (
                    <div className="safe-zone-overlay" title="Area Aman: Bebas dari tabrakan tombol medsos">
                      <div className="safe-zone-box">
                        <span className="safe-zone-tag">SAFE ZONE KONTEN</span>
                      </div>
                    </div>
                  )}

                  {/* SUBTITLE KARAOKE CAPCUT / DAVINCI STYLE BERGERAK */}
                  <div className="video-subtitle-container">
                    <div className={`subtitle-card ${isPlaying ? 'pulse-text' : ''}`}>
                      <span className="subtitle-text">
                        {activeSubtitle.text.split(activeSubtitle.highlight).map((part, i, arr) => (
                          <React.Fragment key={i}>
                            {part}
                            {i < arr.length - 1 && (
                              <span className="subtitle-highlight">
                                {activeSubtitle.highlight}
                              </span>
                            )}
                          </React.Fragment>
                        ))}
                      </span>
                    </div>
                  </div>

                  {/* OVERLAY UI TIKTOK / REELS */}
                  {showTikTokOverlay && (
                    <div className="tiktok-ui-overlay">
                      {/* Kolom Aksi Kanan TikTok */}
                      <div className="tiktok-right-actions">
                        <div className="tiktok-action-item profile">
                          <div className="tiktok-avatar">MMA</div>
                          <span className="tiktok-plus">+</span>
                        </div>
                        <div className="tiktok-action-item">
                          <span className="action-icon">❤️</span>
                          <span className="action-val">{videoData.socialStats.likes}</span>
                        </div>
                        <div className="tiktok-action-item">
                          <span className="action-icon">💬</span>
                          <span className="action-val">{videoData.socialStats.comments}</span>
                        </div>
                        <div className="tiktok-action-item">
                          <span className="action-icon">🔖</span>
                          <span className="action-val">{videoData.socialStats.bookmarks}</span>
                        </div>
                        <div className="tiktok-action-item">
                          <span className="action-icon">↗️</span>
                          <span className="action-val">{videoData.socialStats.shares}</span>
                        </div>
                        <div className={`tiktok-action-item disc ${isPlaying ? 'spinning' : ''}`}>
                          <span className="disc-icon">💿</span>
                        </div>
                      </div>

                      {/* Deskripsi & Audio Bawah TikTok */}
                      <div className="tiktok-bottom-meta">
                        <div className="tiktok-username">{OFFICIAL_SOCIAL_ACCOUNTS.tiktok.handle} • <b>Ikuti</b></div>
                        <p className="tiktok-caption">{videoData.socialStats.caption}</p>
                        <div className="tiktok-audio-row">
                          <span className="audio-music-icon">🎵</span>
                          <span className="audio-title">{videoData.socialStats.sound}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EQUALIZER AUDIO WAVE VISUALIZER DINAMIS */}
                  {isPlaying && !isMuted && (
                    <div className="audio-wave-bars">
                      {[14, 32, 48, 22, 42, 54, 28, 44, 20, 36, 48, 24].map((h, i) => (
                        <span
                          key={i}
                          className="wave-bar"
                          style={{
                            height: `${h}px`,
                            animationDuration: `${0.45 + (i % 3) * 0.15}s`,
                            animationDelay: `${i * 0.05}s`
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* TIMELINE PROGRESS & SCRUB BAR */}
                <div className="phone-scrub-bar" onClick={handleSeek} title="Klik untuk melompat ke menit tertentu">
                  <div
                    className="phone-scrub-fill"
                    style={{ width: `${(currentTime / videoData.durasi) * 100}%` }}
                  />
                  <div
                    className="phone-scrub-handle"
                    style={{ left: `${(currentTime / videoData.durasi) * 100}%` }}
                  />
                </div>
              </div>

              {/* KONTROL PEMUTAR BAWAH LENGKAP */}
              <div className="player-controls-strip">
                <button
                  type="button"
                  className={`control-play-btn ${isPlaying ? 'playing' : ''}`}
                  onClick={togglePlay}
                  title={isPlaying ? 'Jeda Video' : 'Putar Video dengan Suara & Narasi'}
                >
                  {isPlaying ? '⏸ Jeda' : '▶ Putar Video'}
                </button>

                {/* Tombol Mute / Unmute Suara & Voiceover */}
                <button
                  type="button"
                  className={`control-audio-toggle ${isMuted ? 'muted' : 'active'}`}
                  onClick={() => setIsMuted(prev => !prev)}
                  title={isMuted ? 'Aktifkan Suara Lo-Fi Beat & Voiceover' : 'Bisukan Suara'}
                >
                  {isMuted ? '🔇 Bisu' : '🔊 Suara: ON'}
                </button>

                <button
                  type="button"
                  className="control-replay-btn"
                  onClick={() => {
                    setCurrentTime(0);
                    lastSpokenSubRef.current = -1;
                    if (isPlaying && !isMuted) {
                      soundEngineRef.current.speakNarration(videoData.subtitles[0].text, activeSpeed);
                    }
                  }}
                  title="Mulai Ulang dari Detik ke-0"
                >
                  ↺ 0:00
                </button>

                <div className="time-display-val">
                  <span>{formatTime(currentTime)}</span> / <span>{formatTime(videoData.durasi)}</span>
                </div>

                <div className="speed-pills">
                  {[1.0, 1.25, 1.5].map(spd => (
                    <button
                      key={spd}
                      type="button"
                      className={`speed-pill ${activeSpeed === spd ? 'active' : ''}`}
                      onClick={() => setActiveSpeed(spd)}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* TOGGLE OPTIONS DI BAWAH PHONE */}
            <div className="phone-toggles-row">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={showTikTokOverlay}
                  onChange={(e) => setShowTikTokOverlay(e.target.checked)}
                />
                <span>📱 Overlay UI Medsos</span>
              </label>

              <label className="toggle-label">
                <input
                  type="checkbox"
                  checked={showSafeZone}
                  onChange={(e) => setShowSafeZone(e.target.checked)}
                />
                <span>🛡️ Garis Safe Zone</span>
              </label>

              <button
                type="button"
                className="btn-quick-copy-bundle"
                onClick={handleCopyBundle}
                title="Salin Naskah, Caption & Hashtag ke Clipboard"
              >
                📋 Salin Caption
              </button>
            </div>

            {copiedNotification && (
              <div className="copied-toast-banner">
                ✓ {copiedNotification}
              </div>
            )}
          </section>

          {/* KOLOM 2: QUALITY CONTROL (QC) CHECKLIST & KEPUTUSAN VERIFIKASI */}
          <section className="qc-details-section" aria-label="Panel Verifikasi Kelayakan dan Checklist QC">
            {/* SPESIFIKASI TEKNIS VIDEO */}
            <div className="qc-specs-card">
              <h3 className="qc-section-title">📊 Spesifikasi Teknis Video</h3>
              <div className="specs-grid">
                <div className="spec-item">
                  <span className="spec-label">Resolusi & FPS:</span>
                  <span className="spec-val highlight">{videoData.resolusi}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Durasi Video:</span>
                  <span className="spec-val">{videoData.durasi} Detik (Durasi Emas)</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Color Grading:</span>
                  <span className="spec-val">{videoData.colorGrade}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Audio & Voice:</span>
                  <span className="spec-val highlight">{videoData.audioProfile}</span>
                </div>
                <div className="spec-item full">
                  <span className="spec-label">Eksekusi Tim:</span>
                  <span className="spec-val">{videoData.editor} & {videoData.videographer}</span>
                </div>
              </div>
            </div>

            {/* SKOR PREDIKSI KELAYAKAN FYP */}
            <div className="fyp-score-card">
              <div className="score-top-row">
                <div className="score-meter">
                  <span className="score-number">{videoData.fypScore}%</span>
                  <span className="score-sub">Peluang FYP</span>
                </div>
                <div className="score-verdict-box">
                  <span className="verdict-tag pass">✓ {videoData.fypVerdict}</span>
                  <p className="verdict-desc">{videoData.summary}</p>
                </div>
              </div>
            </div>

            {/* 4 CHECKLIST QUALITY CONTROL (QC) KELAYAKAN */}
            <div className="qc-checklist-card">
              <h3 className="qc-section-title">📋 Checklist Verifikasi Kualitas (Pre-Upload)</h3>
              <ul className="qc-list">
                {videoData.qcChecklist.map(qc => (
                  <li key={qc.id} className="qc-item">
                    <div className="qc-item-header">
                      <span className="qc-status-badge pass">✓ LOLOS</span>
                      <strong className="qc-label">{qc.label}</strong>
                      <span className="qc-score-pill">{qc.score}%</span>
                    </div>
                    <p className="qc-note">{qc.note}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* TARGET DISTRIBUSI MEDSOS RESMI */}
            <div className="qc-target-accounts-card">
              <div className="target-accounts-header">
                <h3 className="qc-section-title">🎯 Akun Target Distribusi Otomatis</h3>
                <span className="auto-sync-pill">⚡ Terhubung Jadwal Jam Kantor</span>
              </div>
              <p className="qc-accounts-sub">
                Saat disetujui, video ini otomatis masuk antrean tayang dan langsung diterbitkan ke 3 platform resmi MMA Production saat waktu jadwal rilis tiba:
              </p>
              <div className="social-accounts-grid">
                <a
                  href={OFFICIAL_SOCIAL_ACCOUNTS.tiktok.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-account-badge tiktok"
                  title="Buka profil TikTok MMA Production"
                >
                  <span className="platform-icon">🎵</span>
                  <div className="platform-info">
                    <span className="platform-name">TikTok Official</span>
                    <strong className="platform-handle">{OFFICIAL_SOCIAL_ACCOUNTS.tiktok.handle}</strong>
                    <span className="platform-meta">{OFFICIAL_SOCIAL_ACCOUNTS.tiktok.format}</span>
                  </div>
                  <span className="platform-link-icon">↗</span>
                </a>

                <a
                  href={OFFICIAL_SOCIAL_ACCOUNTS.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-account-badge instagram"
                  title="Buka profil Instagram MMA Desain"
                >
                  <span className="platform-icon">📸</span>
                  <div className="platform-info">
                    <span className="platform-name">Instagram Reels</span>
                    <strong className="platform-handle">{OFFICIAL_SOCIAL_ACCOUNTS.instagram.handle}</strong>
                    <span className="platform-meta">{OFFICIAL_SOCIAL_ACCOUNTS.instagram.format}</span>
                  </div>
                  <span className="platform-link-icon">↗</span>
                </a>

                <a
                  href={OFFICIAL_SOCIAL_ACCOUNTS.youtube.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-account-badge youtube"
                  title="Buka channel YouTube Muiz"
                >
                  <span className="platform-icon">🔴</span>
                  <div className="platform-info">
                    <span className="platform-name">YouTube Shorts</span>
                    <strong className="platform-handle">{OFFICIAL_SOCIAL_ACCOUNTS.youtube.handle}</strong>
                    <span className="platform-meta">{OFFICIAL_SOCIAL_ACCOUNTS.youtube.format}</span>
                  </div>
                  <span className="platform-link-icon">↗</span>
                </a>
              </div>
            </div>

            {/* FORMULIR CATATAN REVISI JIKA MINTA REVISI */}
            {isRevisionMode && (
              <div className="revision-feedback-card">
                <h4 className="rev-title">⚠️ Catatan Revisi untuk Tim Editor</h4>
                <p className="rev-sub">Pilih catatan cepat atau ketik instruksi koreksi:</p>
                <div className="preset-notes-group">
                  {presetRevisionNotes.map((note, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="preset-note-chip"
                      onClick={() => setRevisionNote(note)}
                    >
                      {note}
                    </button>
                  ))}
                </div>
                <textarea
                  className="revision-textarea"
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Ketik instruksi koreksi untuk Tim Editor (misal: ganti sound effect di detik ke-10)..."
                  rows={3}
                />
                <div className="revision-actions-row">
                  <button
                    type="button"
                    className="btn-submit-revision"
                    onClick={handleSendRevision}
                  >
                    Kirim Revisi ke Tim Editor
                  </button>
                  <button
                    type="button"
                    className="btn-cancel-revision"
                    onClick={() => setIsRevisionMode(false)}
                  >
                    Batal
                  </button>
                </div>
              </div>
            )}

            {/* TOMBOL KEPUTUSAN UTAMA CEO */}
            {!isRevisionMode && (
              <div className="review-decision-actions">
                <button
                  type="button"
                  className="btn-approve-video"
                  onClick={handleApprove}
                >
                  <span className="btn-icon">✓</span>
                  <div className="btn-text-group">
                    <span className="btn-main-label">VERIFIKASI & SETUJUI UNTUK DIUNGGAH</span>
                    <span className="btn-sub-label">Diteruskan ke Tim Medsos (Upload Video, Caption & Story)</span>
                  </div>
                </button>

                <button
                  type="button"
                  className="btn-reject-video"
                  onClick={() => setIsRevisionMode(true)}
                >
                  <span className="btn-icon">✎</span>
                  <div className="btn-text-group">
                    <span className="btn-main-label">MINTA REVISI KE EDITOR</span>
                    <span className="btn-sub-label">Kembalikan draf video ke meja editing untuk perbaikan</span>
                  </div>
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
