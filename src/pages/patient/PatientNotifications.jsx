import React from 'react';

const NOTIFICATIONS = [
  { id: 1, message: 'Your most recent request is now pending approval.', type: 'update' },
  { id: 2, message: 'Blood inventory for Group A+ is available.', type: 'availability' },
  { id: 3, message: 'Emergency alert: urgent demand for B- units.', type: 'alert' },
];

export default function PatientNotifications() {
  return (
    <div className="glass-card animate-slide-up">
      <h2>Notifications</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Receive important updates for your blood requests and availability.</p>
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
