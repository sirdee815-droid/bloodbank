import React, { useState } from 'react';

export default function DonationAppointment() {
  const [form, setForm] = useState({ donationCenter: '', date: '', notes: '' });

  return (
    <div className="glass-card animate-slide-up">
      <h2>Donation Appointment</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Schedule your next blood donation and choose a convenient center.</p>

      <form
        style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}
        onSubmit={(event) => event.preventDefault()}
      >
        <div>
          <label className="form-label">Donation Center</label>
          <input
            className="form-control"
            value={form.donationCenter}
            onChange={(e) => setForm((prev) => ({ ...prev, donationCenter: e.target.value }))}
            placeholder="Enter donation center"
          />
        </div>
        <div>
          <label className="form-label">Donation Date</label>
          <input
            className="form-control"
            type="date"
            value={form.date}
            onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          />
        </div>
        <div>
          <label className="form-label">Notes</label>
          <textarea
            className="form-control"
            rows="3"
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            placeholder="Any additional details"
          />
        </div>
        <button
          className="btn btn-primary"
          type="button"
          onClick={() => alert('Appointment saved in the demo only.')}
        >
          Schedule Appointment
        </button>
      </form>
    </div>
  );
}
