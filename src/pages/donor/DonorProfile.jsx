import React, { useState } from 'react';

export default function DonorProfile({ donorRecord }) {
  const [form, setForm] = useState({
    fullName: donorRecord?.full_name || '',
    bloodType: donorRecord?.blood_type || 'O+',
    phoneNo: donorRecord?.phone_no || '',
    email: donorRecord?.email || '',
  });

  return (
    <div className="glass-card animate-slide-up">
      <h2>Profile Management</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Update your personal information and contact details.</p>

      <form style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
        <div className="form-row">
          <div>
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              value={form.fullName}
              onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">Blood Type</label>
            <select
              className="form-control"
              value={form.bloodType}
              onChange={(e) => setForm((prev) => ({ ...prev, bloodType: e.target.value }))}
            >
              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div>
            <label className="form-label">Phone</label>
            <input
              className="form-control"
              value={form.phoneNo}
              onChange={(e) => setForm((prev) => ({ ...prev, phoneNo: e.target.value }))}
            />
          </div>
          <div>
            <label className="form-label">Email</label>
            <input className="form-control" type="email" value={form.email} disabled />
          </div>
        </div>

        <button
          className="btn btn-primary"
          type="button"
          onClick={() => alert('Profile updates are saved locally in the demo.')}
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
