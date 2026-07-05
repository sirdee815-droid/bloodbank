import React, { useState } from 'react';

export default function UserManagement({ user }) {
  const [passwordResetEmail, setPasswordResetEmail] = useState('');

  const handleReset = () => {
    if (!passwordResetEmail) return;
    alert(`Password reset requested for ${passwordResetEmail}.`);
    setPasswordResetEmail('');
  };

  return (
    <div className="glass-card animate-slide-up">
      <h2>User Management</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Manage system users, roles, and access from a single administration panel.</p>

      <div style={{ display: 'grid', gap: '1.25rem', marginTop: '1.5rem' }}>
        <div className="glass-card" style={{ padding: '1rem' }}>
          <h3>Current User</h3>
          <p><strong>{user?.user_metadata?.full_name || user?.email}</strong></p>
          <p>Role: <strong>{user?.user_metadata?.role || 'unknown'}</strong></p>
        </div>

        <div className="glass-card" style={{ padding: '1rem' }}>
          <h3>Reset Password</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <input
              className="form-control"
              placeholder="User email"
              value={passwordResetEmail}
              onChange={(e) => setPasswordResetEmail(e.target.value)}
              style={{ minWidth: '220px' }}
            />
            <button className="btn btn-primary" type="button" onClick={handleReset}>
              Send Reset Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
