const API_BASE = 'http://localhost:3001/api';

export const api = {
  // Ambil seluruh agen dan tugas dari backend PostgreSQL
  async getAgents() {
    try {
      const res = await fetch(`${API_BASE}/agents`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('⚠️ Gagal terhubung ke Backend API, menggunakan data lokal:', err.message);
      return null;
    }
  },

  // Perbarui status atau ruang santai agen
  async updateAgent(id, data) {
    try {
      const res = await fetch(`${API_BASE}/agents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('⚠️ Gagal update agen ke backend:', err.message);
      return null;
    }
  },

  // Tambah tugas baru untuk agen
  async addTask(agentId, judul) {
    try {
      const res = await fetch(`${API_BASE}/agents/${agentId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ judul }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('⚠️ Gagal tambah tugas ke backend:', err.message);
      return null;
    }
  },

  // Toggle status tugas selesai
  async toggleTask(taskId, selesai) {
    try {
      const res = await fetch(`${API_BASE}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selesai }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('⚠️ Gagal update status tugas ke backend:', err.message);
      return null;
    }
  },

  // Ambil antrean persetujuan CEO
  async getApprovals() {
    try {
      const res = await fetch(`${API_BASE}/approvals`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('⚠️ Gagal ambil antrean persetujuan dari backend:', err.message);
      return null;
    }
  },

  // Keputusan CEO: setuju atau revisi
  async decideApproval(id, decision, notes) {
    try {
      const res = await fetch(`${API_BASE}/approvals/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, notes }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('⚠️ Gagal kirim keputusan ke backend:', err.message);
      return null;
    }
  },

  // Cek status server dan database
  async getStats() {
    try {
      const res = await fetch(`${API_BASE}/stats`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      return null;
    }
  }
};
