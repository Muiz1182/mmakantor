import React from 'react';

export function Avatar({ hue = 210, isLarge = false }) {
  return (
    <svg
      className={`av ${isLarge ? 'lg' : ''}`}
      viewBox="0 0 48 48"
      aria-hidden="true"
      style={{ '--h': hue }}
    >
      <circle cx="24" cy="24" r="24" className="a1" />
      <ellipse cx="24" cy="47" rx="15" ry="12" className="a2" />
      <circle cx="24" cy="19" r="7.5" className="a3" />
    </svg>
  );
}
