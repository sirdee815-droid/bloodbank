import React, { useState } from 'react';

const BLOOD_TYPES = ['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export default function Donors({ donors }) {
  const [search, setSearch] = useState('');
  const [bloodFilter, setBloodFilter] = useState('All');

  const filteredDonors = (donors || []).filter((donor) => {
    const searchMatch =
      donor.full_name.toLowerCase().includes(search.toLowerCase()) ||
      donor.email.toLowerCase().includes(search.toLowerCase());
    const typeMatch = bloodFilter === 'All' || donor.blood_type === bloodFilter;
    return searchMatch && typeMatch;
  });

  return (
    <div className="glass-card animate-slide-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Registered Blood Donors</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Search and filter the current donor registry.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="search"
            value={search}
            placeholder="Search by name or email"
            onChange={(e) => setSearch(e.target.value)}
            className="form-control"
            style={{ minWidth: '220px' }}
          />
          <select value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)} className="form-control">
            {BLOOD_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-container" style={{ marginTop: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Blood Type</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Last Donation</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonors.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No donors match your search.
                </td>
              </tr>
            ) : (
              filteredDonors.map((donor) => (
                <tr key={donor.id}>
                  <td>{donor.full_name}</td>
                  <td>{donor.blood_type}</td>
                  <td>{donor.phone_no}</td>
                  <td>{donor.email}</td>
                  <td>{donor.last_donation_date || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
