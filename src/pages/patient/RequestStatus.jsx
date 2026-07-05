import React from 'react';

export default function RequestStatus({ requests }) {
  const patientRequests = requests || [];

  return (
    <div className="glass-card animate-slide-up">
      <h2>Request Status</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Monitor the approval progress for your blood requests.</p>

      <div className="table-container" style={{ marginTop: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Hospital</th>
              <th>Blood Type</th>
              <th>Units</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {patientRequests.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '1.25rem', color: 'var(--text-secondary)' }}>
                  No requests have been submitted yet.
                </td>
              </tr>
            ) : (
              patientRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.patient_name}</td>
                  <td>{request.hospital_name}</td>
                  <td>{request.blood_type}</td>
                  <td>{request.units_requested}</td>
                  <td>{request.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
