import React, { useState } from 'react';

const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function ManageDonors({ donors }) {
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
      <h2>Manage Donors</h2>
      <p style={{ color: 'var(--text-secondary)' }}>View, filter, and maintain donor records.</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1rem' }}>
        <input
          className="form-control"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ minWidth: '220px' }}
        />
        <select className="form-control" value={bloodFilter} onChange={(e) => setBloodFilter(e.target.value)}>
          {['All', ...BLOOD_GROUP_OPTIONS].map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
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
                <td colSpan="5" style={{ textAlign: 'center', padding: '1.25rem', color: 'var(--text-secondary)' }}>
                  No donor records found.
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
