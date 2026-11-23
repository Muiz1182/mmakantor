import React, { useState } from 'react';
import { Avatar } from './Avatar';
import { LOUNGE_ROOMS, LOUNGE_MAP } from '../constants/roomsData';

export function AgentPanel({
  agent,
  agentsMap,
  onSelectAgent,
  onToggleTask,
  onAddTask,
  onSetAgentRest,
  onRunFootageAction,
  approvals,
  pendingApprovals,
  onDecideApproval,
  pendingApprovalsCount,
  onRunAgentAI,
  isRunningAI,
  activePilar = 'Multimedia',
  onOpenVideoReview
}) {
  const [taskInput, setTaskInput] = useState('');
  const [selectedPilar, setSelectedPilar] = useState(activePilar);
  const [customAiPrompt, setCustomAiPrompt] = useState('');
  const [expandedApprovalId, setExpandedApprovalId] = useState(null);

  if (!agent) return null;

  const isCeo = agent.id === 'ceo';
  const completedTasks = agent.tugas ? agent.tugas.filter(t => t.d).length : 0;
  const totalTasks = agent.tugas ? agent.tugas.length : 0;

  function getAgentStatusInfo() {
    if (isCeo) {
      return pendingApprovalsCount > 0
        ? { k: 'attention', l: `${pendingApprovalsCount} menunggu Anda` }
        : { k: 'waiting', l: 'Antrean kosong' };
    }
    return { k: agent.status, l: agent.sLabel };
  }

  const statusInfo = getAgentStatusInfo();

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskInput.trim()) return;
    onAddTask(agent.id, taskInput);
    setTaskInput('');
  };

  const handleAiRun = () => {
    if (onRunAgentAI) {
      onRunAgentAI(agent.id, customAiPrompt, selectedPilar);
    }
  };

  const restRoomsOptions = [
    { id: 'auto', label: 'Otomatis' },
    ...LOUNGE_ROOMS.map(r => ({ id: r.id, label: r.label }))
  ];

  return (
    <aside className="panel" id="panel" aria-label="Detail agent">
      <div className="ph">
        <Avatar hue={agent.hue} isLarge />
        <div className="who">
          <h2 tabIndex="-1">{isCeo ? 'Anda (CEO)' : agent.nama}</h2>
          {agent.sub && <span className="desc">{agent.sub}</span>}
          <span className="pill">
            <span className={`dot ${statusInfo.k}`}></span>
            {statusInfo.l}
          </span>
        </div>
      </div>

      <p className="desc">{agent.ringkas}</p>

      {/* Sedang dikerjakan */}
      <section>
        <p className="label">Sedang dikerjakan</p>
        <p className="text-body">{agent.now}</p>
        {agent.aksi && agent.status === 'attention' && (
          <div className="action-row">
            <button
              type="button"
              className="primary"
              onClick={onRunFootageAction}
            >
              {agent.aksi.label}
            </button>
          </div>
        )}
      </section>

      {/* TAHAP 4: KARTU RUNNER AI PER AGEN (SISTEM PROMPT & GENERATOR DRAF KE CEO) */}
      <section className="ai-agent-runner-card">
        <div className="ai-runner-head">
          <span className="ai-runner-title">⚡ Integrasi Model AI ({isCeo ? 'CEO System' : agent.nama})</span>
          <span className="ai-model-tag">Gemini / OpenAI API</span>
        </div>

        <p className="ai-runner-sub">
          {isCeo
            ? 'Picu produksi konten edukasi viral lintas divisi dan pantau hasilnya langsung di Antrean Persetujuan.'
            : `Jalankan model AI dengan System Prompt khusus ${agent.nama}. Draf otomatis masuk ke antrean CEO.`}
        </p>

        <div className="pilar-select-row">
          <span className="pilar-select-label">Pilar Edukasi:</span>
          {['Multimedia', 'Design', 'Web Development'].map(p => (
            <button
              key={p}
              type="button"
              className={`pilar-chip ${selectedPilar === p ? 'active' : ''}`}
              onClick={() => setSelectedPilar(p)}
              disabled={isRunningAI}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="ai-prompt-input-group">
          <input
            type="text"
            className="ai-task-input"
            placeholder={
              isCeo
                ? 'Instruksi arahan strategis CEO (misal: "Topik arsitektur React 60 FPS")...'
                : `Instruksi khusus tugas ${agent.nama} (kosongkan untuk default)...`
            }
            value={customAiPrompt}
            onChange={(e) => setCustomAiPrompt(e.target.value)}
            disabled={isRunningAI}
          />
          <button
            type="button"
            className="ai-run-btn"
            disabled={isRunningAI}
            onClick={handleAiRun}
          >
            {isRunningAI ? (
              <>⏳ Memproses AI...</>
            ) : (
              <>{isCeo ? '⚡ Eksekusi AI Arahan CEO' : `⚡ Jalankan AI ${agent.nama}`}</>
            )}
          </button>
        </div>
      </section>

      {/* Antrean Persetujuan khusus CEO */}
      {isCeo && (
        <section>
          <div className="section-head">
            <p className="label">
              Antrean persetujuan : {pendingApprovals.length} menunggu keputusan
            </p>
          </div>
          <ul className="apprs">
            {approvals.map(it => {
              const fromAgent = agentsMap[it.dari];
              const isPending = it.state === 'pending';
              const isExpanded = expandedApprovalId === it.id;

              return (
                <li key={it.id} className={`appr ${it.state}`}>
                  <div className="appr-top">
                    {fromAgent && (
                      <button
                        type="button"
                        className="chip"
                        onClick={() => onSelectAgent(fromAgent.id)}
                        title={`Buka detail ${fromAgent.nama}`}
                      >
                        {fromAgent.nama}
                      </button>
                    )}
                    {it.tipe && (
                      <span className="pilar-badge" title={`Kategori: ${it.tipe}`}>
                        {it.tipe.toUpperCase()}
                      </span>
                    )}
                    {it.kategori && (
                      <span className="pilar-badge" title={`Pilar Edukasi: ${it.kategori}`}>
                        {it.kategori}
                      </span>
                    )}
                    <strong>{it.judul}</strong>
                  </div>

                  <p>{it.ringkas}</p>

                  {/* Tombol Baca Draf Lengkap */}
                  {it.detail && (
                    <div className="approval-detail-toggle-box">
                      <button
                        type="button"
                        className="detail-toggle-btn"
                        onClick={() => setExpandedApprovalId(isExpanded ? null : it.id)}
                      >
                        {isExpanded ? '▲ Tutup Draf Lengkap' : '▼ Baca Draf Dokumen AI Lengkap'}
                      </button>
                      {isExpanded && (
                        <div className="approval-full-detail">
                          <pre>{it.detail}</pre>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Tombol Khusus: Review Hasil Video Pre-Upload (9:16) */}
                  <div className="approval-video-review-action">
                    <button
                      type="button"
                      className="video-review-open-btn"
                      onClick={() => onOpenVideoReview && onOpenVideoReview(it)}
                      title="Buka simulator pemutar 9:16 untuk memverifikasi kualitas video sebelum diupload"
                    >
                      🎬 Putar & Review Kelayakan Video (9:16)
                    </button>
                  </div>

                  {isPending ? (
                    <div className="ab">
                      <button
                        type="button"
                        className="primary"
                        onClick={() => onDecideApproval(it.id, 'ok')}
                      >
                        ✓ Setujui Draf
                      </button>
                      <button
                        type="button"
                        className="ghost"
                        onClick={() => onDecideApproval(it.id, 'rev')}
                      >
                        ✕ Minta Revisi
                      </button>
                    </div>
                  ) : (
                    <span className="state">
                      {it.state === 'ok' ? '✓ Disetujui CEO' : '✕ Revisi diminta'}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Lokasi & Ruang Santai (Non-CEO) */}
      {!isCeo && (
        <section>
          <p className="label">Lokasi</p>
          <p className="text-body">
            {agent.at === 'desk'
              ? 'Di meja kerja. Jam operasional kantor MMA aktif, seluruh karyawan bekerja otomatis.'
              : agent.at === 'meeting'
              ? 'Sedang di Ruang Meeting Kaca, mengikuti agenda rapat koordinasi resmi bersama CEO.'
              : `Sedang di ${LOUNGE_MAP[agent.at]?.label || 'Ruang Santai'}, istirahat santai.`}
          </p>

          <div className="chips">
            <span className="k">Pilihan tempat santai:</span>
            {restRoomsOptions.map(opt => {
              const currentRest = agent.rest || 'auto';
              const isPressed = currentRest === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  className="chip"
                  aria-pressed={isPressed}
                  onClick={() => onSetAgentRest(agent.id, opt.id)}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          <p className="hint-text" style={{ fontSize: '0.78rem', color: 'var(--ink2)', marginTop: '6px' }}>
            Catatan: Ruang Meeting Kaca khusus sesi rapat resmi bersama CEO, bukan area santai.
          </p>
        </section>
      )}

      {/* Daftar Tugas */}
      <section>
        <p className="label">
          Daftar tugas : {completedTasks} dari {totalTasks} selesai
        </p>
        <ul className="tasks">
          {agent.tugas && agent.tugas.map((t, idx) => (
            <li key={idx} className={t.d ? 'done' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={t.d}
                  onChange={() => onToggleTask(agent.id, idx)}
                />
                <span>{t.t}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      {/* Hasil Terbaru */}
      {agent.out && (
        <section>
          <p className="label">Hasil terbaru</p>
          <div className="out">
            <strong>{agent.out.t}</strong>
            <ul>
              {agent.out.items.map((item, idx) => (
                <li key={idx}>
                  <pre style={{ whiteSpace: 'pre-wrap', font: 'inherit', margin: 0 }}>
                    {item}
                  </pre>
                </li>
              ))}
            </ul>
            {(agent.id === 'editor' || agent.id === 'kamera') && (
              <div style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  className="video-review-open-btn full-width"
                  onClick={() => onOpenVideoReview && onOpenVideoReview()}
                  title="Buka simulator pemutar 9:16 untuk memverifikasi kualitas video sebelum diupload"
                >
                  🎬 Putar & Review Master Video 4K (9:16)
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Alur Kerja */}
      <section>
        <p className="label">Alur kerja</p>
        {agent.terima && agent.terima.length > 0 && (
          <div className="chips">
            <span className="k">Menerima dari:</span>
            {agent.terima.map(id => {
              const srcAgent = agentsMap[id];
              return (
                <button
                  key={id}
                  type="button"
                  className="chip"
                  onClick={() => onSelectAgent(id)}
                >
                  {srcAgent ? srcAgent.nama : id}
                </button>
              );
            })}
          </div>
        )}

        {agent.kirim && agent.kirim.length > 0 && (
          <div className="chips">
            <span className="k">Mengirim ke:</span>
            {agent.kirim.map(id => {
              const targetAgent = agentsMap[id];
              return (
                <button
                  key={id}
                  type="button"
                  className="chip"
                  onClick={() => onSelectAgent(id)}
                >
                  {targetAgent ? targetAgent.nama : id}
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* Batas AI */}
      {agent.batas && (
        <div className="limit">
          <p className="label">Batas AI</p>
          <p className="text-body">{agent.batas}</p>
        </div>
      )}

      {/* Beri Tugas Form */}
      <form className="assign" onSubmit={handleTaskSubmit}>
        <label htmlFor="assign-input" className="sr-only">
          Beri tugas kepada {agent.nama}
        </label>
        <input
          id="assign-input"
          type="text"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          placeholder={`Beri tugas kepada ${agent.nama}...`}
          autoComplete="off"
        />
        <button type="submit" className="primary">
          Tambah
        </button>
      </form>
    </aside>
  );
}
