import React, { useState, useCallback } from 'react';
import { useOfficeState } from './hooks/useOfficeState';
import { Stage3D } from './components/Stage3D';
import { Plan2D } from './components/Plan2D';
import { AgentPanel } from './components/AgentPanel';
import { FLOW_STEPS } from './constants/flowData';
import './App.css';

export function App() {
  const [webglError, setWebglError] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const {
    agents,
    agentsMap,
    selectedAgent,
    selectedAgentId,
    selectAgent,
    approvals,
    pendingApprovals,
    decideApproval,
    toggleTask,
    addTask,
    setAgentRest,
    runFootageAction,
    tally,
    liveMessage,
    viewMode,
    setViewMode,
    theme,
    toggleTheme
  } = useOfficeState();

  const handleWebGLFallback = useCallback(() => {
    setWebglError(true);
    setViewMode('2d');
  }, [setViewMode]);

  const handleSelectAgent = useCallback((id) => {
    selectAgent(id);
    setIsDrawerOpen(true);
  }, [selectAgent]);

  let stepNumber = 0;

  return (
    <div className="office-viewport">
      {/* 1. FLOATING TOP HUD (Header Minimalis Melayang) */}
      <header className="floating-top-bar" aria-label="Menu Utama Kantor">
        <div className="brand-group">
          <span className="brand-badge">MMA PRODUCTION</span>
          <h1 className="brand-title">Kantor Visual AI</h1>
        </div>

        {/* Tally Status Ringkas */}
        <div className="status-pills">
          <span className="status-pill working" title="Karyawan sedang bekerja">
            <span className="dot working"></span>
            <b>{tally.working}</b> Bekerja
          </span>
          <span className="status-pill waiting" title="Karyawan sedang istirahat / menunggu">
            <span className="dot waiting"></span>
            <b>{tally.waiting}</b> Menunggu
          </span>
          <span className="status-pill attention" title="Memerlukan tindakan / revisi">
            <span className="dot attention"></span>
            <b>{tally.attention}</b> Perlu Tindakan
          </span>
          {tally.pendingApprovals > 0 && (
            <button
              type="button"
              className="status-pill approval-alert"
              onClick={() => handleSelectAgent('ceo')}
              title="Buka Antrean Persetujuan CEO"
            >
              🔔 <b>{tally.pendingApprovals}</b> Persetujuan
            </button>
          )}
        </div>

        {/* Tombol Kontrol (Tema, Reset Kamera, 2D/3D) */}
        <div className="control-group">
          <div className="view-toggle" role="group" aria-label="Mode Tampilan">
            <button
              type="button"
              className={viewMode === '3d' ? 'active' : ''}
              onClick={() => setViewMode('3d')}
            >
              3D
            </button>
            <button
              type="button"
              className={viewMode === '2d' ? 'active' : ''}
              onClick={() => setViewMode('2d')}
            >
              2D
            </button>
          </div>

          <button
            type="button"
            className="hud-btn"
            onClick={toggleTheme}
            aria-label={`Ganti ke mode ${theme === 'dark' ? 'terang' : 'gelap'}`}
            title={`Ganti ke mode ${theme === 'dark' ? 'terang' : 'gelap'}`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Pesan Notifikasi Terkini Melayang */}
      {liveMessage && (
        <div className="floating-live-toast" aria-live="polite">
          <span className="toast-icon">⚡</span>
          <span className="toast-text">{liveMessage}</span>
        </div>
      )}

      {/* Peringatan jika WebGL tidak aktif */}
      {webglError && (
        <div className="webgl-alert-floating" role="alert">
          Akselerasi grafis 3D tidak tersedia pada browser Anda. Denah dialihkan otomatis ke Mode 2D.
        </div>
      )}

      {/* 2. AREA UTAMA KANTOR (100% Layar) */}
      <main className="stage-fullscreen-container">
        {viewMode === '3d' ? (
          <Stage3D
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={handleSelectAgent}
            theme={theme}
            onWebGLFallback={handleWebGLFallback}
          />
        ) : (
          <div className="plan2d-fullscreen-wrapper">
            <Plan2D
              agents={agents}
              agentsMap={agentsMap}
              selectedAgentId={selectedAgentId}
              onSelectAgent={handleSelectAgent}
              pendingApprovalsCount={pendingApprovals.length}
            />
          </div>
        )}
      </main>

      {/* 3. FLOATING BOTTOM FLOW BAR (Alur Konten 14 Langkah) */}
      <nav className="floating-flow-bar" aria-label="Alur Satu Konten">
        <div className="flow-bar-header">
          <span className="flow-label">ALUR KONTEN:</span>
        </div>
        <ol className="flow-steps-scroll">
          {FLOW_STEPS.map((id) => {
            if (id === 'GATE') {
              const isSelected = selectedAgentId === 'ceo';
              return (
                <li key="gate-ceo">
                  <button
                    type="button"
                    className={`step-bubble gate ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectAgent('ceo')}
                    title="Titik Persetujuan CEO"
                  >
                    <span className="step-num">GATE</span>
                    CEO Persetujuan
                  </button>
                </li>
              );
            }

            stepNumber += 1;
            const agent = agentsMap[id];
            const isSelected = selectedAgentId === id;
            const curStep = stepNumber;

            return (
              <li key={id}>
                <button
                  type="button"
                  className={`step-bubble ${isSelected ? 'active' : ''}`}
                  onClick={() => handleSelectAgent(id)}
                  title={`Buka ${agent ? agent.nama : id}`}
                >
                  <span className="step-num">{curStep}</span>
                  {agent ? (agent.id === 'kamera' ? 'Videographer' : agent.nama) : id}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* 4. SLIDING SIDE DRAWER (Panel Detail Karyawan) */}
      <div className={`sliding-drawer ${isDrawerOpen ? 'open' : 'closed'}`}>
        <div className="drawer-header-bar">
          <div className="drawer-title-wrap">
            <span className="drawer-badge">DETAIL KARYAWAN</span>
            <h3>{selectedAgent?.id === 'ceo' ? 'Anda (CEO)' : selectedAgent?.nama}</h3>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => setIsDrawerOpen(false)}
            aria-label="Tutup panel detail"
            title="Tutup panel (tekan karakter di denah untuk membuka kembali)"
          >
            ✕
          </button>
        </div>

        <div className="drawer-content-scroll">
          <AgentPanel
            agent={selectedAgent}
            agentsMap={agentsMap}
            onSelectAgent={handleSelectAgent}
            onToggleTask={toggleTask}
            onAddTask={addTask}
            onSetAgentRest={setAgentRest}
            onRunFootageAction={runFootageAction}
            approvals={approvals}
            pendingApprovals={pendingApprovals}
            onDecideApproval={decideApproval}
            pendingApprovalsCount={pendingApprovals.length}
          />
        </div>
      </div>

      {/* Tombol Melayang untuk Membuka Kembali Drawer saat Tertutup */}
      {!isDrawerOpen && (
        <button
          type="button"
          className="reopen-drawer-btn"
          onClick={() => setIsDrawerOpen(true)}
          title="Buka Panel Detail Karyawan"
        >
          📋 Panel Karyawan: <b>{selectedAgent?.id === 'ceo' ? 'CEO' : selectedAgent?.nama}</b>
        </button>
      )}
    </div>
  );
}

export default App;
