import React, { useState } from 'react';

export default function PatientProfile({ user }) {
  const [form, setForm] = useState({
    fullName: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    contact: '',
  });

  return (
    <div className="glass-card animate-slide-up">
      <h2>Patient Profile</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Update your contact details and patient profile information.</p>

      <form
        style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}
        onSubmit={(event) => event.preventDefault()}
      >
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
            <label className="form-label">Email</label>
            <input className="form-control" type="email" value={form.email} disabled />
          </div>
        </div>

        <div>
          <label className="form-label">Contact Number</label>
          <input
            className="form-control"
            value={form.contact}
            onChange={(e) => setForm((prev) => ({ ...prev, contact: e.target.value }))}
            placeholder="Enter phone number"
          />
        </div>

        <button
          className="btn btn-primary"
          type="button"
          onClick={() => alert('Profile saved in the demo.')}
        >
          Save Profile
        </button>
      </form>
    </div>
  );
}
