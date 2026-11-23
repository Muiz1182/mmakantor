import React, { useState, useEffect } from 'react';
import { OFFICIAL_SOCIAL_ACCOUNTS } from '../constants/videoReviewData';
import { api } from '../services/api';

export function SocialIntegrationModal({ isOpen, onClose, onManualPublishTrigger }) {
  const [socialStatus, setSocialStatus] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeTab, setActiveTab] = useState('accounts'); // 'accounts' | 'guide' | 'fallback'
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchStatus = async () => {
      const res = await api.getSocialStatus();
      if (res && res.success) {
        setSocialStatus(res.data);
      }
    };
    fetchStatus();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleTestPublish = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await api.publishSocials({
        title: 'Uji Publikasi Tahap 5 MMA Production',
        caption: 'Uji konektivitas multi-platform video edukasi viral ke TikTok, Instagram, dan YouTube. #mmaproduction #antislop',
        scheduledTime: 'Uji Cepat Realtime'
      });
      if (res && res.success) {
        setTestResult('success');
        if (onManualPublishTrigger) {
          onManualPublishTrigger({
            title: 'Uji Publikasi Tahap 5',
            time: 'Realtime',
            platform: 'TikTok, Instagram, YouTube'
          });
        }
      } else {
        setTestResult('error');
      }
    } catch (err) {
      setTestResult('error');
    } finally {
      setIsTesting(false);
    }
  };

  const accounts = [
    {
      id: 'tiktok',
      name: 'TikTok Official',
      handle: OFFICIAL_SOCIAL_ACCOUNTS.tiktok.handle,
      url: OFFICIAL_SOCIAL_ACCOUNTS.tiktok.url,
      uploadUrl: 'https://www.tiktok.com/creator-center/upload',
      icon: '🎵',
      color: '#ff0050',
      type: 'Video 9:16 Vertikal',
      tokenEnv: 'TIKTOK_ACCESS_TOKEN',
      hasToken: Boolean(socialStatus?.accounts?.tiktok?.isConfigured)
    },
    {
      id: 'instagram',
      name: 'Instagram Reels',
      handle: OFFICIAL_SOCIAL_ACCOUNTS.instagram.handle,
      url: OFFICIAL_SOCIAL_ACCOUNTS.instagram.url,
      uploadUrl: 'https://www.instagram.com/',
      icon: '📸',
      color: '#e1306c',
      type: 'Instagram Reels 4K 60fps',
      tokenEnv: 'INSTAGRAM_ACCESS_TOKEN',
      hasToken: Boolean(socialStatus?.accounts?.instagram?.isConfigured)
    },
    {
      id: 'youtube',
      name: 'YouTube Shorts',
      handle: OFFICIAL_SOCIAL_ACCOUNTS.youtube.handle,
      url: OFFICIAL_SOCIAL_ACCOUNTS.youtube.url,
      uploadUrl: 'https://studio.youtube.com/',
      icon: '🔴',
      color: '#ff0000',
      type: 'YouTube Shorts #Shorts',
      tokenEnv: 'YOUTUBE_API_KEY',
      hasToken: Boolean(socialStatus?.accounts?.youtube?.isConfigured)
    }
  ];

  return (
    <div className="modal-backdrop-blur" onClick={onClose} role="dialog" aria-modal="true">
      <div className="social-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* HEADER MODAL */}
        <header className="social-modal-header">
          <div className="header-brand-group">
            <span className="social-badge-pill">TAHAP 5: INTEGRASI MEDSOS & FALLBACK</span>
            <h2 className="social-modal-title">Hubungan Akun Media Sosial Resmi</h2>
            <p className="social-modal-desc">
              Penerbitan otomatis hasil review video 9:16 ke akun TikTok, Instagram, dan YouTube MMA Production.
            </p>
          </div>
          <button type="button" className="btn-close-social-modal" onClick={onClose} title="Tutup">
            ✕
          </button>
        </header>

        {/* TAB NAVIGASI */}
        <div className="social-tabs-bar">
          <button
            type="button"
            className={`social-tab-btn ${activeTab === 'accounts' ? 'active' : ''}`}
            onClick={() => setActiveTab('accounts')}
          >
            🎯 3 Akun Terhubung
          </button>
          <button
            type="button"
            className={`social-tab-btn ${activeTab === 'guide' ? 'active' : ''}`}
            onClick={() => setActiveTab('guide')}
          >
            🔑 Fungsi & Panduan Token
          </button>
          <button
            type="button"
            className={`social-tab-btn ${activeTab === 'fallback' ? 'active' : ''}`}
            onClick={() => setActiveTab('fallback')}
          >
            🛡️ Mode Cadangan (Fallback)
          </button>
        </div>

        {/* ISI MODAL SESUAI TAB */}
        <div className="social-modal-body">
          {activeTab === 'accounts' && (
            <div className="accounts-tab-content">
              <div className="account-cards-list">
                {accounts.map(acc => (
                  <div key={acc.id} className="platform-integration-card">
                    <div className="platform-card-header">
                      <span className="platform-card-icon" style={{ borderColor: acc.color }}>{acc.icon}</span>
                      <div className="platform-card-titles">
                        <h4 className="platform-card-name">{acc.name}</h4>
                        <a
                          href={acc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="platform-card-handle-link"
                          title={`Buka profil ${acc.handle}`}
                        >
                          {acc.handle} ↗
                        </a>
                      </div>
                      <span className={`token-status-pill ${acc.hasToken ? 'active' : 'fallback'}`}>
                        {acc.hasToken ? '✓ API Token Terhubung' : '⚡ Mode Cadangan Aktif'}
                      </span>
                    </div>

                    <div className="platform-card-specs">
                      <div className="spec-row">
                        <span className="spec-k">Format Tayang:</span>
                        <span className="spec-v">{acc.type}</span>
                      </div>
                      <div className="spec-row">
                        <span className="spec-k">Variabel .env:</span>
                        <code className="spec-env-code">{acc.tokenEnv}</code>
                      </div>
                    </div>

                    <div className="platform-card-actions">
                      <a
                        href={acc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-acc-action visit"
                      >
                        Buka Akun ↗
                      </a>
                      <a
                        href={acc.uploadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-acc-action upload"
                      >
                        Halaman Upload Web ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTION TEST PUBLISH */}
              <div className="test-publish-box">
                <div className="test-publish-info">
                  <strong>Simulasi & Uji Coba Pengiriman Multi-Platform</strong>
                  <p>Kirim sinyal upload simultan ke 3 platform resmi untuk memverifikasi kesiapan pipeline jadwal kantor.</p>
                </div>
                <button
                  type="button"
                  className="btn-test-publish"
                  onClick={handleTestPublish}
                  disabled={isTesting}
                >
                  {isTesting ? 'Menguji Koneksi...' : '🚀 Uji Publikasi Serentak Sekarang'}
                </button>
              </div>

              {testResult === 'success' && (
                <div className="test-alert-box success">
                  ✓ Berhasil! Sinyal publikasi tersalurkan ke TikTok (@mma.production7), Instagram (@mmadesain), dan YouTube (@Muiz1182). Tim Medsos mulai aktif.
                </div>
              )}
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="guide-tab-content">
              <div className="guide-intro-card">
                <h3 className="guide-card-title">💡 Untuk Apa Token Media Sosial Digunakan?</h3>
                <p className="guide-text">
                  Token Media Sosial (API Access Token) adalah <b>kunci otorisasi digital resmi</b> yang diberikan oleh Meta (Instagram), TikTok for Developers, dan Google Cloud (YouTube) kepada aplikasi Kantor MMA Production.
                </p>

                <div className="guide-comparison-grid">
                  <div className="compare-card without-token">
                    <h4>❌ Tanpa Token Media Sosial</h4>
                    <ul>
                      <li>Harus membuka aplikasi HP secara manual setiap kali jadwal tayang tiba.</li>
                      <li>Harus copy-paste judul, caption, dan 7 hashtag satu per satu.</li>
                      <li>Berisiko terlambat tayang jika jam 11:00 atau 19:00 WIB Anda sedang sibuk.</li>
                    </ul>
                  </div>

                  <div className="compare-card with-token">
                    <h4>✅ Dengan Token Media Sosial (Otomatis 100%)</h4>
                    <ul>
                      <li><b>Zero-Click Publish</b>: Begitu video disetujui CEO di review QC, video langsung tayang tepat di jam rilis.</li>
                      <li><b>Konsistensi Algoritma</b>: Jadwal jam tayang tidak pernah terlewat, menjaga retensi penonton & peluang FYP.</li>
                      <li><b>Multi-Posting</b>: Satu klik persetujuan otomatis terbit ke TikTok, Reels, dan Shorts serentak.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* LANGKAH MENDAPATKAN TOKEN */}
              <div className="steps-card">
                <h3 className="guide-card-title">📋 3 Langkah Mudah Mendapatkan Token Resmi</h3>
                <ol className="token-steps-list">
                  <li>
                    <strong>1. Instagram Reels (Meta for Developers):</strong>
                    <p>Buka <a href="https://developers.facebook.com/" target="_blank" rel="noreferrer">developers.facebook.com</a>, buat App bertipe Business, sambungkan akun IG <code>@mmadesain</code>, dan dapatkan User Token dengan izin <code>instagram_content_publish</code>.</p>
                  </li>
                  <li>
                    <strong>2. TikTok (TikTok for Developers):</strong>
                    <p>Buka <a href="https://developers.tiktok.com/" target="_blank" rel="noreferrer">developers.tiktok.com</a>, daftarkan aplikasi, dan aktifkan produk <b>Content Posting API</b> untuk akun <code>@mma.production7</code>.</p>
                  </li>
                  <li>
                    <strong>3. YouTube Shorts (Google Cloud Console):</strong>
                    <p>Buka <a href="https://console.cloud.google.com/" target="_blank" rel="noreferrer">console.cloud.google.com</a>, aktifkan <b>YouTube Data API v3</b>, dan salin API Key atau OAuth Client ID untuk channel <code>@Muiz1182</code>.</p>
                  </li>
                </ol>
                <p className="steps-footer-note">
                  Setelah mendapatkan token, salin dan masukkan nilainya ke dalam file <code>.env</code> di folder utama proyek kantor ini.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'fallback' && (
            <div className="fallback-tab-content">
              <div className="fallback-intro-card">
                <h3 className="guide-card-title">🛡️ Mode Cadangan Cerdas (Smart Fallback Mode)</h3>
                <p className="guide-text">
                  Jika Anda belum sempat mengurus pendaftaran API developer di Meta, TikTok, atau Google, <b>Kantor MMA Production tetap berjalan 100% tanpa hambatan</b>.
                </p>
                <p className="guide-text">
                  Sistem secara otomatis mengaktifkan fitur <b>Bundel Siap Tayang (1-Klik Salin)</b> sehingga Anda dapat mengunggah video ke web medsos hanya dalam hitungan detik.
                </p>
              </div>

              <div className="fallback-tools-grid">
                <div className="tool-card">
                  <span className="tool-icon">📋</span>
                  <h4>1-Klik Salin Bundel</h4>
                  <p>Salin seluruh naskah, caption persuasif, dan 7 hashtag SEO terkurasi langsung ke clipboard komputer Anda.</p>
                  <button
                    type="button"
                    className="btn-tool-action"
                    onClick={() => handleCopyText('3 Trik lighting studio modal 100 ribu yang bikin video kamu kelihatan sinematik! 🎬 Cuma modal styrofoam dan kresek putih. #videocreator #lightingstudio #tipsediting #mmaproduction #fyp', 'caption')}
                  >
                    {copiedKey === 'caption' ? '✓ Tersalin ke Clipboard!' : 'Salin Contoh Caption & Hashtag'}
                  </button>
                </div>

                <div className="tool-card">
                  <span className="tool-icon">🌐</span>
                  <h4>Buka Web Uploader</h4>
                  <p>Akses langsung ke portal upload desktop resmi dengan drag-and-drop video 4K 60fps tanpa kompresi HP:</p>
                  <div className="quick-links-row">
                    <a href="https://www.tiktok.com/creator-center/upload" target="_blank" rel="noreferrer" className="quick-upload-pill tiktok">TikTok Upload ↗</a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="quick-upload-pill instagram">Instagram Web ↗</a>
                    <a href="https://studio.youtube.com/" target="_blank" rel="noreferrer" className="quick-upload-pill youtube">YouTube Studio ↗</a>
                  </div>
                </div>

                <div className="tool-card">
                  <span className="tool-icon">✅</span>
                  <h4>Tandai Sudah Tayang Manual</h4>
                  <p>Klik tombol ini setelah Anda selesai mengupload manual agar tim AI langsung mengaktifkan tim Balas Komentar & DM.</p>
                  <button
                    type="button"
                    className="btn-tool-action mark-done"
                    onClick={() => {
                      if (onManualPublishTrigger) {
                        onManualPublishTrigger({
                          title: 'Video Edukasi (Tayang Manual)',
                          time: 'Realtime',
                          platform: 'TikTok, Instagram, YouTube'
                        });
                      }
                      onClose();
                    }}
                  >
                    Tandai Konten Sudah Tayang
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER MODAL */}
        <footer className="social-modal-footer">
          <div className="footer-status-indicator">
            <span className="status-dot-pulse"></span>
            <span>Mode Aktif: <b>{socialStatus?.activeMode === 'live_api' ? 'Live API Auto-Publish' : 'Smart Fallback Mode (Siap Pakai)'}</b></span>
          </div>
          <button type="button" className="btn-close-modal-action" onClick={onClose}>
            Selesai
          </button>
        </footer>
      </div>
    </div>
  );
}
