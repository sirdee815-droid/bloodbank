import React, { useState } from 'react';

const initialForm = {
  fullName: '',
  bloodType: 'O+',
  email: '',
  phoneNo: '',
  address: '',
  lastDonationDate: '',
};

export default function AddDonor({ onAddDonor }) {
  const [donorForm, setDonorForm] = useState(initialForm);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onAddDonor(donorForm);
    if (success) {
      setDonorForm(initialForm);
    }
  };

  return (
    <div className="glass-card animate-slide-up">
      <h2>Add New Donor</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div className="form-row">
          <div>
            <label className="form-label">Full Name</label>
            <input
              className="form-control"
              value={donorForm.fullName}
              onChange={(e) => setDonorForm((prev) => ({ ...prev, fullName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="form-label">Blood Type</label>
            <select
              className="form-control"
              value={donorForm.bloodType}
              onChange={(e) => setDonorForm((prev) => ({ ...prev, bloodType: e.target.value }))}
            >
              {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((bt) => (
                <option key={bt} value={bt}>{bt}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row" style={{ marginTop: '1rem' }}>
          <div>
            <label className="form-label">Email</label>
            <input
              className="form-control"
              type="email"
              value={donorForm.email}
              onChange={(e) => setDonorForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="form-label">Phone</label>
            <input
              className="form-control"
              value={donorForm.phoneNo}
              onChange={(e) => setDonorForm((prev) => ({ ...prev, phoneNo: e.target.value }))}
              required
            />
          </div>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <label className="form-label">Address</label>
          <input
            className="form-control"
            value={donorForm.address}
            onChange={(e) => setDonorForm((prev) => ({ ...prev, address: e.target.value }))}
            required
          />
        </div>

        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" type="submit">Register Donor</button>
        </div>
      </form>
    </div>
  );
}
