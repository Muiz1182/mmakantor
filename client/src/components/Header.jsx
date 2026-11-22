import React from 'react';

export function Header({ tally, liveMessage, theme, onToggleTheme }) {
  return (
    <header className="top">
      <div>
        <div className="title-row">
          <h1>Kantor MMA Production</h1>
          <button
            type="button"
            className="theme-btn"
            onClick={onToggleTheme}
            aria-label={`Ganti ke mode ${theme === 'dark' ? 'terang' : 'gelap'}`}
            title={`Ganti ke mode ${theme === 'dark' ? 'terang' : 'gelap'}`}
          >
            {theme === 'dark' ? '☀️ Mode Terang' : '🌙 Mode Gelap'}
          </button>
        </div>
        <p className="sub">
          Satu kantor, tiga belas karyawan AI, Anda sebagai CEO. Satu tugas dipegang satu orang.
          Klik meja mana pun untuk melihat tugas dan hasilnya. Saat menunggu revisi atau materi,
          karyawan berpindah ke ruang lunch, PlayStation, kolam renang, atau asrama.
        </p>
      </div>

      <div className="meta">
        <div className="tally">
          <span><b>{tally.total}</b> agent</span>
          <span><b>{tally.working}</b> bekerja</span>
          <span><b>{tally.waiting}</b> menunggu</span>
          <span><b>{tally.attention}</b> perlu perhatian</span>
          <span><b>{tally.pendingApprovals}</b> persetujuan</span>
          <span><b>{tally.resting}</b> di ruang santai</span>
        </div>
        <div className="live" aria-live="polite">
          {liveMessage}
        </div>
      </div>
    </header>
  );
}
