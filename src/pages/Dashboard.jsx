import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, FileText, ShieldAlert, Database } from 'lucide-react';

export default function Dashboard({ donors, donations, inventory, requests, isAdmin, onAdjustInventory, isLoading }) {
  const totalDonors = donors.length;
  const totalStock = inventory.reduce((acc, curr) => acc + (curr.units_available || 0), 0);
  const pendingRequests = requests.filter((r) => r.status === 'pending').length;
  const criticalRequestsCount = requests.filter((r) => r.status === 'pending' && r.urgency === 'critical').length;

  return (
    <div className="animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem', flexWrap: 'wrap' }}>
        <div>
          <h1>Clinical Blood Bank Analytics</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome back.</p>
        </div>
        {isAdmin && (
          <Link to="/donors" className="btn btn-primary">
            View Donor Registry
          </Link>
        )}
      </div>

      {isLoading ? (
        <div className="glass-card">Loading dashboard data…</div>
      ) : (
        <>
          <div className="dashboard-grid">
            <div className="glass-card stat-card">
              <div className="stat-icon">
                <Users style={{ width: '1.8rem', height: '1.8rem' }} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{totalDonors}</span>
                <span className="stat-label">Registered Donors</span>
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-icon" style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
                <Activity style={{ width: '1.8rem', height: '1.8rem' }} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{totalStock} Units</span>
                <span className="stat-label">Total Blood Reserve</span>
              </div>
            </div>

            <div className="glass-card stat-card">
              <div className="stat-icon" style={{ color: '#f59e0b', background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                <FileText style={{ width: '1.8rem', height: '1.8rem' }} />
              </div>
              <div className="stat-info">
                <span className="stat-value">{pendingRequests}</span>
                <span className="stat-label">Pending Requests</span>
              </div>
            </div>

            {criticalRequestsCount > 0 && (
              <div className="glass-card stat-card" style={{ border: '1px solid rgba(239, 68, 68, 0.3)', background: 'rgba(239, 68, 68, 0.08)' }}>
                <div className="stat-icon" style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.25)' }}>
                  <ShieldAlert style={{ width: '1.8rem', height: '1.8rem' }} />
                </div>
                <div className="stat-info">
                  <span className="stat-value" style={{ color: '#ef4444' }}>{criticalRequestsCount} Urgent</span>
                  <span className="stat-label" style={{ color: '#f87171' }}>Critical Dispatches Needed</span>
                </div>
              </div>
            )}
          </div>

          <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Database style={{ color: 'var(--primary)' }} />
            Inventory Stock Level Visualizer
          </h2>

          <div className="blood-vial-grid">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => {
              const stock = inventory.find((i) => i.blood_type === bt)?.units_available || 0;
              const percent = Math.min(100, (stock / 20) * 100);
              return (
                <div className="blood-vial-card" key={bt}>
                  <div className="vial-fill-container">
                    <div className="vial-fill" style={{ height: `${percent}%` }} />
                    <span className="vial-bubble">{bt}</span>
                  </div>
                  <span className="vial-type">{bt}</span>
                  <span className="vial-count">{stock} Units</span>

                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.75rem' }}>
                      <button onClick={() => onAdjustInventory(bt, -1)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>-</button>
                      <button onClick={() => onAdjustInventory(bt, 1)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>+</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="dashboard-grid" style={{ marginTop: '2.5rem', marginBottom: 0 }}>
            <div className="glass-card">
              <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Recent Blood Donations</h3>
              {donations.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No donations logged yet.</p>
              ) : (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {donations.slice(-5).reverse().map((don) => {
                    const donor = donors.find((d) => d.id === don.donor_id);
                    return (
                      <li key={don.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                        <div style={{ textAlign: 'left' }}>
                          <strong style={{ color: 'var(--text-primary)' }}>{donor?.full_name || 'Anonymous Donor'}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {new Date(don.collected_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span className="badge badge-normal" style={{ fontSize: '0.7rem' }}>{don.volume_ml}ml</span>
                          <span className="badge badge-critical" style={{ fontSize: '0.7rem' }}>{don.blood_type}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="glass-card">
              <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Active Hospital Dispatches</h3>
              {requests.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No pending requests.</p>
              ) : (
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {requests.slice(-5).reverse().map((req) => (
                    <li key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                      <div style={{ textAlign: 'left' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{req.hospital_name}</strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Patient: {req.patient_name} ({req.units_requested} Unit)
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className={`badge badge-${req.urgency}`} style={{ fontSize: '0.7rem' }}>{req.urgency}</span>
                        <span className={`badge badge-${req.status}`} style={{ fontSize: '0.7rem' }}>{req.status}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
