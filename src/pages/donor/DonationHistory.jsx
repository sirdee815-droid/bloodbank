import React from 'react';

export default function DonationHistory({ donorDonations }) {
  return (
    <div className="glass-card animate-slide-up">
      <h2>Donation History</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Review your past donations including blood type and volumes.</p>

      <div className="table-container" style={{ marginTop: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Volume</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {(donorDonations || []).length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '1.25rem', color: 'var(--text-secondary)' }}>
                  No donations have been recorded.
                </td>
              </tr>
            ) : (
              donorDonations.map((donation) => (
                <tr key={donation.id}>
                  <td>{new Date(donation.collected_at).toLocaleDateString()}</td>
                  <td>{donation.blood_type}</td>
                  <td>{donation.volume_ml} ml</td>
                  <td>{donation.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
