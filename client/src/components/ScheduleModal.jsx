import React, { useState } from 'react';
import { WEEKLY_SCHEDULE } from '../constants/scheduleData';

export function ScheduleModal({ isOpen, onClose, currentDayIndex, currentHour, currentMinute, onTriggerPublish }) {
  const [activeDayIndex, setActiveDayIndex] = useState(currentDayIndex ?? 1);

  if (!isOpen) return null;

  const activeDay = WEEKLY_SCHEDULE.find(d => d.dayIndex === activeDayIndex) || WEEKLY_SCHEDULE[0];
  const isToday = activeDayIndex === currentDayIndex;

  return (
    <div className="schedule-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="schedule-modal-title">
      <div className="schedule-modal-content">
        <header className="schedule-modal-header">
          <div className="schedule-title-group">
            <span className="schedule-badge">KALENDER OTOMATIS</span>
            <h2 id="schedule-modal-title" className="schedule-title">
              Jadwal Publikasi Harian MMA PRODUCTION
            </h2>
            <p className="schedule-sub">
              Konten edukasi viral (Multimedia, Design, Web Development) terbit otomatis setiap hari sesuai jam prime time.
            </p>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Tutup Jadwal">
            ✕
          </button>
        </header>

        {/* Tab Hari (Senin - Minggu) */}
        <nav className="schedule-days-nav" aria-label="Pilih Hari">
          {WEEKLY_SCHEDULE.map(day => {
            const isSelected = day.dayIndex === activeDayIndex;
            const isActualToday = day.dayIndex === currentDayIndex;

            return (
              <button
                key={day.dayName}
                type="button"
                className={`day-tab ${isSelected ? 'active' : ''} ${isActualToday ? 'is-today' : ''}`}
                onClick={() => setActiveDayIndex(day.dayIndex)}
              >
                <span className="day-name">{day.dayName}</span>
                {isActualToday && <span className="today-dot" title="Hari Ini">Hari Ini</span>}
                <span className="day-theme">{day.theme.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

        {/* Daftar Slot Konten Hari Ini */}
        <main className="schedule-slots-container">
          <div className="slots-header">
            <h3 className="slots-day-title">
              {activeDay.dayName} - <span className="theme-text">{activeDay.theme}</span>
            </h3>
            <span className="slots-count">{activeDay.slots.length} Konten Terjadwal</span>
          </div>

          <div className="slots-list">
            {activeDay.slots.map((slot, idx) => {
              // Hitung status apakah sudah tayang berdasarkan jam hari ini
              const [slotH, slotM] = slot.time.split(':').map(Number);
              const isPastTime = isToday && (currentHour > slotH || (currentHour === slotH && currentMinute >= slotM));
              const statusClass = isPastTime ? 'published' : 'scheduled';
              const statusLabel = isPastTime ? 'Sudah Tayang (Live)' : `Terjadwal Otomatis: ${slot.time} WIB`;

              return (
                <article key={slot.id} className={`slot-card ${statusClass}`}>
                  <div className="slot-card-left">
                    <span className="slot-time">⏰ {slot.time} WIB</span>
                    <span className={`slot-pilar-tag ${slot.pilar.toLowerCase().replace(/\s+/g, '-')}`}>
                      {slot.pilar}
                    </span>
                    <span className="slot-platform">{slot.platform}</span>
                  </div>

                  <div className="slot-card-body">
                    <div className="slot-badge-row">
                      <span className="slot-format">{slot.format}</span>
                      <span className={`slot-status-pill ${statusClass}`}>
                        {isPastTime ? '✅ ' : '⏳ '}
                        {statusLabel}
                      </span>
                    </div>

                    <h4 className="slot-title">{slot.title}</h4>
                    <p className="slot-hook">
                      <b>Hook 3 Detik:</b> "{slot.hook}"
                    </p>
                  </div>

                  <div className="slot-card-actions">
                    <button
                      type="button"
                      className="slot-action-btn"
                      onClick={() => onTriggerPublish && onTriggerPublish(slot)}
                      title="Simulasikan tayang otomatis sekarang"
                    >
                      ⚡ Tayangkan Sekarang
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </main>

        <footer className="schedule-modal-footer">
          <div className="footer-info">
            <span>💡 <b>Sistem Otomasi:</b> Konten di atas otomatis dipublikasikan oleh agen Upload & Story saat jam target tiba.</span>
          </div>
          <button type="button" className="schedule-done-btn" onClick={onClose}>
            Selesai
          </button>
        </footer>
      </div>
    </div>
  );
}
