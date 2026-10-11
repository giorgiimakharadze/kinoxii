import React, { useState, useEffect, useMemo } from 'react';
import CheckoutForm from './CheckoutForm';
import OrderSummaryPanel from './OrderSummaryPanel';

export default function CheckoutStep({
  session,
  user,
  holdData,
  selectedSeats,
  onCompleteOrder,
  isPaying,
  serverErrors = {},
}) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });

  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
        mobileNumber: user.mobileNumber || '',
      }));
    }
  }, [user]);

  const errors = useMemo(() => {
    const errs = {};

    if (!formData.fullName.trim()) {
      errs.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 3) {
      errs.fullName = 'Name must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email';
    }

    const rawMobile = formData.mobileNumber.replace(/\s+/g, '');
    if (!rawMobile) {
      errs.mobileNumber = 'Mobile number is required';
    } else if (!rawMobile.startsWith('5')) {
      errs.mobileNumber = 'Georgian mobile numbers must start with 5';
    } else if (rawMobile.length !== 9 || !/^\d+$/.test(rawMobile)) {
      errs.mobileNumber = 'Mobile number must be exactly 9 digits';
    }

    const rawCard = formData.cardNumber.replace(/\s+/g, '');
    if (!rawCard) {
      errs.cardNumber = 'Card number is required';
    } else if (rawCard.length !== 16 || !/^\d+$/.test(rawCard)) {
      errs.cardNumber = 'Card number must be 16 digits';
    }

    if (!formData.expiry) {
      errs.expiry = 'Expiry is required';
    } else {
      const parts = formData.expiry.split('/');
      if (parts.length !== 2 || parts[0].length !== 2 || parts[1].length !== 2) {
        errs.expiry = 'Expiry must be MM/YY';
      } else {
        const month = parseInt(parts[0], 10);
        const year = 2000 + parseInt(parts[1], 10);
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (month < 1 || month > 12) {
          errs.expiry = 'Invalid month';
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
          errs.expiry = 'Card is expired';
        }
      }
    }

    if (!formData.cvv) {
      errs.cvv = 'CVV is required';
    } else if (formData.cvv.length !== 3 || !/^\d+$/.test(formData.cvv)) {
      errs.cvv = 'CVV must be 3 digits';
    }

    return errs;
  }, [formData]);

  const mergedErrors = useMemo(() => {
    const res = { ...errors };
    Object.keys(serverErrors).forEach((key) => {
      if (serverErrors[key]?.[0]) {
        res[key] = serverErrors[key][0];
      }
    });
    return res;
  }, [errors, serverErrors]);

  const isValid = Object.keys(errors).length === 0;

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handlePay = () => {
    setTouched({
      fullName: true,
      email: true,
      mobileNumber: true,
      cardNumber: true,
      expiry: true,
      cvv: true,
    });

    if (!isValid || isPaying) return;

    onCompleteOrder({
      holdId: holdData.holdId,
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      mobileNumber: formData.mobileNumber.replace(/\s+/g, ''),
      cardNumber: formData.cardNumber.replace(/\s+/g, ''),
      expiry: formData.expiry,
      cvv: formData.cvv,
    });
  };

  return (
    <div className="checkout-step-layout">
      {/* form */}
      <div className="checkout-step-form-col">
        <CheckoutForm
          formData={formData}
          errors={mergedErrors}
          touched={touched}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </div>

      {/* order summary panel */}
      <div className="checkout-step-summary-col">
        <OrderSummaryPanel
          session={session}
          selectedSeats={selectedSeats}
          holdData={holdData}
          onPay={handlePay}
          isPaying={isPaying}
          isValid={isValid}
        />
      </div>
    </div>
  );
}
