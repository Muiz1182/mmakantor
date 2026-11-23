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
  pendingApprovalsCount
}) {
  const [taskInput, setTaskInput] = useState('');

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
                    {it.kategori && (
                      <span className="pilar-badge" title={`Pilar Edukasi: ${it.kategori}`}>
                        {it.kategori}
                      </span>
                    )}
                    {it.fypScore !== undefined && (
                      <span
                        className={`fyp-badge ${it.fypScore >= 75 ? 'high' : 'medium'}`}
                        title={it.alasanFyp || 'Potensi viral konten'}
                      >
                        🔥 FYP: <b>{it.fypScore}%</b>
                      </span>
                    )}
                    <strong>{it.judul}</strong>
                  </div>
                  <p>{it.ringkas}</p>
                  {it.alasanFyp && (
                    <div className="fyp-analysis-box">
                      <span className="fyp-analysis-icon">📊</span>
                      <span className="fyp-analysis-text">{it.alasanFyp}</span>
                    </div>
                  )}

                  {isPending ? (
                    <div className="ab">
                      <button
                        type="button"
                        className="primary"
                        onClick={() => onDecideApproval(it.id, 'ok')}
                      >
                        Setujui
                      </button>
                      <button
                        type="button"
                        className="ghost"
                        onClick={() => onDecideApproval(it.id, 'rev')}
                      >
                        Minta revisi
                      </button>
                    </div>
                  ) : (
                    <span className="state">
                      {it.state === 'ok' ? 'Disetujui' : 'Revisi diminta'}
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
              ? 'Di meja kerja. Saat menunggu revisi atau materi, karyawan berpindah ke ruang santai.'
              : `Sedang di ${LOUNGE_MAP[agent.at]?.label || 'Ruang Santai'}, menunggu revisi atau project.`}
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
                <li key={idx}>{item}</li>
              ))}
            </ul>
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
