import React, { useState, useEffect, useRef } from 'react';
import { VIDEO_REVIEW_PRESETS, getVideoReviewPreset } from '../constants/videoReviewData';

export function VideoReviewModal({
  isOpen,
  onClose,
  approvalItem,
  onVerifyApproval,
  activePilar = 'Multimedia'
}) {
  const [selectedPresetId, setSelectedPresetId] = useState(approvalItem?.id || 'a1');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [sliderPos, setSliderPos] = useState(55); // Before/After split position (%)
  const [showTikTokOverlay, setShowTikTokOverlay] = useState(true);
  const [showSafeZone, setShowSafeZone] = useState(true);
  const [isRevisionMode, setIsRevisionMode] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');
  const [activeSpeed, setActiveSpeed] = useState(1.0);

  const videoData = getVideoReviewPreset(selectedPresetId) || VIDEO_REVIEW_PRESETS[0];

  // Sinkronisasi preset saat approvalItem berubah
  useEffect(() => {
    if (approvalItem?.id) {
      setSelectedPresetId(approvalItem.id);
    } else {
      const match = VIDEO_REVIEW_PRESETS.find(p => p.pilar.toLowerCase() === activePilar.toLowerCase());
      if (match) setSelectedPresetId(match.id);
    }
  }, [approvalItem, activePilar]);

  // Reset timer saat berganti preset
  useEffect(() => {
    setCurrentTime(0);
    setIsPlaying(false);
    setIsRevisionMode(false);
    setRevisionNote('');
  }, [selectedPresetId]);

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

  if (!isOpen) return null;

  // Subtitle aktif saat detik ini
  const activeSubtitle = videoData.subtitles.find(
    s => currentTime >= s.start && currentTime < s.end
  ) || videoData.subtitles[0];

  const formatTime = (sec) => {
    const s = Math.floor(sec);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m}:${String(rem).padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    setCurrentTime(pct * videoData.durasi);
  };

  const handleApprove = () => {
    if (onVerifyApproval) {
      onVerifyApproval(videoData.id, 'ok');
    }
    onClose();
  };

  const handleSendRevision = () => {
    const note = revisionNote.trim() || 'Perbaiki hook detik ke-2 dan naikkan volume vokal +2dB agar lolos verifikasi FYP.';
    if (onVerifyApproval) {
      onVerifyApproval(videoData.id, 'rev', note);
    }
    setIsRevisionMode(false);
    onClose();
  };

  const presetRevisionNotes = [
    'Hook detik 0-3 kurang memicu penasaran, ganti kalimat pembuka.',
    'Volume vokal terlalu kecil, tertutup suara backsound musik.',
    'Posisi subtitle terlalu ke bawah, tertutup tombol deskripsi TikTok.',
    'Color grading terlalu gelap di layar smartphone, naikkan exposure shadow.'
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
            </div>
            <h2 id="video-review-modal-title" className="review-modal-title">
              Review Hasil Video: {videoData.judul}
            </h2>
            <p className="review-modal-sub">
              Verifikasi kelayakan materi video sebelum diteruskan ke Tim Medsos (Upload Video, Caption, Story).
            </p>
          </div>

          <div className="review-header-actions">
            {/* Pemilih Video Draf yang Tersedia */}
            <select
              className="preset-video-select"
              value={selectedPresetId}
              onChange={(e) => setSelectedPresetId(e.target.value)}
              aria-label="Pilih Video Draf untuk Direview"
            >
              {VIDEO_REVIEW_PRESETS.map(preset => (
                <option key={preset.id} value={preset.id}>
                  {preset.pilar}: {preset.judul}
                </option>
              ))}
            </select>

            <button
              type="button"
              className="close-review-btn"
              onClick={onClose}
              aria-label="Tutup Review Video"
            >
              ✕
            </button>
          </div>
        </header>

        {/* BODY DUA KOLOM: PEMUTAR VIDEO 9:16 + PANEL QC & KEPUTUSAN */}
        <div className="video-review-grid">
          {/* KOLOM 1: SIMULATOR PEMUTAR SMARTPHONE 9:16 */}
          <section className="phone-mockup-section" aria-label="Simulator Pemutar Video 9:16">
            <div className="phone-frame">
              {/* Dynamic Island / Notch */}
              <div className="phone-notch">
                <span className="notch-speaker" />
                <span className="notch-camera" />
              </div>

              {/* LAYAR VIDEO VERTIKAL */}
              <div className="phone-screen">
                {/* Visual Stage Simulasi Video (Split-screen Before/After Slider) */}
                <div className="video-visual-stage">
                  {/* Sisi After (Cinematic Grading) */}
                  <div className="video-after-layer">
                    <div className="studio-light-beam" />
                    <div className="presenter-avatar-box">
                      <div className="avatar-siluet after-glow">
                        <span className="avatar-face">🎬</span>
                        <div className="cinematic-fill-light" />
                      </div>
                    </div>
                    <span className="stage-side-label after-label">
                      {videoData.beforeAfter.afterLabel}
                    </span>
                  </div>

                  {/* Sisi Before (Dipotong oleh slider) */}
                  <div
                    className="video-before-layer"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                  >
                    <div className="presenter-avatar-box">
                      <div className="avatar-siluet before-shadow">
                        <span className="avatar-face">😐</span>
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

                  {/* SUBTITLE KARAOKE CAPCUT / DAVINCI STYLE */}
                  <div className="video-subtitle-container">
                    <div className="subtitle-card">
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
                        <div className="tiktok-username">@mmaproduction • <b>Ikuti</b></div>
                        <p className="tiktok-caption">{videoData.socialStats.caption}</p>
                        <div className="tiktok-audio-row">
                          <span className="audio-music-icon">🎵</span>
                          <span className="audio-title">{videoData.socialStats.sound}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Audio Wave Visualizer Bars */}
                  {isPlaying && (
                    <div className="audio-wave-bars">
                      {[12, 28, 45, 20, 36, 50, 24, 40, 16, 32].map((h, i) => (
                        <span
                          key={i}
                          className="wave-bar"
                          style={{ height: `${h}px`, animationDelay: `${i * 0.08}s` }}
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

              {/* KONTROL PEMUTAR BAWAH */}
              <div className="player-controls-strip">
                <button
                  type="button"
                  className="control-play-btn"
                  onClick={() => setIsPlaying(prev => !prev)}
                  title={isPlaying ? 'Jeda Video' : 'Putar Video'}
                >
                  {isPlaying ? '⏸ Jeda' : '▶ Putar'}
                </button>

                <button
                  type="button"
                  className="control-replay-btn"
                  onClick={() => setCurrentTime(0)}
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
            </div>
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
                  <span className="spec-label">Target Loudness:</span>
                  <span className="spec-val">{videoData.audioProfile}</span>
                </div>
                <div className="spec-item full">
                  <span className="spec-label">Tim Produksi:</span>
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
                  className="rev-textarea"
                  rows={3}
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder="Ketik instruksi revisi detail untuk Editor & Videographer..."
                />
                <div className="rev-actions-row">
                  <button
                    type="button"
                    className="btn-cancel-rev"
                    onClick={() => setIsRevisionMode(false)}
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    className="btn-submit-rev"
                    onClick={handleSendRevision}
                  >
                    Kirim Revisi ke Editor
                  </button>
                </div>
              </div>
            )}

            {/* TOMBOL KEPUTUSAN VERIFIKASI UTAMA */}
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
                  <span className="btn-icon">✕</span>
                  <div className="btn-text-group">
                    <span className="btn-main-label">MINTA REVISI KE EDITOR</span>
                    <span className="btn-sub-label">Kembalikan ke timeline editing dengan catatan koreksi</span>
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
