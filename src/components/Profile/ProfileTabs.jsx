import React from 'react';

export default function ProfileTabs({ activeTab, onTabChange, ticketCount = 2 }) {
  return (
    <div className="profile-tabs-nav">
      <button
        type="button"
        className={`profile-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
        onClick={() => onTabChange?.('personal')}
      >
        Personal Information
      </button>

      <button
        type="button"
        className={`profile-tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
        onClick={() => onTabChange?.('tickets')}
      >
        My Tickets
        {ticketCount > 0 && (
          <span className="profile-tickets-badge">{ticketCount}</span>
        )}
      </button>
    </div>
  );
}
