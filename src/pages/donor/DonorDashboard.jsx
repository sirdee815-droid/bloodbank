import React from 'react';

export default function DonorDashboard({ donorRecord, donorDonations }) {
  return (
    <div className="animate-slide-up">
      <h2>Donor Dashboard</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Track your donation history, upcoming appointments, and notifications.</p>

      <div className="dashboard-grid" style={{ marginTop: '1.5rem' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Profile Snapshot</h3>
          <p><strong>{donorRecord?.full_name || 'Donor'}</strong></p>
          <p style={{ color: 'var(--text-secondary)' }}>Blood Group: {donorRecord?.blood_type || '—'}</p>
          <p style={{ color: 'var(--text-secondary)' }}>
            Last Donation: {donorRecord?.last_donation_date || 'No recorded donation'}
          </p>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '1rem' }}>Donation History</h3>
          {(donorDonations || []).length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>You have no recorded donations yet.</p>
          ) : (
            <ul style={{ listStyle: 'none', paddingLeft: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {donorDonations.map((donation) => (
                <li key={donation.id} style={{ fontSize: '0.9rem' }}>
                  {new Date(donation.collected_at).toLocaleDateString()} — {donation.blood_type} — {donation.volume_ml} ml — {donation.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
