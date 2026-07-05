import React from 'react';
import { Database } from 'lucide-react';

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function PatientDashboard({ requests, inventory }) {
  const pending = (requests || []).filter((req) => req.status === 'pending').length;
  const approved = (requests || []).filter((req) => req.status === 'approved').length;
  const rejected = (requests || []).filter((req) => req.status === 'rejected').length;

  return (
    <div className="animate-slide-up">
      <h2>Patient / Hospital Dashboard</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Monitor your blood requests and current blood availability.</p>

      <div className="dashboard-grid" style={{ marginTop: '1.5rem' }}>
        <div className="glass-card stat-card">
          <span className="stat-value">{pending}</span>
          <span className="stat-label">Pending Requests</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-value">{approved}</span>
          <span className="stat-label">Approved Requests</span>
        </div>
        <div className="glass-card stat-card">
          <span className="stat-value">{rejected}</span>
          <span className="stat-label">Rejected Requests</span>
        </div>
      </div>

      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
        <Database style={{ color: 'var(--primary)' }} />
        Inventory Stock Level Visualizer
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Current available blood supply by type.
      </p>

      <div className="blood-vial-grid">
        {BLOOD_TYPES.map((bt) => {
          const stock = (inventory || []).find((i) => i.blood_type === bt)?.units_available || 0;
          const percent = Math.min(100, (stock / 20) * 100);
          return (
            <div className="blood-vial-card" key={bt}>
              <div className="vial-fill-container">
                <div className="vial-fill" style={{ height: `${percent}%` }} />
                <span className="vial-bubble">{bt}</span>
              </div>
              <span className="vial-type">{bt}</span>
              <span className="vial-count">{stock} Units</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
