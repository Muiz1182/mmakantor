import { Router } from 'express';
import { getAllContents, createContent } from '../services/officeStore.js';

const router = Router();

// GET /api/contents - Ambil semua konten
router.get('/', async (req, res) => {
  try {
    const result = await getAllContents();
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/contents - Tambah konten baru
router.post('/', async (req, res) => {
  try {
    const { judul, format, platform, status, jadwalTayang } = req.body;

    if (!judul || !judul.trim()) {
      return res.status(400).json({ success: false, error: 'Judul konten wajib diisi' });
    }

    const newContent = await createContent({
      judul: judul.trim(),
      format,
      platform,
      status,
      jadwalTayang
    });

    res.status(201).json({ success: true, data: newContent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
