import React, { useState, useEffect, useRef } from 'react';
import { X, AlertCircle } from 'lucide-react';
import AuthInput from './AuthInput';
import AvatarUpload from './AvatarUpload';
import { authApi } from '../../services/api';
import './LoginModal.css';
import './RegisterModal.css';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSuccess,
}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [touched, setTouched] = useState({});
  const [avatarError, setAvatarError] = useState('');
  const [serverErrors, setServerErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const modalRef = useRef(null);
  const usernameInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setEmail('');
      setPassword('');
      setPasswordConfirmation('');
      setAvatarFile(null);
      setAvatarPreview(null);
      setAvatarError('');
      setServerErrors({});
      setTouched({});
      setTimeout(() => usernameInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

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


  const usernameValid = username.trim().length >= 3;
  const emailValid = isValidEmail(email);
  const passwordValid = password.length >= 3;
  const passwordsMatch = password.length >= 3 && password === passwordConfirmation;
  const isFormValid = usernameValid && emailValid && passwordValid && passwordsMatch && !avatarError;

  const handleAvatarSelect = (file, previewUrl, error) => {
    setAvatarFile(file);
    setAvatarPreview(previewUrl);
    setAvatarError(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      username: true,
      email: true,
      password: true,
      passwordConfirmation: true,
    });

    if (!isFormValid || loading) return;

    try {
      setLoading(true);
      setServerErrors({});

      const formData = new FormData();
      formData.append('username', username.trim());
      formData.append('email', email.trim());
      formData.append('password', password);
      formData.append('password_confirmation', passwordConfirmation);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await authApi.register(formData);
      onSuccess(res?.data?.user, res?.data?.token);
      onClose?.();
    } catch (err) {
      if (err.data?.errors) {
        setServerErrors(err.data.errors);
      } else {
        setServerErrors({ general: [err.message || 'Registration failed'] });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-card register-modal-card" ref={modalRef} role="dialog" aria-modal="true">
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
          <h2 className="login-modal-title">Sign up</h2>
          <p className="login-modal-subtitle">Welcome to Kino XII</p>
        </div>

        {/* form */}
        <form className="login-modal-form" onSubmit={handleSubmit} noValidate>
          {serverErrors.general && (
            <div className="login-server-error-banner">
              <AlertCircle size={15} />
              <span>{serverErrors.general[0]}</span>
            </div>
          )}

          {/* avatar upload */}
          <AvatarUpload
            avatarPreview={avatarPreview}
            onAvatarSelect={handleAvatarSelect}
            error={avatarError || serverErrors.avatar?.[0]}
          />

          {/* username */}
          <AuthInput
            inputRef={usernameInputRef}
            label="Username"
            placeholder="User"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setServerErrors((prev) => ({ ...prev, username: null }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, username: true }))}
            isValid={usernameValid}
            touched={touched.username}
            error={
              serverErrors.username?.[0] ||
              (touched.username && !usernameValid ? 'At least 3 characters' : '')
            }
          />

          {/* email */}
          <AuthInput
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setServerErrors((prev) => ({ ...prev, email: null }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
            isValid={emailValid}
            touched={touched.email}
            error={
              serverErrors.email?.[0] ||
              (touched.email && !emailValid && email ? 'Invalid email format' : '')
            }
          />

          {/* password and confirm password */}
          <div className="register-passwords-row">
            <div className="flex-1">
              <AuthInput
                label="password"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setServerErrors((prev) => ({ ...prev, password: null }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                isValid={passwordValid}
                touched={touched.password}
                error={
                  serverErrors.password?.[0] ||
                  (touched.password && !passwordValid ? 'At least 3 characters' : '')
                }
              />
            </div>

            <div className="flex-1">
              <AuthInput
                label="Confirm password"
                type="password"
                placeholder="••••••••"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, passwordConfirmation: true }))}
                isValid={passwordsMatch}
                touched={touched.passwordConfirmation}
                error={
                  touched.passwordConfirmation && !passwordsMatch ? 'Passwords do not match' : ''
                }
              />
            </div>
          </div>

          {/* submit */}
          <button
            type="submit"
            className={`login-submit-btn ${isFormValid ? 'ready' : ''}`}
            disabled={loading || !isFormValid}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>

        {/* footer*/}
        <div className="login-modal-footer">
          <span className="login-footer-text">
            Already have an account?{' '}
            <button
              type="button"
              className="login-switch-btn"
              onClick={onSwitchToLogin}
            >
              Log in
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
