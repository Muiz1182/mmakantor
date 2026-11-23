import React, { useState, useCallback } from 'react';
import { useOfficeState } from './hooks/useOfficeState';
import { Stage3D } from './components/Stage3D';
import { Plan2D } from './components/Plan2D';
import { AgentPanel } from './components/AgentPanel';
import { ScheduleModal } from './components/ScheduleModal';
import { FLOW_STEPS } from './constants/flowData';
import { WEEKLY_SCHEDULE } from './constants/scheduleData';
import './App.css';

export function App() {
  const [webglError, setWebglError] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [ideaText, setIdeaText] = useState('');
  const [selectedPilar, setSelectedPilar] = useState('Multimedia'); // 'Multimedia', 'Design', 'Web Development'
  const [chatActive, setChatActive] = useState(true);
  const [activeAgencyMission, setActiveAgencyMission] = useState(null);
  const [agencyDialogue, setAgencyDialogue] = useState(null);

  const handlePipelineEvent = useCallback((ev) => {
    if (ev.type === 'start') {
      setActiveAgencyMission(ev.step);
      setAgencyDialogue({ sender: ev.step.senderId, target: ev.step.targetId, text: `${ev.step.summary}...` });
    } else if (ev.type === 'dialogue') {
      setAgencyDialogue({ sender: ev.step.senderId, target: ev.step.targetId, text: `"${ev.step.dialogueSender}"` });
    } else if (ev.type === 'complete') {
      setActiveAgencyMission(ev.nextStep);
      setTimeout(() => setAgencyDialogue(null), 3000);
    }
  }, []);

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
    toggleTheme,
    dbStatus,
    clockTime,
    timeMode,
    setTimeMode,
    activeTimePhase,
    autoApproval,
    toggleAutoApproval,
    submitCeoIdea,
    triggerPublishSlot,
    triggerOfficeRoutine,
    isMeetingActive,
    toggleCeoMeeting,
    runAgentAI,
    isRunningAI
  } = useOfficeState();

  const handleWebGLFallback = useCallback(() => {
    setWebglError(true);
    setViewMode('2d');
  }, [setViewMode]);

  const handleSelectAgent = useCallback((id) => {
    selectAgent(id);
    setIsDrawerOpen(true);
  }, [selectAgent]);

  const handleIdeaSubmit = (e) => {
    e.preventDefault();
    if (ideaText.trim()) {
      submitCeoIdea(ideaText, selectedPilar);
      setIdeaText('');
    }
  };

  const pilarPlaceholders = {
    Multimedia: 'Ketik ide edukasi Multimedia viral... (cth: Trik pencahayaan video sinematik modal 100 ribu)',
    Design: 'Ketik ide edukasi Design viral... (cth: 3 Kesalahan tipografi Canva yang bikin desain murahan)',
    'Web Development': 'Ketik ide edukasi Web Dev viral... (cth: Cara pasang animasi 3D di website tanpa lag)'
  };

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
          {dbStatus?.dbConnected ? (
            <span className="status-pill db-pill" title="Terhubung langsung ke database PostgreSQL lokal (kantor_mma)">
              <span className="dot working"></span>
              <b>PostgreSQL</b> Live
            </span>
          ) : (
            <span className="status-pill db-pill" title="Menggunakan memori cache mandiri">
              <span className="dot waiting"></span>
              <b>API</b> {dbStatus?.connected ? 'Online' : 'Offline'}
            </span>
          )}

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

          {/* Tombol Kalender Jadwal Tayang Harian */}
          <button
            type="button"
            className="status-pill schedule-pill"
            onClick={() => setIsScheduleOpen(true)}
            title="Buka Jadwal Publikasi Harian (Senin - Minggu)"
          >
            📅 <b>Jadwal Tayang</b>
          </button>

          {/* Toggle Auto-Review AI */}
          <button
            type="button"
            className={`status-pill auto-ai-pill ${autoApproval ? 'active' : ''}`}
            onClick={toggleAutoApproval}
            title={autoApproval ? 'Auto-Review AI Aktif: AI memeriksa dan menyetujui checklist draf secara otomatis' : 'Auto-Review AI Nonaktif: Review manual oleh CEO'}
          >
            🤖 AI Review: <b>{autoApproval ? 'OTOMATIS' : 'MANUAL'}</b>
          </button>

          {/* Toggle Obrolan & Interaksi 3D */}
          <button
            type="button"
            className={`status-pill chat-toggle-pill ${chatActive ? 'active' : ''}`}
            onClick={() => setChatActive(prev => !prev)}
            title={chatActive ? 'Obrolan AI Aktif: Karyawan jalan & ngobrol interaktif tentang Multimedia, Design, Web Dev' : 'Obrolan AI Nonaktif'}
          >
            💬 Obrolan: <b>{chatActive ? 'AKTIF' : 'SENYAP'}</b>
          </button>

          {/* Tombol Rapat Khusus dengan CEO */}
          <button
            type="button"
            className={`status-pill meeting-toggle-pill ${isMeetingActive ? 'active' : ''}`}
            onClick={toggleCeoMeeting}
            title={isMeetingActive ? 'Selesaikan Rapat Resmi dengan CEO di Ruang Meeting' : 'Ruang meeting bukan tempat santai: Panggil tim untuk sesi rapat khusus bersama CEO'}
          >
            💼 Rapat CEO: <b>{isMeetingActive ? 'BERLANGSUNG' : 'MULAI'}</b>
          </button>

          {/* Tombol Estafet Alur Agensi Mandiri (TikTok Agency Concept) */}
          <button
            type="button"
            className={`status-pill agency-pipeline-pill ${activeAgencyMission ? 'active' : ''}`}
            onClick={() => window.__triggerAgencyStep && window.__triggerAgencyStep()}
            title="Klik untuk memicu langkah estafet berikutnya secara langsung (karyawan berdiri dan berjalan antar meja)"
          >
            ⚡ Estafet Agensi: <b>{activeAgencyMission ? activeAgencyMission.title : 'Berjalan Mandiri'}</b>
          </button>
        </div>

        {/* Waktu Operasional WIB & Kontrol */}
        <div className="control-group">
          {/* Jam Digital WIB & Shift Kerja (07.00 - 23.00) */}
          <div className="time-hud-badge" title="Jam Operasional Kantor MMA: 07.00 - 23.00 WIB">
            <span className="time-icon">⏰</span>
            <span className="time-text">{clockTime?.timeStr || '08:00 WIB'}</span>
            <select
              className="time-phase-select"
              value={timeMode}
              onChange={(e) => setTimeMode(e.target.value)}
              aria-label="Pilih Suasana Waktu Kantor"
            >
              <option value="auto">WIB Nyata ({clockTime?.phaseLabel})</option>
              <option value="morning">Pagi (07.00 - 11.00)</option>
              <option value="day">Siang (11.00 - 15.30)</option>
              <option value="dusk">Sore (15.30 - 19.00)</option>
              <option value="night">Malam (19.00 - 23.00)</option>
              <option value="sleep">Tidur (23.00 - 07.00)</option>
            </select>
          </div>

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

      {/* Floating Bar: Masukkan Arahan & Ide Baru dari CEO */}
      <section className="floating-ceo-idea-bar" aria-label="Arahan dan Ide Edukasi Viral CEO">
        <div className="pilar-selector" role="group" aria-label="Pilih Pilar Edukasi MMA">
          {['Multimedia', 'Design', 'Web Development'].map((pilar) => (
            <button
              key={pilar}
              type="button"
              className={`pilar-chip ${selectedPilar === pilar ? 'active' : ''}`}
              onClick={() => setSelectedPilar(pilar)}
            >
              {pilar === 'Multimedia' ? '🎬 Multimedia' : pilar === 'Design' ? '🎨 Design' : '💻 Web Dev'}
            </button>
          ))}
        </div>
        <form onSubmit={handleIdeaSubmit} className="idea-form">
          <span className="idea-icon" title="Peran CEO: Memberi ide dan arah konten viral">💡</span>
          <input
            type="text"
            className="idea-input"
            placeholder={pilarPlaceholders[selectedPilar] || 'Ketik ide edukasi viral di sini...'}
            value={ideaText}
            onChange={(e) => setIdeaText(e.target.value)}
            aria-label="Ketik ide konten baru"
          />
          <button type="submit" className="idea-btn" disabled={!ideaText.trim()}>
            Kirim Ide
          </button>
        </form>
      </section>

      {/* Peringatan jika WebGL tidak aktif */}
      {webglError && (
        <div className="webgl-alert-floating" role="alert">
          Akselerasi grafis 3D tidak tersedia pada browser Anda. Denah dialihkan otomatis ke Mode 2D.
        </div>
      )}

      {/* Floating Pipeline Notification Banner (Estafet Alur Agensi) */}
      {agencyDialogue && (
        <aside className="agency-floating-banner" aria-live="polite">
          <span className="agency-icon">⚡</span>
          <div className="agency-banner-body">
            <span className="agency-title">ESTAFET AGENSI: {activeAgencyMission?.title || 'Kolaborasi Tim'}</span>
            <p className="agency-desc">{agencyDialogue.text}</p>
          </div>
        </aside>
      )}

      {/* 2. AREA UTAMA KANTOR (100% Layar) */}
      <main className="stage-fullscreen-container">
        {viewMode === '3d' ? (
          <Stage3D
            agents={agents}
            selectedAgentId={selectedAgentId}
            onSelectAgent={handleSelectAgent}
            theme={theme}
            timePhase={activeTimePhase}
            chatActive={chatActive}
            onWebGLFallback={handleWebGLFallback}
            onPipelineEvent={handlePipelineEvent}
            clockTime={clockTime}
            todayTheme={WEEKLY_SCHEDULE.find(d => d.dayIndex === clockTime?.dayIndex)?.theme || 'Multimedia & Visual AI'}
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
              const isAgencyActive = activeAgencyMission && (activeAgencyMission.senderId === 'ceo' || activeAgencyMission.targetId === 'ceo');
              return (
                <li key="gate-ceo">
                  <button
                    type="button"
                    className={`step-bubble gate ${isSelected ? 'active' : ''} ${isAgencyActive ? 'agency-active-step' : ''}`}
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
            const isAgencyActive = activeAgencyMission && (activeAgencyMission.senderId === id || activeAgencyMission.targetId === id);
            const curStep = stepNumber;

            return (
              <li key={id}>
                <button
                  type="button"
                  className={`step-bubble ${isSelected ? 'active' : ''} ${isAgencyActive ? 'agency-active-step' : ''}`}
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
            onRunAgentAI={runAgentAI}
            isRunningAI={isRunningAI}
            activePilar={WEEKLY_SCHEDULE.find(d => d.dayIndex === clockTime?.dayIndex)?.theme?.split(' ')[0] || 'Multimedia'}
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
      {/* Modal Kalender Jadwal Publikasi Harian & Rutinitas Kantor */}
      <ScheduleModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        currentDayIndex={clockTime?.dayIndex}
        currentHour={clockTime?.h}
        currentMinute={clockTime?.m}
        onTriggerPublish={triggerPublishSlot}
        onTriggerRoutine={triggerOfficeRoutine}
      />
    </div>
  );
}

export default App;
