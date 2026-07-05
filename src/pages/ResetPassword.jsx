import React, { useState } from 'react';
import { Heart, AlertTriangle } from 'lucide-react';

export default function ResetPassword({ authError, onUpdatePassword }) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [localError, setLocalError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError(null);

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setLocalError('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    await onUpdatePassword(password);
    setSubmitting(false);
  };

  const errorText = localError || authError;

  return (
    <div className="auth-wrapper">
      <div className="glass-card auth-card animate-slide-up">
        <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
          <Heart className="logo-icon fill-current" />
          <span className="logo-text">REDLIFE BBMS</span>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '0.75rem', fontFamily: 'var(--font-display)' }}>
          Set a New Password
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Choose a new password for your account.
        </p>

        {errorText && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--danger)', color: '#f87171', padding: '0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'left' }}>
            <AlertTriangle style={{ display: 'inline', marginRight: '0.5rem', width: '1rem', height: '1rem', verticalAlign: 'middle' }} />
            {errorText}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }} disabled={submitting}>
            {submitting ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
