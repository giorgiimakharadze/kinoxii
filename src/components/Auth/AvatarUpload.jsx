import React, { useRef } from 'react';
import { Upload } from 'lucide-react';
import './RegisterModal.css';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_SIZE = 2 * 1024 * 1024; // 2mb

export default function AvatarUpload({
  avatarPreview,
  onAvatarSelect,
  error,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      onAvatarSelect(null, null, 'Avatar must be JPG, PNG or WEBP');
      return;
    }

    if (file.size > MAX_SIZE) {
      onAvatarSelect(null, null, 'Avatar must not exceed 2 MB');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onAvatarSelect(file, previewUrl, '');
  };

  return (
    <div className="register-avatar-wrapper">
      <div
        className="register-avatar-upload-row"
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div className="register-avatar-icon-box">
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="register-avatar-img-preview" />
          ) : (
            <Upload size={18} className="register-upload-icon" />
          )}
        </div>

        <div className="register-avatar-text-col">
          <span className="register-avatar-title">Upload avatar (optional)</span>
          <span className="register-avatar-subtitle">JPG, PNG or WEBP</span>
        </div>
      </div>

      {error && <span className="login-field-error-text">{error}</span>}
    </div>
  );
}
