import { pool, checkDatabaseConnection } from '../db/index.js';
import { SEED_AGENTS, SEED_APPROVALS } from '../db/seed.js';

// Salinan in-memory sebagai fallback jika database belum dinyalakan oleh user
let memAgents = JSON.parse(JSON.stringify(SEED_AGENTS));
let memApprovals = SEED_APPROVALS.map((a, i) => ({
  id: i + 1,
  ...a,
  dibuat: new Date().toISOString(),
  diputuskan: null,
  catatanRevisi: null
}));
let memContents = [
  {
    id: 1,
    judul: 'Reels: 3 Tips Lighting Video',
    format: 'Reels / TikTok',
    platform: 'Instagram',
    status: 'pending_approval',
    jadwalTayang: '2026-11-26T12:00:00Z',
    dibuat: new Date().toISOString()
  }
];

export async function getAllAgents() {
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    try {
      const client = await pool.connect();
      try {
        const agRes = await client.query('SELECT * FROM agents ORDER BY urutan ASC');
        const tasksRes = await client.query('SELECT * FROM tasks ORDER BY id ASC');
        const outRes = await client.query('SELECT * FROM outputs ORDER BY id DESC');

        const tasksByAgent = {};
        tasksRes.rows.forEach(t => {
          if (!tasksByAgent[t.agent_id]) tasksByAgent[t.agent_id] = [];
          tasksByAgent[t.agent_id].push({ id: t.id, judul: t.judul, selesai: t.selesai });
        });

        const outputsByAgent = {};
        outRes.rows.forEach(o => {
          if (!outputsByAgent[o.agent_id]) outputsByAgent[o.agent_id] = [];
          outputsByAgent[o.agent_id].push({ id: o.id, judul: o.judul, isi: o.isi });
        });

        return {
          source: 'postgresql',
          data: agRes.rows.map(a => ({
            id: a.id,
            nama: a.nama,
            peran: a.peran,
            zona: a.zona,
            status: a.status,
            ruangSantai: a.ruang_santai,
            urutan: a.urutan,
            warna: a.warna,
            ringkasan: a.ringkasan,
            sedangKerja: a.sedang_kerja,
            batasAi: a.batas_ai,
            alurDari: a.alur_dari,
            alurKe: a.alur_ke,
            tasks: tasksByAgent[a.id] || [],
            outputs: outputsByAgent[a.id] || []
          }))
        };
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn('⚠️ Gagal mengambil data PostgreSQL, beralih ke cache memory:', err.message);
    }
  }

  // Fallback in-memory
  return { source: 'memory', data: memAgents };
}

export async function updateAgent(id, updates) {
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    try {
      const client = await pool.connect();
      try {
        const fields = [];
        const values = [];
        let idx = 1;

        if (updates.status !== undefined) {
          fields.push(`status = $${idx++}`);
          values.push(updates.status);
        }
        if (updates.ruangSantai !== undefined) {
          fields.push(`ruang_santai = $${idx++}`);
          values.push(updates.ruangSantai);
        }
        if (updates.sedangKerja !== undefined) {
          fields.push(`sedang_kerja = $${idx++}`);
          values.push(updates.sedangKerja);
        }

        if (fields.length > 0) {
          fields.push(`diperbarui = NOW()`);
          values.push(id);
          await client.query(`UPDATE agents SET ${fields.join(', ')} WHERE id = $${idx}`, values);
        }
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn('⚠️ Gagal update agen di PostgreSQL:', err.message);
    }
  }

  // Update in-memory
  const idx = memAgents.findIndex(a => a.id === id);
  if (idx !== -1) {
    memAgents[idx] = { ...memAgents[idx], ...updates };
    return memAgents[idx];
  }
  return null;
}

export async function addAgentTask(agentId, judul) {
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    try {
      const client = await pool.connect();
      try {
        const res = await client.query(
          'INSERT INTO tasks (agent_id, judul, selesai) VALUES ($1, $2, false) RETURNING id, agent_id, judul, selesai',
          [agentId, judul]
        );
        return res.rows[0];
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn('⚠️ Gagal tambah task di PostgreSQL:', err.message);
    }
  }

  // In-memory
  const ag = memAgents.find(a => a.id === agentId);
  if (ag) {
    const newTask = { id: Date.now(), judul, selesai: false };
    ag.tasks = ag.tasks || [];
    ag.tasks.push(newTask);
    return newTask;
  }
  return null;
}

