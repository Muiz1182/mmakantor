import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { checkDatabaseConnection } from './db/index.js';
import agentsRouter from './routes/agents.js';
import tasksRouter from './routes/tasks.js';
import approvalsRouter from './routes/approvals.js';
import contentsRouter from './routes/contents.js';
import statsRouter from './routes/stats.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*', // Izinkan akses dari frontend Vite
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const dbStatus = await checkDatabaseConnection();
  res.json({
    status: 'ok',
    service: 'Kantor MMA Production API',
    version: '1.0.0',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/agents', agentsRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/approvals', approvalsRouter);
app.use('/api/contents', contentsRouter);
app.use('/api/stats', statsRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Rute ${req.method} ${req.url} tidak ditemukan` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Server Error:', err);
  res.status(500).json({ success: false, error: 'Terjadi kesalahan internal pada server' });
});

// Jalankan Server
const server = app.listen(PORT, async () => {
  console.log(`\n======================================================`);
  console.log(`🚀 KANTOR MMA PRODUCTION: BACKEND SERVER RUNNING`);
  console.log(`📡 URL API      : http://localhost:${PORT}/api`);
  console.log(`🩺 Health Check : http://localhost:${PORT}/api/health`);
  
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    console.log(`🗄️  PostgreSQL   : ✅ TERHUBUNG (${dbStatus.timestamp})`);
  } else {
    console.log(`🗄️  PostgreSQL   : ⚠️  TIDAK TERHUBUNG (Menggunakan Mode Memory Cadangan)`);
    console.log(`ℹ️  Petunjuk     : ${dbStatus.hint || dbStatus.error}`);
  }
  console.log(`======================================================\n`);
});

export default app;
