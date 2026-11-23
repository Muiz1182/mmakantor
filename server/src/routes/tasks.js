import { Router } from 'express';
import { toggleTask } from '../services/officeStore.js';

const router = Router();

// PATCH /api/tasks/:id - Ubah status selesai tugas
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { selesai } = req.body;

    if (typeof selesai !== 'boolean') {
      return res.status(400).json({ success: false, error: 'Field selesai harus bernilai boolean' });
    }

    const updated = await toggleTask(id, selesai);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Tugas tidak ditemukan' });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