export async function toggleTask(taskId, selesai) {
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    try {
      const client = await pool.connect();
      try {
        const res = await client.query(
          'UPDATE tasks SET selesai = $1 WHERE id = $2 RETURNING *',
          [selesai, taskId]
        );
        return res.rows[0];
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn('⚠️ Gagal update task di PostgreSQL:', err.message);
    }
  }

  // In-memory
  for (const ag of memAgents) {
    const t = (ag.tasks || []).find(item => item.id == taskId);
    if (t) {
      t.selesai = selesai;
      return t;
    }
  }
  return null;
}

export async function getAllApprovals() {
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    try {
      const client = await pool.connect();
      try {
        const res = await client.query('SELECT * FROM approvals ORDER BY id DESC');
        return {
          source: 'postgresql',
          data: res.rows.map(r => ({
            id: r.id,
            agentId: r.agent_id,
            tipe: r.tipe,
            judul: r.judul,
            ringkasan: r.ringkasan,
            detail: r.detail,
            status: r.status,
            catatanRevisi: r.catatan_revisi,
            dibuat: r.dibuat,
            diputuskan: r.diputuskan
          }))
        };
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn('⚠️ Gagal ambil approvals dari PostgreSQL:', err.message);
    }
  }

  return { source: 'memory', data: memApprovals };
}

export async function decideApproval(id, decision, catatanRevisi) {
  const status = decision === 'approve' ? 'approved' : 'rejected';
  const now = new Date();

  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    try {
      const client = await pool.connect();
      try {
        const res = await client.query(
          `UPDATE approvals 
           SET status = $1, catatan_revisi = $2, diputuskan = NOW() 
           WHERE id = $3 
           RETURNING *`,
          [status, catatanRevisi || null, id]
        );
        const item = res.rows[0];
        if (item) {
          // Update status agen terkait
          const nextStatus = 'working';
          const nextWork = decision === 'approve' 
            ? 'Persetujuan CEO diterima. Melanjutkan ke langkah alur berikutnya.'
            : `Revisi diminta CEO: "${catatanRevisi || 'Perbaiki detail'}". Sedang memperbaiki draf.`;
          
          await client.query(
            `UPDATE agents SET status = $1, sedang_kerja = $2, diperbarui = NOW() WHERE id = $3`,
            [nextStatus, nextWork, item.agent_id]
          );
        }
        return item;
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn('⚠️ Gagal update approval di PostgreSQL:', err.message);
    }
  }

  // In-memory
  const app = memApprovals.find(a => a.id == id);
  if (app) {
    app.status = status;
    app.catatanRevisi = catatanRevisi || null;
    app.diputuskan = now.toISOString();

    const ag = memAgents.find(a => a.id === app.agentId);
    if (ag) {
      ag.status = 'working';
      ag.sedangKerja = decision === 'approve'
        ? 'Persetujuan CEO diterima. Melanjutkan ke langkah alur berikutnya.'
        : `Revisi diminta CEO: "${catatanRevisi || 'Perbaiki detail'}". Sedang memperbaiki draf.`;
    }
    return app;
  }
  return null;
}

export async function getAllContents() {
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    try {
      const client = await pool.connect();
      try {
        const res = await client.query('SELECT * FROM contents ORDER BY id DESC');
        return { source: 'postgresql', data: res.rows };
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn('⚠️ Gagal ambil contents dari PostgreSQL:', err.message);
    }
  }

  return { source: 'memory', data: memContents };
}

export async function createContent(contentData) {
  const { judul, format, platform, status, jadwalTayang } = contentData;
  const dbStatus = await checkDatabaseConnection();
  if (dbStatus.connected) {
    try {
      const client = await pool.connect();
      try {
        const res = await client.query(
          `INSERT INTO contents (judul, format, platform, status, jadwal_tayang)
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [judul, format || 'Reels / TikTok', platform || 'Instagram', status || 'draft', jadwalTayang || null]
        );
        return res.rows[0];
      } finally {
        client.release();
      }
    } catch (err) {
      console.warn('⚠️ Gagal simpan content di PostgreSQL:', err.message);
    }
  }

  const newC = {
    id: memContents.length + 1,
    judul,
    format: format || 'Reels / TikTok',
    platform: platform || 'Instagram',
    status: status || 'draft',
    jadwalTayang: jadwalTayang || null,
    dibuat: new Date().toISOString()
  };
  memContents.unshift(newC);
  return newC;
}
