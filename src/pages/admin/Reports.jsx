import React from 'react';

export default function Reports({ donors, inventory, requests }) {
  const totalDonors = (donors || []).length;
  const totalUnits = (inventory || []).reduce((sum, item) => sum + (item.units_available || 0), 0);
  const pendingRequests = (requests || []).filter((req) => req.status === 'pending').length;
  const fulfilledRequests = (requests || []).filter((req) => req.status === 'fulfilled').length;

  return (
    <div className="glass-card animate-slide-up">
      <h2>Reports</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Generate fast operational reports for donations, inventory, requests, and donor activity.</p>

      <div className="dashboard-grid" style={{ marginTop: '1.5rem' }}>
        <div className="glass-card stat-card">
          <div className="stat-info">
            <span className="stat-value">{totalDonors}</span>
            <span className="stat-label">Total Donors</span>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-info">
            <span className="stat-value">{totalUnits} Units</span>
            <span className="stat-label">Inventory Stock</span>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-info">
            <span className="stat-value">{pendingRequests}</span>
            <span className="stat-label">Pending Requests</span>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-info">
            <span className="stat-value">{fulfilledRequests}</span>
            <span className="stat-label">Fulfilled Requests</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3>Key Insights</h3>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-primary)' }}>
          <li>{totalDonors} donors are currently registered.</li>
          <li>{totalUnits} blood units are available across all groups.</li>
          <li>{pendingRequests} requests are still waiting for approval.</li>
        </ul>
      </div>
    </div>
  );
}
