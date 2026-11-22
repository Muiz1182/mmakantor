import React from 'react';
import { useOfficeState } from './hooks/useOfficeState';
import { Header } from './components/Header';
import { ContentFlow } from './components/ContentFlow';
import { ViewSwitch } from './components/ViewSwitch';
import { Plan2D } from './components/Plan2D';
import { AgentPanel } from './components/AgentPanel';
import './App.css';

export function App() {
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

  return (
    <div className="wrap">
      <Header
        tally={tally}
        liveMessage={liveMessage}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <ContentFlow
        agentsMap={agentsMap}
        selectedAgentId={selectedAgentId}
        onSelectAgent={selectAgent}
      />

      <main className="app">
        <div id="planwrap">
          <ViewSwitch
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            onResetCamera={() => {}}
          />

          {viewMode === '2d' ? (
            <Plan2D
              agents={agents}
              agentsMap={agentsMap}
              selectedAgentId={selectedAgentId}
              onSelectAgent={selectAgent}
              pendingApprovalsCount={pendingApprovals.length}
            />
          ) : (
            <div className="stage-placeholder" role="region" aria-label="Pratinjau Mode 3D">
              <div className="stage-placeholder-inner">
                <span className="stage-icon">🏢</span>
                <h3>Mode 3D Siap Dibangun (Tahap 2)</h3>
                <p>
                  Kerangka proyek dan denah 2D interaktif telah aktif di Tahap 1.
                  Denah 3D Three.js dan animasi lorong akan diintegrasikan pada Tahap 2.
                </p>
                <button
                  type="button"
                  className="primary"
                  onClick={() => setViewMode('2d')}
                >
                  Beralih ke Denah 2D Interaktif
                </button>
              </div>
            </div>
          )}
        </div>

        <AgentPanel
          agent={selectedAgent}
          agentsMap={agentsMap}
          onSelectAgent={selectAgent}
          onToggleTask={toggleTask}
          onAddTask={addTask}
          onSetAgentRest={setAgentRest}
          onRunFootageAction={runFootageAction}
          approvals={approvals}
          pendingApprovals={pendingApprovals}
          onDecideApproval={decideApproval}
          pendingApprovalsCount={pendingApprovals.length}
        />
      </main>

      <footer className="foot">
        <p>
          Kantor MMA Production. Dibangun dengan Vite + React modular.
          Mode denah 2D aktif dan dapat dioperasikan penuh menggunakan mouse atau keyboard.
        </p>
      </footer>
    </div>
  );
}

export default App;
