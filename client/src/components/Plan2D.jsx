import React from 'react';
import { ZONES, LOUNGE_ROOMS, LOUNGE_MAP } from '../constants/roomsData';
import { Avatar } from './Avatar';

export function Plan2D({ agents, agentsMap, selectedAgentId, onSelectAgent, pendingApprovalsCount }) {
  function getAgentStatusInfo(agent) {
    if (agent.id === 'ceo') {
      return pendingApprovalsCount > 0
        ? { k: 'attention', l: `${pendingApprovalsCount} menunggu Anda` }
        : { k: 'waiting', l: 'Antrean kosong' };
    }
    return { k: agent.status, l: agent.sLabel };
  }

  return (
    <div className="plan" id="plan">
      {/* Ruang Kerja Operasional */}
      {ZONES.filter(z => z.id !== 'meeting').map(z => {
        const zoneAgents = agents.filter(a => a.zone === z.id);

        return (
          <section key={z.id} className={`room ${z.cls}`} aria-label={z.label}>
            <p className="label">{z.label}</p>
            <div className="desks">
              {zoneAgents.map(a => {
                const isSelected = selectedAgentId === a.id;
                const status = getAgentStatusInfo(a);
                const isResting = a.at && a.at !== 'desk';
                const restRoomLabel = isResting && LOUNGE_MAP[a.at] ? LOUNGE_MAP[a.at].label : null;

                return (
                  <button
                    key={a.id}
                    type="button"
                    className="desk"
                    aria-pressed={isSelected}
                    onClick={() => onSelectAgent(a.id)}
                  >
                    <Avatar hue={a.hue} />
                    <span className="nm">{a.id === 'ceo' ? 'Anda (CEO)' : a.nama}</span>
                    <span className="pill">
                      <span className={`dot ${status.k}`}></span>
                      {status.l}
                    </span>
                    {restRoomLabel && (
                      <span className="pill resting-tag">
                        {a.at === 'meeting' ? 'Rapat CEO' : `ke ${restRoomLabel}`}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Ruang Meeting Kaca (Khusus Sesi Rapat dengan CEO - Bukan Tempat Santai) */}
      <section className="room r-meeting" aria-label="Ruang Meeting Kaca">
        <div className="room-header-flex">
          <p className="label">💼 Ruang Meeting Kaca (Khusus Rapat CEO)</p>
          <span className="cap-label">{agents.filter(a => a.at === 'meeting').length} / 6 orang</span>
        </div>
        <p className="empty" style={{ margin: '4px 0 8px 0', fontSize: '0.8rem', textAlign: 'left', color: 'var(--ink2)' }}>
          Ruangan formal khusus sesi rapat koordinasi bersama CEO. Bukan tempat santai.
        </p>
        <div className="desks">
          {agents.filter(a => a.at === 'meeting').length === 0 ? (
            <p className="empty">Standby (Pintu tertutup di luar jam rapat)</p>
          ) : (
            agents.filter(a => a.at === 'meeting').map(a => {
              const isSelected = selectedAgentId === a.id;
              const status = getAgentStatusInfo(a);

              return (
                <button
                  key={a.id}
                  type="button"
                  className="desk"
                  aria-pressed={isSelected}
                  onClick={() => onSelectAgent(a.id)}
                >
                  <Avatar hue={a.hue} />
                  <span className="nm">{a.id === 'ceo' ? 'Anda (CEO)' : a.nama}</span>
                  <span className="pill">
                    <span className={`dot ${status.k}`}></span>
                    {a.id === 'ceo' ? 'Memimpin Rapat' : 'Peserta Rapat'}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </section>

      {/* Ruang Santai & Fasilitas Karyawan */}
      {LOUNGE_ROOMS.map(r => {
        const restingAgents = agents.filter(a => a.at === r.id);

        return (
          <section key={r.id} className={`room ${r.cls}`} aria-label={r.label}>
            <div className="room-header-flex">
              <p className="label">{r.label}</p>
              <span className="cap-label">{restingAgents.length} / {r.cap} orang</span>
            </div>
            <div className="desks">
              {restingAgents.length === 0 ? (
                <p className="empty">Kosong</p>
              ) : (
                restingAgents.map(a => {
                  const isSelected = selectedAgentId === a.id;
                  const status = getAgentStatusInfo(a);

                  return (
                    <button
                      key={a.id}
                      type="button"
                      className="desk"
                      aria-pressed={isSelected}
                      onClick={() => onSelectAgent(a.id)}
                    >
                      <Avatar hue={a.hue} />
                      <span className="nm">{a.nama}</span>
                      <span className="pill">
                        <span className={`dot ${status.k}`}></span>
                        {status.l}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
