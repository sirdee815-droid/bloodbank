import React from 'react';

const NOTIFICATIONS = [
  { id: 1, message: 'Your next donation is due in 30 days.', type: 'reminder' },
  { id: 2, message: 'A critical O- request has been issued.', type: 'alert' },
  { id: 3, message: 'Your donor profile is complete and active.', type: 'info' },
];

export default function DonorNotifications() {
  return (
    <div className="glass-card animate-slide-up">
      <h2>Notifications</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Important announcements and reminders for donors.</p>
      <div style={{ marginTop: '1rem', display: 'grid', gap: '0.75rem' }}>
        {NOTIFICATIONS.map((note) => (
          <div key={note.id} className="glass-card" style={{ padding: '1rem' }}>
            <strong>{note.type.toUpperCase()}</strong>
            <p style={{ margin: '0.5rem 0 0', color: 'var(--text-secondary)' }}>{note.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
