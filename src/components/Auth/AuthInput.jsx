import React from 'react';
import { Check, AlertCircle } from 'lucide-react';
import './LoginModal.css';

export default function AuthInput({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  isValid = false,
  error = '',
  touched = false,
  inputRef,
  required = true,
}) {
  const hasError = Boolean((touched && error) || error);
  const showValid = Boolean(value && isValid && !hasError);

  return (
    <div className={`login-form-group ${hasError ? 'has-error' : ''}`}>
      {label && <label className="login-form-label">{label}</label>}

      <div className="login-input-wrap">
        <input
          ref={inputRef}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className="login-input-field"
          required={required}
        />

        {showValid && (
          <span className="login-input-status-icon valid">
            <Check size={16} strokeWidth={2.5} />
          </span>
        )}

        {hasError && (
          <span className="login-input-status-icon invalid">
            <AlertCircle size={16} strokeWidth={2.5} />
          </span>
        )}
      </div>

      {hasError && (
        <span className="login-field-error-text">{error}</span>
      )}
    </div>
  );
}
