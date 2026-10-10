import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProfileTabs from '../../components/Profile/ProfileTabs';
import PersonalInfoForm from '../../components/Profile/PersonalInfoForm';
import TicketsTab from '../../components/Profile/TicketsTab';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, requireAuth, loadingUser } = useAuth();
  const [upcomingCount, setUpcomingCount] = useState(0);

  const activeTab = searchParams.get('tab') === 'tickets' ? 'tickets' : 'personal';

  useEffect(() => {
    if (!loadingUser && !user) {
      requireAuth(() => { });
      if (!user) {
        navigate('/', { replace: true });
      }
    }
  }, [user, loadingUser, navigate, requireAuth]);

  if (!user && loadingUser) {
    return (
      <div className="profile-page-container">
        <div className="profile-loading">Loading profile...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="profile-page-container">
      <div className="profile-page-inner">
        <h1 className="profile-main-title">My Profile</h1>

        <ProfileTabs
          activeTab={activeTab}
          onTabChange={(tab) => setSearchParams(tab === 'tickets' ? { tab: 'tickets' } : {})}
          ticketCount={upcomingCount}
        />

        {activeTab === 'personal' ? (
          <PersonalInfoForm />
        ) : (
          <TicketsTab onUpcomingCountChange={setUpcomingCount} />
        )}
      </div>
    </div>
  );
}
