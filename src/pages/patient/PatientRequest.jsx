import React, { useState } from 'react';

export default function PatientRequest({ onRequestSubmit }) {
  const [form, setForm] = useState({
    patientName: '',
    hospitalName: '',
    bloodType: 'A+',
    unitsRequested: 1,
    urgency: 'normal',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onRequestSubmit(form);
    if (success) {
      setForm({ patientName: '', hospitalName: '', bloodType: 'A+', unitsRequested: 1, urgency: 'normal' });
    }
  };

  return (
    <div className="glass-card animate-slide-up">
      <h2>Blood Request</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Request blood units for your patient or hospital emergency.</p>

      <form style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }} onSubmit={handleSubmit}>
        <div className="form-row">
          <div>
            <label className="form-label">Patient Name</label>
            <input
              className="form-control"
              value={form.patientName}
              onChange={(e) => setForm((prev) => ({ ...prev, patientName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="form-label">Hospital / Facility</label>
            <input
              className="form-control"
              value={form.hospitalName}
              onChange={(e) => setForm((prev) => ({ ...prev, hospitalName: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label className="form-label">Blood Type</label>
            <select
              className="form-control"
              value={form.bloodType}
              onChange={(e) => setForm((prev) => ({ ...prev, bloodType: e.target.value }))}
            >
              {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="form-label">Units Requested</label>
            <input
              className="form-control"
              type="number"
              min="1"
              value={form.unitsRequested}
              onChange={(e) => setForm((prev) => ({ ...prev, unitsRequested: Number(e.target.value) }))}
              required
            />
          </div>
        </div>

        <div>
          <label className="form-label">Urgency</label>
          <select
            className="form-control"
            value={form.urgency}
            onChange={(e) => setForm((prev) => ({ ...prev, urgency: e.target.value }))}
          >
            {['normal', 'urgent', 'critical'].map((level) => (
              <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
            ))}
          </select>
        </div>

        <button className="btn btn-primary" type="submit">Submit Request</button>
      </form>
    </div>
  );
}
