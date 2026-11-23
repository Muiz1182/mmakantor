import { Router } from 'express';
import { checkDatabaseConnection } from '../db/index.js';
import { getAllAgents, getAllApprovals } from '../services/officeStore.js';

const router = Router();

// GET /api/stats - Ringkasan status kantor & database
router.get('/', async (req, res) => {
  try {
    const dbStatus = await checkDatabaseConnection();
    const agentsResult = await getAllAgents();
    const approvalsResult = await getAllApprovals();

    const totalAgents = agentsResult.data.length;
    const working = agentsResult.data.filter(a => a.status === 'working').length;
    const waiting = agentsResult.data.filter(a => a.status === 'waiting').length;
    const attention = agentsResult.data.filter(a => a.status === 'attention').length;
    const pendingApprovals = approvalsResult.data.filter(a => a.status === 'pending').length;

    res.json({
      success: true,
      database: dbStatus,
      source: agentsResult.source,
      stats: {
        totalAgents,
        working,
        waiting,
        attention,
        pendingApprovals
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
