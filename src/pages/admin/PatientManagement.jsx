import React, { useMemo } from 'react';

export default function PatientManagement({ requests }) {
  const patientRecords = useMemo(() => {
    const unique = new Map();
    (requests || []).forEach((request) => {
      const key = request.patient_name || request.hospital_name || request.id;
      if (!unique.has(key)) {
        unique.set(key, {
          patient: request.patient_name,
          hospital: request.hospital_name,
          lastRequest: request.created_at,
          status: request.status,
          type: request.blood_type,
        });
      }
    });
    return Array.from(unique.values());
  }, [requests]);

  return (
    <div className="glass-card animate-slide-up">
      <h2>Patient / Hospital Management</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Track requests, patient data, and transfusion history in one place.</p>

      <div className="table-container" style={{ marginTop: '1.5rem' }}>
        <table className="custom-table">
          <thead>
            <tr>
              <th>Patient / Hospital</th>
              <th>Blood Type</th>
              <th>Last Request</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {patientRecords.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '1.25rem', color: 'var(--text-secondary)' }}>
                  No patient or hospital records available yet.
                </td>
              </tr>
            ) : (
              patientRecords.map((record, index) => (
                <tr key={`${record.patient}-${index}`}>
                  <td>{record.patient ? `${record.patient} / ${record.hospital}` : record.hospital}</td>
                  <td>{record.type}</td>
                  <td>{new Date(record.lastRequest).toLocaleDateString()}</td>
                  <td>{record.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
