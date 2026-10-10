import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

export default function ProfileInputField({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  disabled = false,
  readOnly = false,
  error = '',
  touched = false,
  warning = '',
  helperText = '',
}) {
  const hasError = Boolean(touched && error);
  const isValid = Boolean(value && !hasError && !disabled && touched);

  return (
    <div className={`profile-form-group ${hasError ? 'has-error' : ''}`}>
      {label && <label className="profile-form-label">{label}</label>}

      <div className="profile-input-wrap">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          readOnly={readOnly}
          className={`profile-input-field ${disabled ? 'disabled' : ''} ${type === 'date' ? 'date-field' : ''}`}
        />

        {isValid && (
          <span className={`profile-input-status valid ${type === 'date' ? 'date-status' : ''}`}>
            <Check size={16} strokeWidth={2.5} />
          </span>
        )}
        {hasError && (
          <span className={`profile-input-status invalid ${type === 'date' ? 'date-status' : ''}`}>
            <AlertCircle size={16} strokeWidth={2.5} />
          </span>
        )}
      </div>

      {hasError ? (
        <span className="profile-field-error">{error}</span>
      ) : warning ? (
        <span className="profile-field-warning">{warning}</span>
      ) : helperText ? (
        <span className="profile-field-helper">{helperText}</span>
      ) : null}
    </div>
  );
}
