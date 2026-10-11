import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

export default function CheckoutForm({
  formData,
  errors = {},
  touched = {},
  onChange,
  onBlur,
}) {
  const getFieldStatus = (name) => {
    const hasError = Boolean(touched[name] && errors[name]);
    const isValid = Boolean(formData[name] && !hasError);
    return { hasError, isValid };
  };

  const handleCardChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    let formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    onChange('cardNumber', formatted);
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    onChange('expiry', raw);
  };

  const handleCvvChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 3);
    onChange('cvv', raw);
  };

  const nameStatus = getFieldStatus('fullName');
  const emailStatus = getFieldStatus('email');
  const mobileStatus = getFieldStatus('mobileNumber');
  const cardStatus = getFieldStatus('cardNumber');
  const expiryStatus = getFieldStatus('expiry');
  const cvvStatus = getFieldStatus('cvv');

  return (
    <div className="checkout-form-container">
      {/* full name */}
      <div className={`checkout-form-group full-width ${nameStatus.hasError ? 'has-error' : ''}`}>
        <label className="checkout-form-label">Full name</label>
        <div className="checkout-input-wrap">
          <input
            type="text"
            placeholder="e.g. Text"
            value={formData.fullName}
            onChange={(e) => onChange('fullName', e.target.value)}
            onBlur={() => onBlur('fullName')}
            className="checkout-input-field"
          />
          {nameStatus.isValid && <span className="checkout-input-status valid"><Check size={16} /></span>}
          {nameStatus.hasError && <span className="checkout-input-status invalid"><AlertCircle size={16} /></span>}
        </div>
        {nameStatus.hasError && <span className="checkout-field-error">{errors.fullName}</span>}
      </div>

      {/* email and mobile number row */}
      <div className="checkout-form-row">
        <div className={`checkout-form-group ${emailStatus.hasError ? 'has-error' : ''}`}>
          <label className="checkout-form-label">Email</label>
          <div className="checkout-input-wrap">
            <input
              type="email"
              placeholder="e.g. Text"
              value={formData.email}
              onChange={(e) => onChange('email', e.target.value)}
              onBlur={() => onBlur('email')}
              className="checkout-input-field"
            />
            {emailStatus.isValid && <span className="checkout-input-status valid"><Check size={16} /></span>}
            {emailStatus.hasError && <span className="checkout-input-status invalid"><AlertCircle size={16} /></span>}
          </div>
          {emailStatus.hasError && <span className="checkout-field-error">{errors.email}</span>}
        </div>

        <div className={`checkout-form-group ${mobileStatus.hasError ? 'has-error' : ''}`}>
          <label className="checkout-form-label">Mobile number</label>
          <div className="checkout-input-wrap">
            <input
              type="tel"
              placeholder="e.g. Text"
              value={formData.mobileNumber}
              onChange={(e) => onChange('mobileNumber', e.target.value)}
              onBlur={() => onBlur('mobileNumber')}
              className="checkout-input-field"
            />
            {mobileStatus.isValid && <span className="checkout-input-status valid"><Check size={16} /></span>}
            {mobileStatus.hasError && <span className="checkout-input-status invalid"><AlertCircle size={16} /></span>}
          </div>
          {mobileStatus.hasError && <span className="checkout-field-error">{errors.mobileNumber}</span>}
        </div>
      </div>

      {/* card number */}
      <div className={`checkout-form-group full-width ${cardStatus.hasError ? 'has-error' : ''}`}>
        <label className="checkout-form-label">Card number</label>
        <div className="checkout-input-wrap">
          <input
            type="text"
            placeholder="e.g. 1234 4567 8901 2345"
            value={formData.cardNumber}
            onChange={handleCardChange}
            onBlur={() => onBlur('cardNumber')}
            className="checkout-input-field"
          />
          {cardStatus.isValid && <span className="checkout-input-status valid"><Check size={16} /></span>}
          {cardStatus.hasError && <span className="checkout-input-status invalid"><AlertCircle size={16} /></span>}
        </div>
        {cardStatus.hasError && <span className="checkout-field-error">{errors.cardNumber}</span>}
      </div>

      {/* expiry and CVV row */}
      <div className="checkout-form-row">
        <div className={`checkout-form-group ${expiryStatus.hasError ? 'has-error' : ''}`}>
          <label className="checkout-form-label">Expiry</label>
          <div className="checkout-input-wrap">
            <input
              type="text"
              placeholder="e.g. 12/34"
              value={formData.expiry}
              onChange={handleExpiryChange}
              onBlur={() => onBlur('expiry')}
              className="checkout-input-field"
            />
            {expiryStatus.isValid && <span className="checkout-input-status valid"><Check size={16} /></span>}
            {expiryStatus.hasError && <span className="checkout-input-status invalid"><AlertCircle size={16} /></span>}
          </div>
          {expiryStatus.hasError && <span className="checkout-field-error">{errors.expiry}</span>}
        </div>

        <div className={`checkout-form-group ${cvvStatus.hasError ? 'has-error' : ''}`}>
          <label className="checkout-form-label">CVV</label>
          <div className="checkout-input-wrap">
            <input
              type="password"
              placeholder="e.g. 123"
              maxLength={3}
              value={formData.cvv}
              onChange={handleCvvChange}
              onBlur={() => onBlur('cvv')}
              className="checkout-input-field"
            />
            {cvvStatus.isValid && <span className="checkout-input-status valid"><Check size={16} /></span>}
            {cvvStatus.hasError && <span className="checkout-input-status invalid"><AlertCircle size={16} /></span>}
          </div>
          {cvvStatus.hasError && <span className="checkout-field-error">{errors.cvv}</span>}
        </div>
      </div>
    </div>
  );
}
