import React, { useState } from 'react';

const BLOOD_TYPES = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
const URGENCY_OPTIONS = ['normal', 'urgent', 'critical'];

export default function Requests({ requests, onRequestSubmit, onFulfillRequest, onRejectRequest }) {
  const [requestForm, setRequestForm] = useState({
    hospitalName: '',
    patientName: '',
    bloodType: 'A+',
    unitsRequested: 1,
    urgency: 'normal',
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const success = await onRequestSubmit(requestForm);
    if (success) {
      setRequestForm({ hospitalName: '', patientName: '', bloodType: 'A+', unitsRequested: 1, urgency: 'normal' });
    }
  };

  return (
    <div className="animate-slide-up" style={{ display: 'grid', gap: '1.5rem' }}>
      <div className="glass-card">
        <h2>Blood Requests</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
          <div className="form-row">
            <div>
              <label className="form-label">Hospital Name</label>
              <input
                className="form-control"
                value={requestForm.hospitalName}
                onChange={(e) => setRequestForm((prev) => ({ ...prev, hospitalName: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="form-label">Patient Name</label>
              <input
                className="form-control"
                value={requestForm.patientName}
                onChange={(e) => setRequestForm((prev) => ({ ...prev, patientName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div>
              <label className="form-label">Blood Type</label>
              <select
                className="form-control"
                value={requestForm.bloodType}
                onChange={(e) => setRequestForm((prev) => ({ ...prev, bloodType: e.target.value }))}
              >
                {BLOOD_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Units Requested</label>
              <input
                type="number"
                min="1"
                className="form-control"
                value={requestForm.unitsRequested}
                onChange={(e) => setRequestForm((prev) => ({ ...prev, unitsRequested: Number(e.target.value) }))}
                required
              />
            </div>
          </div>

          <div>
            <label className="form-label">Urgency</label>
            <select
              className="form-control"
              value={requestForm.urgency}
              onChange={(e) => setRequestForm((prev) => ({ ...prev, urgency: e.target.value }))}
            >
              {URGENCY_OPTIONS.map((level) => (
                <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-primary" type="submit">Submit Request</button>
          </div>
        </form>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1rem' }}>Current Requests</h3>
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Hospital</th>
                <th>Patient</th>
                <th>Blood Type</th>
                <th>Units</th>
                <th>Urgency</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(requests || []).length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No requests have been submitted yet.
                  </td>
                </tr>
              ) : (
                (requests || []).map((request) => (
                  <tr key={request.id}>
                    <td>{request.hospital_name}</td>
                    <td>{request.patient_name}</td>
                    <td>{request.blood_type}</td>
                    <td>{request.units_requested}</td>
                    <td>{request.urgency}</td>
                    <td>{request.status}</td>
                    <td>
                      {request.status === 'pending' ? (
                        <>
                          <button className="btn btn-primary" onClick={() => onFulfillRequest(request)} style={{ marginRight: '0.5rem' }}>
                            Fulfill
                          </button>
                          <button className="btn btn-secondary" onClick={() => onRejectRequest(request.id)}>
                            Reject
                          </button>
                        </>
                      ) : (
                        <span style={{ color: 'var(--text-secondary)' }}>No actions</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
