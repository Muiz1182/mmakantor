import { Router } from 'express';
import { getAllApprovals, decideApproval } from '../services/officeStore.js';

const router = Router();

// GET /api/approvals - Ambil daftar antrean persetujuan CEO
router.get('/', async (req, res) => {
  try {
    const result = await getAllApprovals();
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/approvals/:id/decision - Keputusan CEO: setuju atau revisi
router.post('/:id/decision', async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, notes } = req.body;

    if (!['approve', 'revise'].includes(decision)) {
      return res.status(400).json({
        success: false,
        error: "Keputusan harus berupa 'approve' (setuju) atau 'revise' (minta revisi)"
      });
    }

    if (decision === 'revise' && (!notes || !notes.trim())) {
      return res.status(400).json({
        success: false,
        error: 'Catatan revisi wajib diisi jika meminta revisi'
      });
    }

    const updated = await decideApproval(id, decision, notes);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Item antrean tidak ditemukan' });
    }

    res.json({
      success: true,
      data: updated,
      message: decision === 'approve'
        ? 'Konten disetujui. Agen melanjutkan alur produksi.'
        : 'Catatan revisi telah dikirim ke agen terkait.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
