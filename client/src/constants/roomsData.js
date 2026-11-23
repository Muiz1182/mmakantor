export const ZONES = [
  { id: 'ceo', label: 'Ruang CEO', cls: 'r-ceo' },
  { id: 'meeting', label: 'Ruang Meeting', cls: 'r-meeting' },
  { id: 'plan', label: 'Ruang Strategi', cls: 'r-plan' },
  { id: 'write', label: 'Meja Naskah', cls: 'r-write' },
  { id: 'prod', label: 'Studio', cls: 'r-prod' },
  { id: 'pub', label: 'Meja Publikasi', cls: 'r-pub' }
];

export const LOUNGE_ROOMS = [
  { id: 'lunch', label: 'Cafe & Bar', cap: 5, cls: 'r-lunch' },
  { id: 'ps', label: 'Billiard & Lounge', cap: 5, cls: 'r-ps' },
  { id: 'pool', label: 'Kolam Renang & Deck', cap: 5, cls: 'r-pool' },
  { id: 'musholla', label: 'Musholla', cap: 4, cls: 'r-musholla' },
  { id: 'gym', label: 'Gym & Fitness', cap: 4, cls: 'r-gym' },
  { id: 'dorm', label: 'Asrama Karyawan', cap: 4, cls: 'r-dorm' },
  { id: 'meeting', label: 'Ruang Meeting Kaca', cap: 6, cls: 'r-meeting' }
];

export const LOUNGE_MAP = LOUNGE_ROOMS.reduce((acc, r) => {
  acc[r.id] = r;
  return acc;
}, {});
