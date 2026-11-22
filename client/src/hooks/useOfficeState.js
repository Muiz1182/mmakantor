import { useState, useMemo, useCallback, useEffect } from 'react';
import { INITIAL_AGENTS, INITIAL_APPROVALS } from '../constants/agentsData';
import { LOUNGE_ROOMS, LOUNGE_MAP } from '../constants/roomsData';

export function useOfficeState() {
  const [agents, setAgents] = useState(() => {
    return INITIAL_AGENTS.map(a => ({
      ...a,
      at: a.id === 'ceo' || a.status === 'working' ? 'desk' : null,
      slot: 0,
      rest: 'auto'
    }));
  });

  const [approvals, setApprovals] = useState(INITIAL_APPROVALS);
  const [selectedAgentId, setSelectedAgentId] = useState('ceo');
  const [liveMessage, setLiveMessage] = useState('Selamat datang di Kantor MMA Production. Anda berperan sebagai CEO.');
  const [viewMode, setViewMode] = useState('3d');
  
  // Theme state
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Compute pending approvals
  const pendingApprovals = useMemo(() => {
    return approvals.filter(item => item.state === 'pending');
  }, [approvals]);

  // Compute placed agents
  const placedAgents = useMemo(() => {
    const list = agents.map(a => ({ ...a }));
    const occ = {};
    LOUNGE_ROOMS.forEach(r => { occ[r.id] = []; });

    // Step 1: keep working agents at desk, keep valid existing rest
    list.forEach(a => {
      if (a.id === 'ceo' || a.status === 'working') {
        a.at = 'desk';
        a.slot = 0;
        return;
      }
      const keep = a.at && a.at !== 'desk' && (!a.rest || a.rest === 'auto' || a.rest === a.at);
      if (keep && !occ[a.at][a.slot]) {
        occ[a.at][a.slot] = a.id;
      } else {
        a.at = null;
      }
    });

    // Step 2: assign any waiting/attention agent who has no spot
    list.forEach((a, i) => {
      if (a.id === 'ceo' || a.status === 'working' || a.at) return;
      const order = a.rest && a.rest !== 'auto' ? [a.rest] : [];
      for (let k = 0; k < 4; k++) {
        order.push(LOUNGE_ROOMS[(i + k) % 4].id);
      }
      for (let j = 0; j < order.length && !a.at; j++) {
        const rId = order[j];
        const cap = LOUNGE_MAP[rId].cap;
        for (let sl = 0; sl < cap; sl++) {
          if (!occ[rId][sl]) {
            occ[rId][sl] = a.id;
            a.at = rId;
            a.slot = sl;
            break;
          }
        }
      }
    });

    return list;
  }, [agents]);

  const agentsMap = useMemo(() => {
    return placedAgents.reduce((acc, a) => {
      acc[a.id] = a;
      return acc;
    }, {});
  }, [placedAgents]);

  const selectedAgent = agentsMap[selectedAgentId] || agentsMap['ceo'];

  // Actions
  const selectAgent = useCallback((id) => {
    if (agentsMap[id]) {
      setSelectedAgentId(id);
    }
  }, [agentsMap]);

  const toggleTask = useCallback((agentId, taskIndex) => {
    setAgents(prev => prev.map(a => {
      if (a.id !== agentId) return a;
      const nextTugas = a.tugas.map((t, idx) => {
        if (idx !== taskIndex) return t;
        return { ...t, d: !t.d };
      });
      return { ...a, tugas: nextTugas };
    }));
  }, []);

  const addTask = useCallback((agentId, taskTitle) => {
    const trimmed = taskTitle.trim();
    if (!trimmed) return;

    setAgents(prev => prev.map(a => {
      if (a.id !== agentId) return a;
      return {
        ...a,
        tugas: [{ t: trimmed, d: false }, ...a.tugas]
      };
    }));

    const agent = agentsMap[agentId];
    const name = agent ? agent.nama : agentId;
    setLiveMessage(`Tugas baru ditambahkan untuk ${name}: "${trimmed}"`);
  }, [agentsMap]);

  const setAgentRest = useCallback((agentId, restPlace) => {
    setAgents(prev => prev.map(a => {
      if (a.id !== agentId) return a;
      return { ...a, rest: restPlace, at: null };
    }));
  }, []);

  const decideApproval = useCallback((approvalId, action) => {
    setApprovals(prevApprovals => {
      const target = prevApprovals.find(x => x.id === approvalId);
      if (!target || target.state !== 'pending') return prevApprovals;

      const nextState = action === 'ok' ? 'ok' : 'rev';
      const updated = prevApprovals.map(x => (x.id === approvalId ? { ...x, state: nextState } : x));
      
      const fromAgentId = target.dari;
      const remainingPending = updated.filter(x => x.dari === fromAgentId && x.state === 'pending').length;

      setAgents(prevAgents => {
        return prevAgents.map(a => {
          if (a.id === fromAgentId) {
            if (action === 'rev') {
              return {
                ...a,
                status: 'working',
                sLabel: 'Merevisi',
                now: `Merevisi: ${target.judul}.`
              };
            } else {
              // Setujui
              if (remainingPending === 0 && a.status === 'attention') {
                return {
                  ...a,
                  status: 'working',
                  sLabel: 'Bekerja',
                  now: a.nowAfter || a.now
                };
              }
            }
          }

          // If approved and unlocks another agent (e.g. caption unlocks upload)
          if (action === 'ok' && a.id === 'upload') {
            const captionAgent = prevAgents.find(ag => ag.id === 'caption');
            if (fromAgentId === 'caption' && remainingPending === 0) {
              return {
                ...a,
                status: 'working',
                sLabel: 'Bekerja',
                now: a.nowAfter || a.now
              };
            }
          }

          return a;
        });
      });

      if (action === 'rev') {
        setLiveMessage(`Revisi diminta untuk: ${target.judul}`);
      } else {
        setLiveMessage(`Persetujuan diberikan untuk: ${target.judul}`);
      }

      return updated;
    });
  }, []);

  const runFootageAction = useCallback(() => {
    setAgents(prev => prev.map(a => {
      if (a.id === 'kamera') {
        return {
          ...a,
          status: 'waiting',
          sLabel: 'Footage terkirim',
          now: 'Footage sudah masuk dan diteruskan ke Editor.',
          tugas: a.tugas.map(t => (/Rekam di lapangan/.test(t.t) ? { ...t, d: true } : t))
        };
      }
      if (a.id === 'editor') {
        return {
          ...a,
          status: 'working',
          sLabel: 'Bekerja',
          now: 'Memotong footage yang baru masuk.'
        };
      }
      return a;
    }));
    setLiveMessage('Footage masuk dari lapangan. Editor mulai memotong video.');
  }, []);

  // Tally counts
  const tally = useMemo(() => {
    const nonCeo = placedAgents.filter(a => a.id !== 'ceo');
    return {
      total: nonCeo.length,
      working: nonCeo.filter(a => a.status === 'working').length,
      waiting: nonCeo.filter(a => a.status === 'waiting').length,
      attention: nonCeo.filter(a => a.status === 'attention').length,
      pendingApprovals: pendingApprovals.length,
      resting: nonCeo.filter(a => a.at && a.at !== 'desk').length
    };
  }, [placedAgents, pendingApprovals]);

  return {
    agents: placedAgents,
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
  };
}
