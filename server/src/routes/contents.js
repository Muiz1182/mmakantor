import { Router } from 'express';
import { getAllContents, createContent } from '../services/officeStore.js';
import { publishToAllOfficialSocials, OFFICIAL_ACCOUNTS } from '../services/socialMediaService.js';

const router = Router();

// GET /api/contents/social-accounts - Informasi akun medsos resmi yang terhubung
router.get('/social-accounts', (req, res) => {
  res.json({
    success: true,
    data: OFFICIAL_ACCOUNTS
  });
});

// POST /api/contents/publish-socials - Eksekusi pengunggahan langsung ke TikTok, IG Reels, dan YT Shorts
router.post('/publish-socials', async (req, res) => {
  try {
    const { title, caption, videoUrl, scheduledTime } = req.body;
    const result = await publishToAllOfficialSocials({
      title: title || 'Video Edukasi MMA Production',
      caption: caption || '',
      videoUrl: videoUrl || '',
      scheduledTime
    });

    // Catat ke log konten lokal/database
    await createContent({
      judul: title || 'Video Edukasi Multi-Platform',
      format: 'Reels / TikTok (9:16)',
      platform: 'TikTok, Instagram, YouTube',
      status: 'published',
      jadwalTayang: scheduledTime || 'Realtime'
    });

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

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
