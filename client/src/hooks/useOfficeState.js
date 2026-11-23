import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { INITIAL_AGENTS, INITIAL_APPROVALS } from '../constants/agentsData';
import { LOUNGE_ROOMS, ALL_ROOMS, LOUNGE_MAP, MEETING_ROOM } from '../constants/roomsData';
import { getCurrentRoutine, getTodaySchedule, getRoleTaskForRoutine, getRoutinesForDay } from '../constants/scheduleData';
import { api } from '../services/api';

export function useOfficeState() {
  const [agents, setAgents] = useState(() => {
    return INITIAL_AGENTS.map(a => ({
      ...a,
      at: 'desk',
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
              rest: 'auto',
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

  // Compute placed agents - Terikat Otomatis 100% pada Jadwal Operasional Kantor
  const placedAgents = useMemo(() => {
    const list = agents.map(a => ({ ...a }));
    const occ = {};
    ALL_ROOMS.forEach(r => { occ[r.id] = []; });

    const routine = getCurrentRoutine(clockTime.h, clockTime.m, clockTime.dayIndex);
    const todaySchedule = getTodaySchedule(clockTime.dayIndex);
    const todayTheme = todaySchedule?.theme || 'Multimedia & Visual AI';

    const isSleep = routine ? routine.category === 'sleep' : (clockTime.h >= 23 || clockTime.h < 7 || activeTimePhase === 'sleep');
    const isBreak = !isSleep && routine && routine.category === 'break';
    const isScheduledMeeting = !isSleep && !isBreak && routine && (routine.category === 'meeting' || routine.locationId === 'meeting');
    const meetingParticipants = ['ceo', 'analis', 'ide', 'kamera', 'editor', 'carousel'];

    list.forEach((a, i) => {
      // 1. Sesi Rapat Resmi Bersama CEO (Otomatis saat jadwal rapat atau tombol rapat CEO ditekan)
      if (isScheduledMeeting || a.at === 'meeting') {
        const idx = meetingParticipants.indexOf(a.id);
        if (idx !== -1) {
          const sl = a.id === 'ceo' ? 5 : idx - 1;
          if (occ['meeting'] && !occ['meeting'][sl]) {
            occ['meeting'][sl] = a.id;
          }
          a.at = 'meeting';
          a.slot = sl;
          a.status = 'working';
          a.sLabel = 'Rapat';
          a.now = getRoleTaskForRoutine(a.id, routine, todayTheme);
          return;
        }
      }

      // 2. Di luar jam kerja (23.00 - 07.00 WIB) atau mode sleep: Semua istirahat tidur di Asrama (dorm)
      if (isSleep) {
        const rId = 'dorm';
        const cap = LOUNGE_MAP[rId]?.cap || 4;
        for (let sl = 0; sl < cap; sl++) {
          if (!occ[rId][sl]) {
            occ[rId][sl] = a.id;
            a.at = rId;
            a.slot = sl;
            a.status = 'waiting';
            a.sLabel = 'Istirahat';
            a.now = 'Istirahat malam di Asrama Karyawan MMA.';
            return;
          }
        }
      }

      // 3. Jam istirahat resmi sesuai jadwal kantor (misal: 12.00 - 13.00 Makan Siang, 17.30 - 18.30 Rehat Sore)
      if (isBreak) {
        const breakRoomActivities = {
          lunch: 'Santap siang & ngopi santai di Cafe & Kantin.',
          ps: 'Main biliar & game PS5 di Game Lounge.',
          pool: 'Duduk santai di sun lounger tepi Kolam Renang.',
          musholla: 'Wudhu dan sholat berjamaah di Musholla.',
          gym: 'Peregangan otot dan treadmill di Gym & Fitness.',
          dorm: 'Rehat sejenak power nap di Asrama Karyawan.'
        };

        const targetRoom = (a.rest && a.rest !== 'auto' && a.rest !== 'desk' && a.rest !== 'meeting')
          ? a.rest
          : LOUNGE_ROOMS[i % LOUNGE_ROOMS.length].id;
        const cap = LOUNGE_MAP[targetRoom]?.cap || 4;
        let assigned = false;

        for (let sl = 0; sl < cap; sl++) {
          if (!occ[targetRoom][sl]) {
            occ[targetRoom][sl] = a.id;
            a.at = targetRoom;
            a.slot = sl;
            a.status = 'waiting';
            a.sLabel = 'Istirahat';
            a.now = breakRoomActivities[targetRoom] || getRoleTaskForRoutine(a.id, routine, todayTheme);
            assigned = true;
            return;
          }
        }

        // Jika ruangan target penuh, cari ruangan santai lain yang masih memiliki slot
        if (!assigned) {
          for (const lr of LOUNGE_ROOMS) {
            const cap2 = LOUNGE_MAP[lr.id]?.cap || 4;
            for (let sl = 0; sl < cap2; sl++) {
              if (!occ[lr.id][sl]) {
                occ[lr.id][sl] = a.id;
                a.at = lr.id;
                a.slot = sl;
                a.status = 'waiting';
                a.sLabel = 'Istirahat';
                a.now = breakRoomActivities[lr.id] || getRoleTaskForRoutine(a.id, routine, todayTheme);
                return;
              }
            }
          }
        }
      }

      // 4. JAM KERJA KANTOR OPERASIONAL (07.00 - 23.00 WIB):
      // SELURUH KARYAWAN AI SECARA OTOMATIS BEKERJA DI MEJA MASING-MASING!
      // Fokus 100% pada pekerjaan sesuai jadwal operasional jam saat ini (realtime non-looping)
      a.at = 'desk';
      a.slot = 0;
      if (a.id !== 'ceo') {
        a.status = 'working';
        a.sLabel = 'Bekerja';
      }
      a.now = getRoleTaskForRoutine(a.id, routine, todayTheme);
    });

    return list;
  }, [agents, clockTime.h, clockTime.m, clockTime.dayIndex, clockTime.isOfficeHours, activeTimePhase]);

  const currentRoutine = useMemo(() => {
    return getCurrentRoutine(clockTime.h, clockTime.m, clockTime.dayIndex);
  }, [clockTime.h, clockTime.m, clockTime.dayIndex]);

  // Notifikasi Pergantian Jam & Rutinitas Operasional Realtime
  const [routineAnnouncement, setRoutineAnnouncement] = useState(null);
  const lastRoutineIdRef = useRef(null);

  useEffect(() => {
    if (!currentRoutine) return;
    
    // Jika rutinitas operasional berganti ke jam berikutnya
    if (lastRoutineIdRef.current && lastRoutineIdRef.current !== currentRoutine.id) {
      const dayRoutines = getRoutinesForDay(clockTime.dayIndex);
      const currentIdx = dayRoutines.findIndex(r => r.id === currentRoutine.id);
      const nextRoutine = currentIdx !== -1 && currentIdx + 1 < dayRoutines.length
        ? dayRoutines[currentIdx + 1]
        : dayRoutines[0];

      const nextText = nextRoutine
        ? `${nextRoutine.timeStart} - ${nextRoutine.timeEnd} WIB: ${nextRoutine.title} (${nextRoutine.locationLabel})`
        : 'Menunggu jadwal operasional berikutnya';

      setRoutineAnnouncement({
        id: currentRoutine.id,
        timeStart: currentRoutine.timeStart,
        timeEnd: currentRoutine.timeEnd,
        title: currentRoutine.title,
        locationLabel: currentRoutine.locationLabel,
        category: currentRoutine.category,
        desc: currentRoutine.desc,
        icon: currentRoutine.icon || '⏰',
        nextRoutineTitle: nextRoutine?.title,
        nextRoutineTime: nextRoutine ? `${nextRoutine.timeStart} - ${nextRoutine.timeEnd} WIB` : '',
        nextRoutineLoc: nextRoutine?.locationLabel,
        nextText
      });

      setLiveMessage(`⏰ PERGANTIAN JADWAL: [${currentRoutine.timeStart} - ${currentRoutine.timeEnd} WIB] ${currentRoutine.title}. Tim bergerak ke lokasi secara realtime.`);
    }
    lastRoutineIdRef.current = currentRoutine.id;
  }, [currentRoutine, clockTime.dayIndex]);

  // Rotasi Ruang Istirahat Dinamis: Karakter berpindah-pindah tempat santai saat jam istirahat
  useEffect(() => {
    const isBreak = currentRoutine && currentRoutine.category === 'break';
    if (!isBreak) return;

    // Karyawan berganti-ganti tempat santai setiap 24 detik secara berkala
    const timer = setInterval(() => {
      setAgents(prev => {
        const eligible = prev.filter(a => a.id !== 'ceo');
        if (eligible.length === 0) return prev;

        // Pilih 1 karyawan acak untuk berpindah ruangan
        const candidate = eligible[Math.floor(Math.random() * eligible.length)];
        const currentRoom = candidate.rest && candidate.rest !== 'auto' ? candidate.rest : candidate.at;

        // Pilihan ruangan istirahat yang berbeda dari ruangan saat ini
        const loungeIds = ['lunch', 'ps', 'pool', 'musholla', 'gym'];
        const otherLounges = loungeIds.filter(id => id !== currentRoom);
        const nextRoom = otherLounges[Math.floor(Math.random() * otherLounges.length)];

        return prev.map(a => {
          if (a.id === candidate.id) {
            return {
              ...a,
              rest: nextRoom
            };
          }
          return a;
        });
      });
    }, 24000);

    return () => clearInterval(timer);
  }, [currentRoutine]);

  // Auto-dismiss pengumuman setelah 12 detik
  useEffect(() => {
    if (!routineAnnouncement) return;
    const timer = setTimeout(() => {
      setRoutineAnnouncement(null);
    }, 12000);
    return () => clearTimeout(timer);
  }, [routineAnnouncement]);

  const agentsMap = useMemo(() => {
    return placedAgents.reduce((acc, a) => {
      acc[a.id] = a;
      return acc;
    }, {});
  }, [placedAgents]);

  const selectedAgent = agentsMap[selectedAgentId] || agentsMap['ceo'];

  // Actions
  const selectAgent = useCallback((id) => {
    if (id) {
      setSelectedAgentId(id);
    }
  }, []);

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

  // Otomasi Publikasi Medsos Selaras Jadwal Operasional Harian
  const publishedSlotsRef = useRef(new Set());
  useEffect(() => {
    if (!clockTime) return;
    const today = getTodaySchedule(clockTime.dayIndex);
    if (!today || !Array.isArray(today.slots)) return;

    const timeStr = `${String(clockTime.h).padStart(2, '0')}:${String(clockTime.m).padStart(2, '0')}`;
    const slotToPublish = today.slots.find(s => s.time === timeStr);

    if (slotToPublish) {
      const slotKey = `${clockTime.dayIndex}-${slotToPublish.id}-${timeStr}`;
      if (!publishedSlotsRef.current.has(slotKey)) {
        publishedSlotsRef.current.add(slotKey);
        triggerPublishSlot(slotToPublish);
      }
    }
  }, [clockTime, triggerPublishSlot]);

  // Status apakah sesi rapat dengan CEO sedang berlangsung
  const isMeetingActive = useMemo(() => {
    return agents.some(a => a.at === 'meeting');
  }, [agents]);

  // Tombol aksi cepat: Mulai / Selesaikan Rapat Resmi dengan CEO di Ruang Meeting Kaca
  const toggleCeoMeeting = useCallback(() => {
    const meetingParticipants = ['ceo', 'analis', 'ide', 'kamera', 'editor', 'carousel'];

    setAgents(prev => {
      const currentlyInMeeting = prev.some(a => a.at === 'meeting');

      if (currentlyInMeeting) {
        // Selesaikan rapat, kembalikan CEO dan semua tim ke meja kerja masing-masing
        setLiveMessage('Sesi rapat dengan CEO selesai. Karyawan kembali ke meja kerja masing-masing.');
        return prev.map(a => ({
          ...a,
          status: a.id === 'ceo' ? 'waiting' : 'working',
          sLabel: a.id === 'ceo' ? 'CEO' : 'Bekerja',
          at: 'desk',
          slot: 0,
          rest: 'auto',
          now: a.id === 'ceo'
            ? 'Memeriksa antrean persetujuan dan menentukan fokus konten.'
            : 'Fokus bekerja di meja mengeksekusi arahan hasil rapat bersama CEO.'
        }));
      } else {
        // Mulai rapat koordinasi resmi di Ruang Meeting Kaca bersama CEO
        setLiveMessage('💼 Sesi Rapat Resmi dengan CEO dimulai di Ruang Meeting Kaca.');
        return prev.map(a => {
          const idx = meetingParticipants.indexOf(a.id);
          if (idx !== -1) {
            return {
              ...a,
              status: 'working',
              sLabel: 'Rapat',
              at: 'meeting',
              slot: a.id === 'ceo' ? 5 : idx - 1, // CEO di kepala meja (slot 5), peserta di slot 0-4
              now: a.id === 'ceo'
                ? 'Memimpin rapat koordinasi konten viral dan strategi pilar edukasi bersama tim di Ruang Meeting.'
                : 'Mengikuti rapat koordinasi dan evaluasi konten viral bersama CEO di Ruang Meeting.'
            };
          }
          return {
            ...a,
            at: 'desk',
            slot: 0,
            now: 'Fokus bekerja mandiri di meja saat tim inti sedang meeting bersama CEO.'
          };
        });
      }
    });
  }, []);

  // Mengarahkan Karyawan ke Lokasi Rutinitas (Meeting, Lunch, Gaming, Tidur, dll.)
  const triggerOfficeRoutine = useCallback((routine) => {
    const loc = routine.locationId; // 'meeting', 'lunch', 'ps', 'dorm', 'desk', 'musholla', 'gym'
    const isMeeting = routine.category === 'meeting' || loc === 'meeting';
    const isSleep = routine.category === 'sleep' || loc === 'dorm';
    const meetingParticipants = ['ceo', 'analis', 'ide', 'kamera', 'editor', 'carousel'];
    const todaySchedule = getTodaySchedule(clockTime.dayIndex);
    const todayTheme = todaySchedule?.theme || 'Multimedia';

    // Munculkan notifikasi pengumuman jadwal saat ini & jadwal berikutnya
    const dayRoutines = getRoutinesForDay(clockTime.dayIndex);
    const currentIdx = dayRoutines.findIndex(r => r.id === routine.id);
    const nextRoutine = currentIdx !== -1 && currentIdx + 1 < dayRoutines.length
      ? dayRoutines[currentIdx + 1]
      : dayRoutines[0];

    const nextText = nextRoutine
      ? `${nextRoutine.timeStart} - ${nextRoutine.timeEnd} WIB: ${nextRoutine.title} (${nextRoutine.locationLabel})`
      : 'Menunggu jadwal operasional berikutnya';

    setRoutineAnnouncement({
      id: routine.id,
      timeStart: routine.timeStart,
      timeEnd: routine.timeEnd,
      title: routine.title,
      locationLabel: routine.locationLabel,
      category: routine.category,
      desc: routine.desc,
      icon: routine.icon || '⏰',
      nextRoutineTitle: nextRoutine?.title,
      nextRoutineTime: nextRoutine ? `${nextRoutine.timeStart} - ${nextRoutine.timeEnd} WIB` : '',
      nextRoutineLoc: nextRoutine?.locationLabel,
      nextText
    });

    setAgents(prev => prev.map((a, i) => {
      if (isMeeting) {
        const idx = meetingParticipants.indexOf(a.id);
        if (idx !== -1) {
          return {
            ...a,
            status: 'working',
            sLabel: 'Rapat',
            at: 'meeting',
            slot: a.id === 'ceo' ? 5 : idx - 1,
            now: a.id === 'ceo'
              ? `Memimpin rapat resmi "${routine.title}" di Ruang Meeting Kaca.`
              : `Mengikuti rapat resmi "${routine.title}" bersama CEO di Ruang Meeting Kaca.`
          };
        }
        return {
          ...a,
          at: 'desk',
          slot: 0,
          now: 'Fokus bekerja mandiri di meja saat rapat dengan CEO berlangsung.'
        };
      }

      if (a.id === 'ceo') {
        return {
          ...a,
          at: 'desk',
          slot: 0,
          now: 'Berada di Ruang CEO memantau perkembangan kantor.'
        };
      }

      if (isSleep) {
        return {
          ...a,
          status: 'waiting',
          sLabel: 'Istirahat',
          rest: 'dorm',
          at: 'dorm',
          slot: i % 4,
          now: 'Istirahat malam di Asrama Karyawan MMA.'
        };
      }

      if (loc === 'desk' || routine.category === 'work') {
        return {
          ...a,
          status: 'working',
          sLabel: 'Bekerja',
          at: 'desk',
          slot: 0,
          rest: 'auto',
          now: getRoleTaskForRoutine(a.id, routine, todayTheme)
        };
      } else {
        const targetRoom = LOUNGE_MAP[loc] ? loc : LOUNGE_ROOMS[i % LOUNGE_ROOMS.length].id;
        const cap = LOUNGE_MAP[targetRoom]?.cap || 4;
        return {
          ...a,
          status: 'waiting',
          sLabel: 'Istirahat',
          rest: targetRoom,
          at: targetRoom,
          slot: i % cap,
          now: getRoleTaskForRoutine(a.id, routine, todayTheme)
        };
      }
    }));

    setLiveMessage(`🏢 [${routine.timeStart} WIB] ${routine.title} dimulai di ${routine.locationLabel}. Tim berjalan ke lokasi.`);
  }, [clockTime.dayIndex]);

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

  // Eksekusi AI per Agen (Tahap 4)
  const [isRunningAI, setIsRunningAI] = useState(false);

  const runAgentAI = useCallback(async (agentId, promptText, customPilar) => {
    setIsRunningAI(true);
    const targetAgent = agents.find(a => a.id === agentId);
    const agentName = targetAgent ? targetAgent.nama : agentId;
    setLiveMessage(`⚡ Menjalankan model AI untuk ${agentName}...`);

    try {
      const res = await api.runAgent(agentId, {
        prompt: promptText,
        pilar: customPilar || 'Multimedia'
      });

      if (res && res.success) {
        // Refresh antrean persetujuan dari backend
        const appsRes = await api.getApprovals();
        if (appsRes && appsRes.success && Array.isArray(appsRes.data)) {
          setApprovals(appsRes.data.map(item => ({
            id: String(item.id),
            dari: item.agentId,
            judul: item.judul,
            ringkas: item.ringkasan,
            detail: item.detail,
            state: item.status === 'approved' ? 'ok' : (item.status === 'rejected' ? 'rev' : 'pending'),
          })));
        }

        // Refresh data agen dan outputs
        const agRes = await api.getAgents();
        if (agRes && agRes.success && Array.isArray(agRes.data)) {
          setAgents(prev => prev.map(localA => {
            const dbA = agRes.data.find(x => x.id === localA.id);
            if (!dbA) return localA;
            return {
              ...localA,
              status: dbA.status || localA.status,
              sLabel: dbA.status === 'working' ? 'Bekerja' : (dbA.status === 'waiting' ? 'Menunggu' : 'Perlu tindakan'),
              now: dbA.sedangKerja || localA.now,
              out: dbA.outputs && dbA.outputs.length > 0
                ? { t: dbA.outputs[0].judul, items: [dbA.outputs[0].isi] }
                : localA.out
            };
          }));
        }

        setLiveMessage(`✅ Draf AI dari ${res.data.agentNama} berhasil dibuat! Otomatis masuk ke Antrean Persetujuan CEO.`);
        return res.data;
      }
    } catch (err) {
      console.warn('Gagal menjalankan AI agen:', err);
      setLiveMessage(`⚠️ Gagal menjalankan AI agen: ${err.message}`);
    } finally {
      setIsRunningAI(false);
    }
    return null;
  }, [agents]);

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
    triggerOfficeRoutine,
    isMeetingActive,
    toggleCeoMeeting,
    currentRoutine,
    routineAnnouncement,
    setRoutineAnnouncement,
    runAgentAI,
    isRunningAI
  };
}
