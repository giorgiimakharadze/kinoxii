import React, { useState, useEffect, useRef } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { authApi } from '../../services/api';
import './LoginModal.css';


function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


export default function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSuccess,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

  const modalRef = useRef(null);
  const emailInputRef = useRef(null);

  // focus email on open, reset passwork and errors
  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setServerError('');
      setTouched({ email: false, password: false });
      setTimeout(() => emailInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // close when clicked outside
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const handleMouseDown = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  const emailValid = isValidEmail(email);
  const passwordValid = password.length >= 3;
  const isFormValid = emailValid && passwordValid;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!isFormValid || loading) return;
    try {
      setLoading(true);
      setServerError('');
      const res = await authApi.login({ email, password });

      // on success pass user and token to context
      onSuccess(res?.data?.user, res?.data?.token);
    } catch (err) {
      // keep email, show error message returned from API
      setServerError(err?.data?.message || err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='login-modal-overlay'>
      <div className='login-modal-card'
        ref={modalRef}
        role='dialog'
        aria-modal="true"
      >
        {/* close button */}
        <button
          type="button"
          className="login-modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>


        {/* header */}
        <div className="login-modal-header">
          <h2 className="login-modal-title">Log in</h2>
          <p className="login-modal-subtitle">Welcome back to Kino XII</p>
        </div>


        {/* form */}
        <form className='login-modal-form' onSubmit={handleSubmit} noValidate>
          {/* server error message */}
          {serverError && (
            <div className="login-server-error-banner">
              <AlertCircle size={15} />
              <span>{serverError}</span>
            </div>
          )}

          {/* email field */}
          <div className='login-form-group'>
            <label className='login-form-label'>
              Email
            </label>
            <div className={`login-input-wrap ${touched.email && !emailValid && email ? 'has-error' : ''}`}>
              <input
                ref={emailInputRef}
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setServerError('');
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                className="login-input-field"
                required
              />
              {email && emailValid && (
                <span className="login-input-status-icon valid">
                  <Check size={16} strokeWidth={2.5} />
                </span>
              )}
            </div>
          </div>
          {/* password field */}
          <div className={`login-form-group ${touched.password && !passwordValid && password ? 'has-error' : ''}`}>
            <label className='login-form-label'>Password</label>
            <div className='login-input-wrap'>
              <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setServerError('');
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                className="login-input-field"
                required
              />
              {password && passwordValid && (
                <span className="login-input-status-icon valid">
                  <Check size={16} strokeWidth={2.5} />
                </span>
              )}
              {touched.password && !passwordValid && password && (
                <span className="login-input-status-icon invalid">
                  <AlertCircle size={16} strokeWidth={2.5} />
                </span>
              )}
            </div>
            {touched.password && !passwordValid && password && (
              <span className="login-field-error-text">At least 3 characters</span>
            )}
          </div>

          {/* submit button */}
          <button
            type="submit"
            className={`login-submit-btn ${isFormValid ? 'ready' : ''}`}
            disabled={loading || !isFormValid}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* footer */}
        <div className='login-modal-footer'>
          <span className='login-modal-text'>
            Don't have an account?{' '}
            <button
              type="button"
              className="login-switch-btn"
              onClick={onSwitchToRegister}
            >
              Sign up
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}