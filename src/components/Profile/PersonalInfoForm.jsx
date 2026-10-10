import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../services/api';
import { getCachedFilterOptions } from '../../services/configService';
import ProfileInputField from './ProfileInputField';
import ProfileSelectField from './ProfileSelectFiels';
import { AlertCircle, Check } from 'lucide-react';

function calculateAge(dobString) {
  if (!dobString) return null;
  const dob = new Date(dobString);
  if (isNaN(dob.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export default function PersonalInfoForm() {
  const { user, handleLoginSuccess } = useAuth();

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [preferredVenueId, setPreferredVenueId] = useState('');

  const [initialValues, setInitialValues] = useState({
    fullName: '',
    mobileNumber: '',
    dateOfBirth: '',
    preferredVenueId: '',
  });

  const [venues, setVenues] = useState([]);
  const [touched, setTouched] = useState({});
  const [serverErrors, setServerErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getCachedFilterOptions()
      .then((data) => {
        if (data?.venues) setVenues(data.venues);
      })
      .catch((err) => console.warn('Could not load venues:', err));
  }, []);

  useEffect(() => {
    if (user) {
      const init = {
        fullName: user.fullName || '',
        mobileNumber: user.mobileNumber || '',
        dateOfBirth: user.dateOfBirth || '',
        preferredVenueId: user.preferredVenue?.id ? String(user.preferredVenue.id) : '',
      };
      setFullName(init.fullName);
      setMobileNumber(init.mobileNumber);
      setDateOfBirth(init.dateOfBirth);
      setPreferredVenueId(init.preferredVenueId);
      setInitialValues(init);
    }
  }, [user]);

  const errors = useMemo(() => {
    const errs = {};

    // full name
    const trimmedName = fullName.trim();
    if (!trimmedName) {
      errs.fullName = 'Name is required';
    } else if (trimmedName.length < 3) {
      errs.fullName = 'Name must be at least 3 characters';
    } else if (trimmedName.length > 50) {
      errs.fullName = 'Name must not exceed 50 characters';
    }

    // mobile number
    const cleanMobile = mobileNumber.replace(/\s+/g, '');
    if (!cleanMobile) {
      errs.mobileNumber = 'Mobile number is required';
    } else if (!cleanMobile.startsWith('5')) {
      errs.mobileNumber = 'Georgian mobile numbers must start with 5';
    } else if (cleanMobile.length !== 9 || !/^\d+$/.test(cleanMobile)) {
      errs.mobileNumber = 'Mobile number must be exactly 9 digits';
    }

    // dob
    if (!dateOfBirth) {
      errs.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      if (isNaN(dob.getTime()) || dob > today) {
        errs.dateOfBirth = 'Please enter a valid date of birth';
      } else {
        const age = calculateAge(dateOfBirth);
        if (age !== null && age < 12) {
          errs.dateOfBirth = 'You must be at least 12 years old to create an account';
        }
      }
    }

    return errs;
  }, [fullName, mobileNumber, dateOfBirth]);

  const userAge = useMemo(() => calculateAge(dateOfBirth), [dateOfBirth]);
  const showAgeRestrictionNotice = userAge !== null && userAge >= 12 && userAge < 18;

  // dirty state checking
  const isDirty = useMemo(() => {
    return (
      fullName !== initialValues.fullName ||
      mobileNumber !== initialValues.mobileNumber ||
      dateOfBirth !== initialValues.dateOfBirth ||
      preferredVenueId !== initialValues.preferredVenueId
    );
  }, [fullName, mobileNumber, dateOfBirth, preferredVenueId, initialValues]);

  const isValid = Object.keys(errors).length === 0;
  const isSaveDisabled = !isDirty || !isValid || isSubmitting;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      fullName: true,
      mobileNumber: true,
      dateOfBirth: true,
    });

    if (!isValid || !isDirty) return;

    setIsSubmitting(true);
    setServerErrors({});
    setSaveSuccess(false);

    try {
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('mobileNumber', mobileNumber.replace(/\s+/g, ''));
      formData.append('dateOfBirth', dateOfBirth);
      if (preferredVenueId) {
        formData.append('preferredVenueId', preferredVenueId);
      }

      const res = await authApi.updateProfile(formData);
      if (res?.data) {
        handleLoginSuccess(res.data);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3500);
      }
    } catch (err) {
      if (err.status === 422 && err.data?.errors) {
        setServerErrors(err.data.errors);
      } else {
        setServerErrors({ general: [err.message || 'Failed to save changes.'] });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-tab-content">
      <form className="profile-form" onSubmit={handleSubmit} noValidate>
        {serverErrors.general && (
          <div className="profile-alert-box error">
            <AlertCircle size={16} />
            <span>{serverErrors.general[0]}</span>
          </div>
        )}

        {saveSuccess && (
          <div className="profile-alert-box success">
            <Check size={16} />
            <span>Profile updated successfully!</span>
          </div>
        )}

        {/* full name */}
        <ProfileInputField
          label="Full name"
          placeholder="e.g. Text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          onBlur={() => handleBlur('fullName')}
          touched={touched.fullName}
          error={serverErrors.fullName?.[0] || errors.fullName}
        />

        {/* email */}
        <ProfileInputField
          label="Email"
          type="email"
          value={user?.email || ''}
          disabled
          readOnly
          helperText="Set at registration and cannot be changed"
        />

        {/* mobile number */}
        <ProfileInputField
          label="Mobile number"
          type="tel"
          placeholder="555 123 456"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          onBlur={() => handleBlur('mobileNumber')}
          touched={touched.mobileNumber}
          error={serverErrors.mobileNumber?.[0] || errors.mobileNumber}
        />

        {/* DoB */}
        <ProfileInputField
          label="Date of birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          onBlur={() => handleBlur('dateOfBirth')}
          touched={touched.dateOfBirth}
          error={serverErrors.dateOfBirth?.[0] || errors.dateOfBirth}
          warning={showAgeRestrictionNotice ? 'you cannot buy tickets for 16+ or 18+ titles' : ''}
        />

        {/* preffered venue */}
        <ProfileSelectField
          label="Preferred Venue (Optional)"
          value={preferredVenueId}
          onChange={(e) => setPreferredVenueId(e.target.value)}
          options={venues}
          placeholder="e.g. Text"
        />

        {/* save changes button */}
        <div className="profile-form-actions">
          <button
            type="submit"
            disabled={isSaveDisabled}
            className="profile-save-btn"
          >
            {isSubmitting ? 'Saving changes...' : 'Save changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
