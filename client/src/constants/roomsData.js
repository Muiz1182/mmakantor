export const ZONES = [
  { id: 'ceo', label: 'Ruang CEO', cls: 'r-ceo' },
  { id: 'plan', label: 'Ruang Strategi', cls: 'r-plan' },
  { id: 'write', label: 'Meja Naskah', cls: 'r-write' },
  { id: 'prod', label: 'Studio', cls: 'r-prod' },
  { id: 'pub', label: 'Meja Publikasi', cls: 'r-pub' }
];

export const LOUNGE_ROOMS = [
  { id: 'lunch', label: 'Ruang Lunch', cap: 5, cls: 'r-lunch' },
  { id: 'ps', label: 'Ruang PlayStation', cap: 5, cls: 'r-ps' },
  { id: 'pool', label: 'Kolam Renang', cap: 5, cls: 'r-pool' },
  { id: 'dorm', label: 'Asrama', cap: 4, cls: 'r-dorm' }
];

export const LOUNGE_MAP = LOUNGE_ROOMS.reduce((acc, r) => {
  acc[r.id] = r;
  return acc;
}, {});
