import { useState, useMemo, useCallback, useEffect } from 'react';
import { INITIAL_AGENTS, INITIAL_APPROVALS } from '../constants/agentsData';
import { LOUNGE_ROOMS, LOUNGE_MAP } from '../constants/roomsData';
import { api } from '../services/api';

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
  const [dbStatus, setDbStatus] = useState({ connected: false, source: 'offline' });
  const [autoApproval, setAutoApproval] = useState(true);

  // Sistem Waktu 24 Jam & Jam Kerja Kantor (07.00 - 23.00 WIB)
  const [timeMode, setTimeMode] = useState('auto'); // 'auto', 'morning', 'day', 'dusk', 'night', 'sleep'
  const [clockTime, setClockTime] = useState(() => getWibInfo());

  function getWibInfo() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const wib = new Date(utc + (7 * 3600000));
    const h = wib.getHours();
    const m = wib.getMinutes();
    const dayIndex = wib.getDay();
    const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')} WIB`;
    
    // Jam kerja kantor MMA: 07.00 - 23.00 WIB
    const isOfficeHours = h >= 7 && h < 23;
    let phase = 'sleep';
    let phaseLabel = 'Tutup / Istirahat Malam';

    if (h >= 7 && h < 11) {
      phase = 'morning';
      phaseLabel = 'Pagi (Jam Kerja)';
    } else if (h >= 11 && h < 15.5) {
      phase = 'day';
      phaseLabel = 'Siang (Jam Kerja)';
    } else if (h >= 15.5 && h < 19) {
      phase = 'dusk';
      phaseLabel = 'Sore (Jam Kerja)';
    } else if (h >= 19 && h < 23) {
      phase = 'night';
      phaseLabel = 'Malam (Jam Kerja)';
    }

    return { h, m, dayIndex, timeStr, phase, phaseLabel, isOfficeHours };
  }

  // Update jam realtime setiap 10 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setClockTime(getWibInfo());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Tentukan fase pencahayaan 3D (otomatis atau pilihan simulasi manual)
  const activeTimePhase = useMemo(() => {
    if (timeMode !== 'auto') return timeMode;
    return clockTime.phase;
  }, [timeMode, clockTime.phase]);
  
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

  // Sinkronisasi data awal dari backend PostgreSQL
  useEffect(() => {
    async function loadData() {
      const stats = await api.getStats();
      if (stats && stats.success) {
        setDbStatus({
          connected: true,
          source: stats.source,
          dbConnected: stats.database?.connected || false,
        });
      }

      const resAgents = await api.getAgents();
      if (resAgents && resAgents.success && Array.isArray(resAgents.data)) {
        setAgents(prev => {
          return prev.map(localA => {
            const dbA = resAgents.data.find(x => x.id === localA.id);
            if (!dbA) return localA;
            return {
              ...localA,
              status: dbA.status || localA.status,
              sLabel: dbA.status === 'working' ? 'Bekerja' : (dbA.status === 'waiting' ? 'Menunggu' : 'Perlu tindakan'),
              rest: dbA.ruangSantai || localA.rest || 'auto',
              now: dbA.sedangKerja || localA.now,
              tugas: dbA.tasks && dbA.tasks.length > 0 
                ? dbA.tasks.map(t => ({ id: t.id, t: t.judul, d: t.selesai }))
                : localA.tugas,
              out: dbA.outputs && dbA.outputs.length > 0
                ? { t: dbA.outputs[0].judul, items: [dbA.outputs[0].isi] }
                : localA.out
            };
          });
        });
      }

      const resApps = await api.getApprovals();
      if (resApps && resApps.success && Array.isArray(resApps.data)) {
        setApprovals(resApps.data.map(item => ({
          id: String(item.id),
          dari: item.agentId,
          judul: item.judul,
          ringkas: item.ringkasan,
          detail: item.detail,
          state: item.status === 'approved' ? 'ok' : (item.status === 'rejected' ? 'rev' : 'pending'),
        })));
      }
    }

    loadData();
  }, []);

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
      let targetId = null;
      let nextDone = false;
      const nextTugas = a.tugas.map((t, idx) => {
        if (idx !== taskIndex) return t;
        targetId = t.id;
        nextDone = !t.d;
        return { ...t, d: nextDone };
      });

      if (targetId) {
        api.toggleTask(targetId, nextDone);
      }
      return { ...a, tugas: nextTugas };
    }));
  }, []);

  const addTask = useCallback(async (agentId, taskTitle) => {
    const trimmed = taskTitle.trim();
    if (!trimmed) return;

    // Optimistic local state update
    const tempId = Date.now();
    setAgents(prev => prev.map(a => {
      if (a.id !== agentId) return a;
      return {
        ...a,
        tugas: [{ id: tempId, t: trimmed, d: false }, ...a.tugas]
      };
    }));

    const agent = agentsMap[agentId];
    const name = agent ? agent.nama : agentId;
    setLiveMessage(`Tugas baru ditambahkan untuk ${name}: "${trimmed}"`);

    // Sync to PostgreSQL backend
    const res = await api.addTask(agentId, trimmed);
    if (res && res.success && res.data?.id) {
      setAgents(prev => prev.map(a => {
        if (a.id !== agentId) return a;
        return {
          ...a,
          tugas: a.tugas.map(t => (t.id === tempId ? { ...t, id: res.data.id } : t))
        };
      }));
    }
  }, [agentsMap]);

  const setAgentRest = useCallback((agentId, restPlace) => {
    setAgents(prev => prev.map(a => {
      if (a.id !== agentId) return a;
      return { ...a, rest: restPlace, at: null };
    }));
    // Sync ke PostgreSQL backend
    api.updateAgent(agentId, { ruangSantai: restPlace });
  }, []);

  const decideApproval = useCallback((approvalId, action, notes) => {
    // Sync ke PostgreSQL backend
    const decision = action === 'ok' ? 'approve' : 'revise';
    api.decideApproval(approvalId, decision, notes);

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

  // Efek Auto-Approval AI Cerdas: Menilai peluang FYP (bisa Setuju atau Revisi)
  useEffect(() => {
    if (!autoApproval) return;
    const firstPending = approvals.find(x => x.state === 'pending');
    if (!firstPending) return;

    // AI mengevaluasi potensi viral / FYP dalam 3.8 detik
    const timer = setTimeout(() => {
      // Tentukan skor FYP dari item atau kalkulasi otomatis
      const score = firstPending.fypScore !== undefined ? firstPending.fypScore : 82;
      const passThreshold = 75;

      if (score >= passThreshold) {
        // Lolos evaluasi FYP -> Disetujui
        decideApproval(firstPending.id, 'ok');
        setLiveMessage(`🤖 AI Chief Editor: DISETUJUI! (Peluang FYP: ${score}%). "${firstPending.judul}" memenuhi standar viral.`);
      } else {
        // Di bawah standar FYP -> Minta Revisi dengan catatan perbaikan
        const revNote = firstPending.alasanFyp || 'Hook pembuka kurang tajam untuk FYP. Buat 3 detik pertama lebih memicu rasa penasaran.';
        decideApproval(firstPending.id, 'rev', revNote);
        setLiveMessage(`⚠️ AI Chief Editor: REVISI DIMINTA! (Peluang FYP: ${score}%). "${firstPending.judul}" perlu perbaikan hook agar trending.`);
      }
    }, 3800);

    return () => clearTimeout(timer);
  }, [autoApproval, approvals, decideApproval]);

  const toggleAutoApproval = useCallback(() => {
    setAutoApproval(prev => !prev);
  }, []);

  // Suntikkan Ide Baru dari CEO ke Tim AI (Mendukung 3 Pilar: Multimedia, Design, Web Development)
  const submitCeoIdea = useCallback(async (ideaText, pilar = 'Multimedia') => {
    const text = ideaText.trim();
    if (!text) return;

    // 1. Catat ke backend konten jika API aktif
    api.createContent({
      judul: `[${pilar}] Ide CEO: ${text}`,
      format: pilar === 'Design' ? 'Carousel' : 'Reels / TikTok',
      platform: 'Instagram',
      status: 'draft'
    });

    // 2. Suntikkan ke agen Brainstorming ('ide') & Perencana ('perencana')
    const conceptsByPilar = {
      Multimedia: [
        `Reels 30s: Hook perbandingan visual sebelum vs sesudah tentang "${text}".`,
        `Carousel 7 Slide: Panduan peralatan & setting kamera/editing untuk "${text}".`,
        `Shorts/Story: Trik cepat 15 detik yang belum banyak diketahui orang.`
      ],
      Design: [
        `Carousel 7 Slide: Kesalahan visual fatal & solusinya seputar "${text}".`,
        `Reels 20s: Bedah layout desain brand terkenal dengan topik "${text}".`,
        `Story: Polling "Mana desain yang lebih menjual? A atau B?"`
      ],
      'Web Development': [
        `Reels 30s: Efek interaktif website yang bikin user terkesima ("${text}").`,
        `Carousel 7 Slide: Trik CSS & JavaScript modern untuk implementasi "${text}".`,
        `Story: Kuis coding interaktif "Tebak output dari kode ini!"`
      ]
    };

    const concepts = conceptsByPilar[pilar] || conceptsByPilar.Multimedia;

    setAgents(prev => prev.map(a => {
      if (a.id === 'ide') {
        return {
          ...a,
          status: 'working',
          sLabel: 'Bekerja',
          now: `Mengembangkan ide edukasi [${pilar}] dari CEO: "${text}" menjadi konten viral.`,
          tugas: [
            { id: Date.now(), t: `Brainstorming ide edukasi viral [${pilar}]: "${text}"`, d: false },
            ...a.tugas
          ],
          out: {
            t: `Konsep Edukasi Viral [${pilar}]: "${text}"`,
            items: concepts
          }
        };
      }
      if (a.id === 'perencana') {
        return {
          ...a,
          status: 'working',
          sLabel: 'Bekerja',
          now: `Menjadwalkan slot tayang prime time edukasi [${pilar}]: "${text}".`
        };
      }
      return a;
    }));

    // 3. Masukkan ke antrean persetujuan dengan skor FYP tinggi (berasal langsung dari arahan CEO)
    const newApprovalId = String(Date.now());
    setApprovals(prev => [
      {
        id: newApprovalId,
        dari: 'ide',
        kategori: pilar,
        judul: `[${pilar}] Ide CEO: ${text.slice(0, 42)}...`,
        ringkas: `Konsep edukasi viral ${pilar} telah disiapkan Brainstorming dari arahan Anda: "${text}".`,
        detail: concepts.join('\n'),
        fypScore: 92,
        alasanFyp: `Peluang FYP Sangat Tinggi: Ide edukasi spesifik ${pilar} dengan hook rasa penasaran dan nilai bookmark tinggi.`,
        state: 'pending'
      },
      ...prev
    ]);

    setSelectedAgentId('ide');
    setLiveMessage(`💡 Ide edukasi [${pilar}] diterima! Tim Brainstorming mulai merancang materi viral: "${text}".`);
  }, []);

  // Eksekusi Tayang Otomatis Berdasarkan Jadwal Harian
  const triggerPublishSlot = useCallback((slot) => {
    // 1. Update agen Upload, Story, dan Komentar agar mengeksekusi konten
    setAgents(prev => prev.map(a => {
      if (a.id === 'upload') {
        return {
          ...a,
          status: 'working',
          sLabel: 'Mengunggah',
          now: `Mengunggah konten jadwal ${slot.time}: "${slot.title}" ke ${slot.platform}.`,
          tugas: a.tugas.map((t, idx) => (idx === 0 ? { ...t, d: true } : t))
        };
      }
      if (a.id === 'story') {
        return {
          ...a,
          status: 'working',
          sLabel: 'Bekerja',
          now: `Menyiapkan story teaser & tautan untuk: "${slot.title}".`
        };
      }
      if (a.id === 'komentar') {
        return {
          ...a,
          status: 'working',
          sLabel: 'Memantau',
          now: `Memantau komentar masuk pada konten baru: "${slot.title}".`
        };
      }
      return a;
    }));

    // 2. Simpan status published ke backend jika API aktif
    api.createContent({
      judul: slot.title,
      format: slot.format,
      platform: slot.platform,
      status: 'published',
      jadwalTayang: new Date().toISOString()
    });

    setLiveMessage(`🚀 KONTEN TAYANG OTOMATIS: "${slot.title}" berhasil dipublikasikan ke ${slot.platform}!`);
  }, []);

  // Mengarahkan Karyawan ke Lokasi Rutinitas (Meeting, Lunch, Gaming, Tidur, dll.)
  const triggerOfficeRoutine = useCallback((routine) => {
    const loc = routine.locationId; // 'meeting', 'lunch', 'ps', 'dorm', 'desk'

    setAgents(prev => prev.map(a => {
      if (a.id === 'ceo') return a;

      if (loc === 'desk') {
        return {
          ...a,
          status: 'working',
          sLabel: 'Bekerja',
          at: 'desk',
          rest: 'auto',
          now: `Fokus bekerja pada target edukasi hari ini: ${routine.title}.`
        };
      } else {
        return {
          ...a,
          status: routine.category === 'meeting' ? 'working' : 'waiting',
          sLabel: routine.category === 'meeting' ? 'Rapat' : 'Istirahat',
          rest: loc,
          at: null,
          now: `Sedang mengikuti ${routine.title} di ${routine.locationLabel}.`
        };
      }
    }));

    setLiveMessage(`🏢 [${routine.timeStart} WIB] ${routine.title} dimulai di ${routine.locationLabel}.`);
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
    triggerOfficeRoutine
  };
}
