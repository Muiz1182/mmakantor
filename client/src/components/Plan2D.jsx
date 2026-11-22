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
      {/* 5 Ruang Kerja */}
      {ZONES.map(z => {
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
                        ke {restRoomLabel}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* 4 Ruang Santai */}
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
