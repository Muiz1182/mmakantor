export const ZONES = [
  { id: 'ceo', label: 'Ruang CEO', cls: 'r-ceo' },
  { id: 'meeting', label: 'Ruang Meeting', cls: 'r-meeting' },
  { id: 'plan', label: 'Ruang Strategi', cls: 'r-plan' },
  { id: 'write', label: 'Meja Naskah', cls: 'r-write' },
  { id: 'prod', label: 'Studio', cls: 'r-prod' },
  { id: 'pub', label: 'Meja Publikasi', cls: 'r-pub' }
];

// Ruang Santai Karyawan (TIDAK termasuk Ruang Meeting)
export const LOUNGE_ROOMS = [
  { id: 'lunch', label: 'Cafe & Bar', cap: 6, cls: 'r-lunch' },
  { id: 'ps', label: 'Billiard & Lounge', cap: 6, cls: 'r-ps' },
  { id: 'pool', label: 'Kolam Renang & Deck', cap: 6, cls: 'r-pool' },
  { id: 'musholla', label: 'Musholla', cap: 6, cls: 'r-musholla' },
  { id: 'gym', label: 'Gym & Fitness', cap: 5, cls: 'r-gym' },
  { id: 'dorm', label: 'Asrama Karyawan', cap: 4, cls: 'r-dorm' }
];

// Ruang Khusus Rapat Formal (Bukan tempat santai, hanya dibuka saat sesi rapat dengan CEO)
export const MEETING_ROOM = {
  id: 'meeting',
  label: 'Ruang Meeting Kaca',
  cap: 6,
  cls: 'r-meeting',
  isFormal: true,
  desc: 'Khusus agenda rapat koordinasi resmi dengan CEO. Bukan tempat santai karyawan.'
};

export const ALL_ROOMS = [...LOUNGE_ROOMS, MEETING_ROOM];

export const LOUNGE_MAP = ALL_ROOMS.reduce((acc, r) => {
  acc[r.id] = r;
  return acc;
}, {});
