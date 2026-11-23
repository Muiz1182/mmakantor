import { Router } from 'express';
import { getAllAgents, updateAgent, addAgentTask, addAgentOutput, createApproval, logAgentRun, getAgentRuns } from '../services/officeStore.js';
import { executeAgentAI } from '../services/aiService.js';
import { AGENT_DEFINITIONS } from '../agents/definitions.js';

const router = Router();

// GET /api/agents - Ambil seluruh 14 agen beserta tugas & output
router.get('/', async (req, res) => {
  try {
    const result = await getAllAgents();
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/agents/ai/definitions - Ambil seluruh definisi system prompt & batasan AI
router.get('/ai/definitions', (req, res) => {
  res.json({
    success: true,
    data: AGENT_DEFINITIONS
  });
});

// GET /api/agents/ai/runs - Ambil riwayat eksekusi AI dan token
router.get('/ai/runs', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const runs = await getAgentRuns(limit);
    res.json({ success: true, ...runs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/agents/:id - Ambil detail agen tertentu
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await getAllAgents();
    const agent = data.find(a => a.id === id);
    if (!agent) {
      return res.status(404).json({ success: false, error: 'Karyawan tidak ditemukan' });
    }
    const def = AGENT_DEFINITIONS[id] || null;
    res.json({ success: true, data: { ...agent, definition: def } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/agents/:id - Perbarui status atau ruang santai
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ruangSantai, sedangKerja } = req.body;

    const allowedStatus = ['working', 'waiting', 'attention'];
    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        error: `Status '${status}' tidak valid. Pilihan: ${allowedStatus.join(', ')}`
      });
    }

    const updated = await updateAgent(id, { status, ruangSantai, sedangKerja });
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Karyawan tidak ditemukan' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/agents/:id/tasks - Tambah tugas baru
router.post('/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    const { judul } = req.body;

    if (!judul || typeof judul !== 'string' || !judul.trim()) {
      return res.status(400).json({ success: false, error: 'Judul tugas wajib diisi' });
    }

    const newTask = await addAgentTask(id, judul.trim());
    res.status(201).json({ success: true, data: newTask });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ============================================================================
// TAHAP 4: POST /api/agents/:id/run - Eksekusi AI per Agen & Otomasi Draf Approval
// ============================================================================
router.post('/:id/run', async (req, res) => {
  try {
    const { id } = req.params;
    const { prompt, pilar = 'Multimedia', contentId = null, context = '' } = req.body;

    // 1. Cek validasi keberadaan agen
    const { data } = await getAllAgents();
    const agent = data.find(a => a.id === id);
    if (!agent) {
      return res.status(404).json({ success: false, error: `Karyawan dengan ID '${id}' tidak ditemukan` });
    }

    // 2. Jalankan Engine AI sesuai System Prompt & Batasan AI Agen
    const aiResult = await executeAgentAI(id, { prompt, pilar, contentId, context });

    // 3. Simpan hasil kerja sebagai output resmi agen
    const newOutput = await addAgentOutput(
      id,
      aiResult.title,
      aiResult.content,
      contentId,
      {
        pilar,
        model: aiResult.model,
        tokensUsed: aiResult.tokensUsed,
        source: aiResult.source
      }
    );

    // 4. OTOMATISASI DRAF KE ANTREAN PERSETUJUAN CEO (Gatekeeper Utama)
    const newApproval = await createApproval({
      agentId: id,
      contentId: contentId || null,
      tipe: aiResult.approvalType || 'konten',
      judul: aiResult.title,
      ringkasan: aiResult.summary,
      detail: aiResult.content,
      status: 'pending'
    });

    // 5. Catat log eksekusi ke tabel agent_runs
    const runLog = await logAgentRun({
      agentId: id,
      input: prompt || `Pilar ${pilar}`,
      output: aiResult.content,
      model: aiResult.model,
      tokenPakai: aiResult.tokensUsed
    });

    // 6. Perbarui status agen menjadi 'waiting' (menunggu persetujuan CEO)
    await updateAgent(id, {
      status: 'waiting',
      sedangKerja: `Menyelesaikan draf AI: "${aiResult.title}". Menunggu peninjauan & persetujuan dari CEO.`
    });

    res.status(200).json({
      success: true,
      message: `AI untuk ${agent.nama} berhasil dijalankan. Draf telah masuk ke Antrean Persetujuan CEO.`,
      data: {
        agentId: id,
        agentNama: agent.nama,
        output: newOutput,
        approval: newApproval,
        runLog: runLog,
        tokensUsed: aiResult.tokensUsed,
        source: aiResult.source,
        model: aiResult.model
      }
    });
  } catch (err) {
    console.error('💥 Error saat menjalankan AI agen:', err);
    res.status(500).json({ success: false, error: err.message || 'Gagal mengeksekusi AI agen' });
  }
});

export default router;
