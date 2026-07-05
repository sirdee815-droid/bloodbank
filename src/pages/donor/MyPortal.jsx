import React from 'react';

export default function MyPortal({ donorRecord, donorDonations }) {
  return (
    <div className="glass-card animate-slide-up">
      <h2>My Donor Portal</h2>
      {donorRecord ? (
        <div>
          <p><strong>Name:</strong> {donorRecord.full_name}</p>
          <p><strong>Blood Type:</strong> {donorRecord.blood_type}</p>
          <p><strong>Last Donation:</strong> {donorRecord.last_donation_date || '—'}</p>

          <h3 style={{ marginTop: '1rem' }}>My Donations</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {(donorDonations || []).length === 0 ? (
              <li>No donations recorded.</li>
            ) : (
              donorDonations.map((d) => (
                <li key={d.id}>{new Date(d.collected_at).toLocaleDateString()} — {d.volume_ml}ml — {d.status}</li>
              ))
            )}
          </ul>
        </div>
      ) : (
        <p>No donor record found for your account.</p>
      )}
    </div>
  );
}
