import React, { useState } from 'react';

export function StarterKitModal({ isOpen, onClose }) {
  const [serverType, setServerType] = useState('vps'); // 'vps' atau 'localhost'
  const [selectedDivisions, setSelectedDivisions] = useState(['multimedia', 'design', 'webdev']);
  const [aiProvider, setAiProvider] = useState('claude'); // 'claude', 'gemini', 'openai', 'local'
  const [copied, setCopied] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [submittedFeedback, setSubmittedFeedback] = useState(false);

  if (!isOpen) return null;

  const toggleDivision = (divId) => {
    setSelectedDivisions(prev => {
      if (prev.includes(divId)) {
        if (prev.length === 1) return prev; // Minimal 1 divisi
        return prev.filter(d => d !== divId);
      } else {
        return [...prev, divId];
      }
    });
  };

  const generatedCommand = serverType === 'vps'
    ? `curl -fsSL https://get.mma-kantor.id/install.sh | bash -s -- --divisions=${selectedDivisions.join(',')} --ai=${aiProvider}`
    : `npx create-kantor-ai --divisions=${selectedDivisions.join(',')} --ai=${aiProvider}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(generatedCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentInput.trim()) {
      setSubmittedFeedback(true);
    }
  };

  return (
    <div className="schedule-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="starter-kit-title">
      <div className="schedule-modal-content starter-kit-content">
        <header className="schedule-modal-header">
          <div className="schedule-title-group">
            <span className="brand-badge" style={{ width: 'fit-content', marginBottom: '8px' }}>
              KONSEP VIRAL TIKTOK : 1-COMMAND STARTER KIT
            </span>
            <h2 id="starter-kit-title" className="schedule-title">
              Instalasi Kantor AI MMA Production Sekali Klik
            </h2>
            <p className="schedule-sub">
              Sesuai konsep video viral TikTok: Beli VPS → Paste 1 Baris Perintah → Isi Wizard Divisi → Kantor AI Langsung Jalan.
              Tanpa perlu coding manual atau mengatur agen AI satu per satu.
            </p>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Tutup Kit">
            ✕
          </button>
        </header>

        <main className="starter-kit-body">
          {/* Langkah 1: Pilih Server */}
          <section className="wizard-step-section">
            <h3 className="wizard-step-title">
              <span className="step-badge">1</span> Pilih Lingkungan Server
            </h3>
            <div className="wizard-chips-row">
              <button
                type="button"
                className={`wizard-chip-btn ${serverType === 'vps' ? 'active' : ''}`}
                onClick={() => setServerType('vps')}
              >
                🌐 Server VPS Cloud (Ubuntu / Debian / Docker)
              </button>
              <button
                type="button"
                className={`wizard-chip-btn ${serverType === 'localhost' ? 'active' : ''}`}
                onClick={() => setServerType('localhost')}
              >
                💻 Laptop / PC Lokal (Node.js & PostgreSQL)
              </button>
            </div>
          </section>

          {/* Langkah 2: Pilih Divisi Kantor AI */}
          <section className="wizard-step-section">
            <h3 className="wizard-step-title">
              <span className="step-badge">2</span> Pilih Divisi Edukasi Kantor
            </h3>
            <div className="divisions-grid">
              <div
                className={`division-card ${selectedDivisions.includes('multimedia') ? 'active' : ''}`}
                onClick={() => toggleDivision('multimedia')}
              >
                <div className="division-header">
                  <span className="div-icon">🎬</span>
                  <h4>Divisi Multimedia</h4>
                  <input
                    type="checkbox"
                    checked={selectedDivisions.includes('multimedia')}
                    readOnly
                    aria-label="Pilih Divisi Multimedia"
                  />
                </div>
                <p className="div-desc">
                  Videographer, Editor DaVinci Resolve, Pemotong Ritme CapCut, Green Screen Studio.
                </p>
              </div>

              <div
                className={`division-card ${selectedDivisions.includes('design') ? 'active' : ''}`}
                onClick={() => toggleDivision('design')}
              >
                <div className="division-header">
                  <span className="div-icon">🎨</span>
                  <h4>Divisi Design</h4>
                  <input
                    type="checkbox"
                    checked={selectedDivisions.includes('design')}
                    readOnly
                    aria-label="Pilih Divisi Design"
                  />
                </div>
                <p className="div-desc">
                  Carousel Specialist 7 Slide, Visual Brand Designer, Thumbnail YouTube High CTR.
                </p>
              </div>

              <div
                className={`division-card ${selectedDivisions.includes('webdev') ? 'active' : ''}`}
                onClick={() => toggleDivision('webdev')}
              >
                <div className="division-header">
                  <span className="div-icon">💻</span>
                  <h4>Divisi Web Development</h4>
                  <input
                    type="checkbox"
                    checked={selectedDivisions.includes('webdev')}
                    readOnly
                    aria-label="Pilih Divisi Web Development"
                  />
                </div>
                <p className="div-desc">
                  Three.js 3D Engineer 60 FPS, Next.js Server Components, PostgreSQL & Drizzle ORM.
                </p>
              </div>
            </div>
          </section>

          {/* Langkah 3: Pilih Mesin Otak AI */}
          <section className="wizard-step-section">
            <h3 className="wizard-step-title">
              <span className="step-badge">3</span> Pilih Mesin AI
            </h3>
            <div className="wizard-chips-row">
              {[
                { id: 'claude', label: 'Claude 3.5 Sonnet (Direkomendasikan)', icon: '⚡' },
                { id: 'gemini', label: 'Google Gemini 1.5 Pro', icon: '✨' },
                { id: 'openai', label: 'OpenAI GPT-4o', icon: '🧠' },
                { id: 'local', label: 'Ollama Model Lokal (Offline)', icon: '🔒' }
              ].map(opt => (
                <button
                  key={opt.id}
                  type="button"
                  className={`wizard-chip-btn ${aiProvider === opt.id ? 'active' : ''}`}
                  onClick={() => setAiProvider(opt.id)}
                >
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </section>

          {/* Langkah 4: Satu Baris Perintah Terminal */}
          <section className="wizard-step-section terminal-section">
            <div className="terminal-header-bar">
              <div className="terminal-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="terminal-label">Perintah Terminal 1-Baris (Tinggal Paste)</span>
              <button
                type="button"
                className="copy-command-btn"
                onClick={handleCopy}
                aria-label="Salin Perintah"
              >
                {copied ? '✓ Tersalin!' : '📋 Salin Command'}
              </button>
            </div>
            <pre className="terminal-code-block">
              <code>{generatedCommand}</code>
            </pre>
            <p className="terminal-helper-text">
              Target instalasi: Script otomatis mengonfigurasi database PostgreSQL, server Express, dan visual kantor 3D isometrik dengan orbit interaktif.
            </p>
          </section>

          {/* Langkah 5: Call to Action Komentar "KIT" seperti di TikTok */}
          <section className="wizard-step-section cta-kit-section">
            <div className="cta-kit-box">
              <div className="cta-kit-left">
                <span className="cta-kit-tag">VIRAL CALL TO ACTION</span>
                <h4 className="cta-kit-heading">Mau dikabari saat starter kit ini siap dicoba?</h4>
                <p className="cta-kit-desc">
                  Ketik <strong>"KIT"</strong> di kolom komentar TikTok atau masukkan kontak Anda di bawah untuk mendapatkan notifikasi rilis publik:
                </p>
              </div>
              <form onSubmit={handleCommentSubmit} className="cta-kit-form">
                {submittedFeedback ? (
                  <div className="cta-kit-success">
                    ✓ Notifikasi aktif! Anda akan mendapatkan akses starter kit segera saat rilis.
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      className="cta-kit-input"
                      placeholder='Ketik "KIT" atau username TikTok / email...'
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      aria-label="Ketik KIT atau kontak"
                    />
                    <button type="submit" className="cta-kit-submit-btn" disabled={!commentInput.trim()}>
                      Kirim
                    </button>
                  </>
                )}
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
