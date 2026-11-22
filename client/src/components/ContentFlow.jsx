import React from 'react';
import { FLOW_STEPS } from '../constants/flowData';

export function ContentFlow({ agentsMap, selectedAgentId, onSelectAgent }) {
  let stepIndex = 0;

  return (
    <section className="flow" aria-label="Alur satu konten">
      <p className="label">Alur satu konten, dari audit sampai tayang</p>
      <ol className="flowlist">
        {FLOW_STEPS.map((id) => {
          if (id === 'GATE') {
            const isSelected = selectedAgentId === 'ceo';
            return (
              <li key="gate-ceo">
                <button
                  type="button"
                  className={`step gate ${isSelected ? 'sel' : ''}`}
                  onClick={() => onSelectAgent('ceo')}
                >
                  <span className="n">CEO</span>
                  Persetujuan
                </button>
              </li>
            );
          }

          stepIndex += 1;
          const agent = agentsMap[id];
          const isSelected = selectedAgentId === id;
          const currentStep = stepIndex;

          return (
            <li key={id}>
              <button
                type="button"
                className={`step ${isSelected ? 'sel' : ''}`}
                onClick={() => onSelectAgent(id)}
              >
                <span className="n">{currentStep}</span>
                {agent ? agent.nama : id}
              </button>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
