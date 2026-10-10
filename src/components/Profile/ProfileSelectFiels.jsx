import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function ProfileSelectField({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'e.g. Text',
}) {
  return (
    <div className="profile-form-group">
      {label && <label className="profile-form-label">{label}</label>}
      <div className="profile-select-wrap">
        <select
          value={value}
          onChange={onChange}
          className="profile-select-field"
        >
          <option value="" disabled hidden>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name} {opt.city ? `(${opt.city})` : ''}
            </option>
          ))}
        </select>
        <ChevronDown size={18} className="profile-select-icon" />
      </div>
    </div>
  );
}
