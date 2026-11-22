import React from 'react';
import { useOfficeState } from './hooks/useOfficeState';
import { Header } from './components/Header';
import { ContentFlow } from './components/ContentFlow';
import { ViewSwitch } from './components/ViewSwitch';
import { Plan2D } from './components/Plan2D';
import { Stage3D } from './components/Stage3D';
import { AgentPanel } from './components/AgentPanel';
import './App.css';

export function App() {
  const [webglError, setWebglError] = React.useState(false);

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

  const handleWebGLFallback = React.useCallback(() => {
    setWebglError(true);
    setViewMode('2d');
  }, [setViewMode]);

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
          {webglError && (
            <div className="webgl-alert" role="alert">
              <span>Akselerasi WebGL 3D tidak aktif pada browser Anda. Denah dialihkan otomatis ke Mode 2D yang dapat dioperasikan penuh.</span>
            </div>
          )}

          <ViewSwitch
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            onResetCamera={() => {}}
          />

          {viewMode === '3d' ? (
            <Stage3D
              agents={agents}
              selectedAgentId={selectedAgentId}
              onSelectAgent={selectAgent}
              theme={theme}
              onWebGLFallback={handleWebGLFallback}
            />
          ) : (
            <Plan2D
              agents={agents}
              agentsMap={agentsMap}
              selectedAgentId={selectedAgentId}
              onSelectAgent={selectAgent}
              pendingApprovalsCount={pendingApprovals.length}
            />
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
          Kantor MMA Production. Dibangun dengan Three.js dan React.
          Karyawan berstatus menunggu atau perlu perhatian akan berjalan santai ke ruang lunch, PlayStation, kolam renang, atau asrama lewat lorong.
        </p>
      </footer>
    </div>
  );
}

export default App;
