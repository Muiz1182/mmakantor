import React from 'react';

export function ViewSwitch({ viewMode, onChangeViewMode, onResetCamera }) {
  return (
    <div className="planhead">
      <p className="label">Denah kantor</p>
      <div className="seg" role="group" aria-label="Mode tampilan denah">
        <button
          type="button"
          data-mode="3d"
          aria-pressed={viewMode === '3d'}
          onClick={() => onChangeViewMode('3d')}
        >
          3D
        </button>
        <button
          type="button"
          data-mode="2d"
          aria-pressed={viewMode === '2d'}
          onClick={() => onChangeViewMode('2d')}
        >
          2D
        </button>
      </div>

      <div className="legend" aria-label="Arti penanda status">
        <span className="pill">
          <span className="dot working"></span>Bekerja
        </span>
        <span className="pill">
          <span className="dot waiting"></span>Menunggu
        </span>
        <span className="pill">
          <span className="dot attention"></span>Perlu perhatian
        </span>
      </div>
    </div>
  );
}
