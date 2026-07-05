import React, { useState } from 'react';
import { Heart, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Login({ authError, onLogin, onSignUp, onForgotPassword }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'reset'
  const [selectedRole, setSelectedRole] = useState('donor');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const isSignUp = mode === 'signup';
  const isReset = mode === 'reset';

  const switchMode = (next) => {
    setMode(next);
    setResetSent(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isReset) {
      const ok = await onForgotPassword(email);
      if (ok) setResetSent(true);
      return;
    }
    if (isSignUp) {
      await onSignUp({ fullName, email, password, selectedRole });
    } else {
      await onLogin({ email, password });
    }
  };

  const heading = isSignUp
    ? 'Create Blood Bank Account'
    : isReset
      ? 'Reset Your Password'
      : 'Staff & Donor Secure Login';

  const submitLabel = isSignUp ? 'Create Account' : isReset ? 'Send Reset Link' : 'Sign In';

  const linkButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--primary)',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'underline',
    fontSize: '0.9rem',
  };

  return (
    <div className="auth-wrapper">
      <div className="glass-card auth-card animate-slide-up">
        <div className="logo-container" style={{ justifyContent: 'center', marginBottom: '2rem' }}>
          <Heart className="logo-icon fill-current" />
          <span className="logo-text">REDLIFE BBMS</span>
        </div>

        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', fontFamily: 'var(--font-display)' }}>
          {heading}
        </h2>

        {authError && (
          <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid var(--danger)', color: '#f87171', padding: '0.8rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'left' }}>
            <AlertTriangle style={{ display: 'inline', marginRight: '0.5rem', width: '1rem', height: '1rem', verticalAlign: 'middle' }} />
            {authError}
          </div>
        )}

        {isReset && resetSent ? (
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid var(--success)', color: '#34d399', padding: '0.9rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'left' }}>
            <CheckCircle style={{ display: 'inline', marginRight: '0.5rem', width: '1rem', height: '1rem', verticalAlign: 'middle' }} />
            If an account exists for <strong>{email}</strong>, a password reset link has been sent. Check your inbox.
          </div>
        ) : (
          <>
            {isReset && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                Enter your account email and we'll send you a link to reset your password.
              </p>
            )}

            {isSignUp && (
              <div className="role-selector" style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
                {['donor', 'patient'].map((role) => (
                  <button
                    key={role}
                    type="button"
                    className={`btn btn-secondary ${selectedRole === role ? 'active' : ''}`}
                    style={{ padding: '0.75rem 1rem', minWidth: '100px' }}
                    onClick={() => setSelectedRole(role)}
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {isSignUp && (
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Jane Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {!isReset && (
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}>
                {submitLabel}
              </button>
            </form>
          </>
        )}

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {mode === 'signin' && (
            <>
              <button type="button" style={linkButtonStyle} onClick={() => switchMode('reset')}>
                Forgot password?
              </button>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Need a donor account? </span>
                <button type="button" style={linkButtonStyle} onClick={() => switchMode('signup')}>
                  Register
                </button>
              </div>
            </>
          )}

          {mode === 'signup' && (
            <div>
              <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
              <button type="button" style={linkButtonStyle} onClick={() => switchMode('signin')}>
                Sign in
              </button>
            </div>
          )}

          {mode === 'reset' && (
            <button type="button" style={linkButtonStyle} onClick={() => switchMode('signin')}>
              &larr; Back to sign in
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
