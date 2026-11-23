import React, { useState } from 'react';
import { WEEKLY_SCHEDULE, DAILY_ROUTINES, getCurrentRoutine } from '../constants/scheduleData';

export function ScheduleModal({
  isOpen,
  onClose,
  currentDayIndex,
  currentHour,
  currentMinute,
  onTriggerPublish,
  onTriggerRoutine
}) {
  const [activeTab, setActiveTab] = useState('routines'); // 'routines' atau 'contents'
  const [activeDayIndex, setActiveDayIndex] = useState(currentDayIndex ?? 1);

  if (!isOpen) return null;

  const activeDay = WEEKLY_SCHEDULE.find(d => d.dayIndex === activeDayIndex) || WEEKLY_SCHEDULE[0];
  const isToday = activeDayIndex === currentDayIndex;
  const currentRoutine = getCurrentRoutine(currentHour ?? 8, currentMinute ?? 0);

  return (
    <div className="schedule-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="schedule-modal-title">
      <div className="schedule-modal-content">
        <header className="schedule-modal-header">
          <div className="schedule-title-group">
            <div className="tab-pill-switcher">
              <button
                type="button"
                className={`tab-pill-btn ${activeTab === 'routines' ? 'active' : ''}`}
                onClick={() => setActiveTab('routines')}
              >
                🏢 Rutinitas & Meeting Kantor
              </button>
              <button
                type="button"
                className={`tab-pill-btn ${activeTab === 'contents' ? 'active' : ''}`}
                onClick={() => setActiveTab('contents')}
              >
                📱 Jadwal Konten Medsos
              </button>
            </div>
            <h2 id="schedule-modal-title" className="schedule-title">
              {activeTab === 'routines'
                ? 'Jadwal Operasional & Rutinitas Kantor (07.00 - 23.00 WIB)'
                : 'Jadwal Konten Edukasi Harian (Senin - Minggu)'}
            </h2>
            <p className="schedule-sub">
              {activeTab === 'routines'
                ? 'Mengatur jadwal meeting koordinasi, jam kerja fokus, istirahat makan siang, coffee break sore, hingga jam tidur.'
                : 'Konten edukasi viral (Multimedia, Design, Web Development) terbit otomatis setiap hari di jam prime time.'}
            </p>
          </div>
          <button type="button" className="close-btn" onClick={onClose} aria-label="Tutup Jadwal">
            ✕
          </button>
        </header>

        {/* TAB 1: RUTINITAS KANTOR & MEETING */}
        {activeTab === 'routines' && (
          <main className="schedule-slots-container">
            <div className="slots-header">
              <h3 className="slots-day-title">
                Siklus Aktivitas Harian • <span className="theme-text">Jam Kantor 07.00 - 23.00 WIB</span>
              </h3>
              <span className="slots-count">
                Saat Ini: <b>{currentRoutine?.title}</b>
              </span>
            </div>

            <div className="routine-timeline-list">
              {DAILY_ROUTINES.map((routine) => {
                const isCurrent = routine.id === currentRoutine?.id;

                return (
                  <article key={routine.id} className={`routine-card ${routine.category} ${isCurrent ? 'is-current' : ''}`}>
                    <div className="routine-card-left">
                      <span className="routine-icon">{routine.icon}</span>
                      <div className="routine-time-box">
                        <span className="routine-time">{routine.timeStart} - {routine.timeEnd}</span>
                        <span className="routine-wib">WIB</span>
                      </div>
                    </div>

                    <div className="routine-card-body">
                      <div className="routine-badge-row">
                        <span className={`routine-cat-pill ${routine.category}`}>
                          {routine.category === 'meeting' ? '💼 Meeting' : routine.category === 'break' ? '🍱 Istirahat' : routine.category === 'sleep' ? '🛏️ Tidur' : '💻 Kerja Fokus'}
                        </span>
                        <span className="routine-loc-pill">
                          📍 {routine.locationLabel}
                        </span>
                        {isCurrent && (
                          <span className="current-live-badge">
                            🟢 SEDANG BERLANGSUNG
                          </span>
                        )}
                      </div>

                      <h4 className="routine-title">{routine.title}</h4>
                      <p className="routine-desc">{routine.desc}</p>
                    </div>

                    <div className="routine-card-actions">
                      <button
                        type="button"
                        className="routine-action-btn"
                        onClick={() => onTriggerRoutine && onTriggerRoutine(routine)}
                        title={`Arahkan tim ke ${routine.locationLabel}`}
                      >
                        👥 Arahkan Tim ke Sini
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </main>
        )}

        {/* TAB 2: JADWAL KONTEN MEDSOS */}
        {activeTab === 'contents' && (
          <>
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

            {/* Daftar Slot Konten Hari Terpilih */}
            <main className="schedule-slots-container">
              <div className="slots-header">
                <h3 className="slots-day-title">
                  {activeDay.dayName} - <span className="theme-text">{activeDay.theme}</span>
                </h3>
                <span className="slots-count">{activeDay.slots.length} Konten Terjadwal</span>
              </div>

              <div className="slots-list">
                {activeDay.slots.map((slot) => {
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
          </>
        )}

        <footer className="schedule-modal-footer">
          <div className="footer-info">
            <span>💡 <b>Sistem Otomasi:</b> Agen secara otomatis berpindah ruangan mengikuti jadwal rutinitas (meeting, lunch, dll) dan menerbitkan konten saat jam prime time tiba.</span>
          </div>
          <button type="button" className="schedule-done-btn" onClick={onClose}>
            Selesai
          </button>
        </footer>
      </div>
    </div>
  );
}
