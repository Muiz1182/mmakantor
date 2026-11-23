import { Router } from 'express';
import { getAllAgents, updateAgent, addAgentTask } from '../services/officeStore.js';

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

// GET /api/agents/:id - Ambil detail agen tertentu
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await getAllAgents();
    const agent = data.find(a => a.id === id);
    if (!agent) {
      return res.status(404).json({ success: false, error: 'Karyawan tidak ditemukan' });
    }
    res.json({ success: true, data: agent });
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

export default router;
