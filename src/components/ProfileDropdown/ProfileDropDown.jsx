import React from 'react';
import { User, Ticket, LogOut, Check } from 'lucide-react';
import './ProfileDropdown.css';
import ticketIcon from "../../assets/icons/Ticket.png"


export default function ProfileDropdown({
  user,
  getInitials,
  onNavigate,
  onLogout,
  onClose,
}) {
  if (!user) return null;

  return (
    <div className='profile-dropdown'>
      {/* avatar, full name, email */}
      <div className='profile-dropdown-header'>
        <div className='dropdown-avatar-wrap'>
          {
            user.avatar ? (
              <img
                src={user.avatar}
                alt={user.fullName || user.username}
                className='dropdown-avatar-img'
              />
            ) : (
              <div className='dropdown-avatar-initials'>
                {getInitials?.() || 'U'}
              </div>
            )
          }
          <span className={`status-dot ${user.profileComplete ? 'dot-complete' : 'dot-incomplete'}`} />
        </div>
        <div className='dropdown-user-details'>
          <h4 className='dropdown-fullname'>
            {user.fullName || user.username}
          </h4>
          <p className='dropdown-email'>
            {user.mail || 'user@example.com'}
          </p>
        </div>
      </div>

      {/* profile status */}
      {user.profileComplete ? (
        <div className='profile-status-box status-complete'>
          <span>Profile Complete</span>
          <Check size={16} strokeWidth={2.5} />
        </div>
      ) : (
        <div className='profile-status-box status-incomplete'>
          <h5 className='status-incomplete-title'>Profile incomplete</h5>
          <p className='status-incomplete-desc'>
            Please complete your profile to enable booking
          </p>
        </div>
      )
      }

      {/* nav links */}
      <div className='dropdown-menu-list'>
        <button className='dropdown-nav-btn'
          onClick={() => {
            onClose?.();
            onNavigate?.('profile');
          }}>
          <User size={18} className='dropdown-btn-icon' />
          <span>My Profile</span>
        </button>

        <button className='dropdown-nav-btn'
          onClick={() => {
            onClose?.();
            onNavigate?.('tickets');
          }}>
          <img src={ticketIcon} alt="" className="dropdown-btn-icon" width={18} height={18} />
          <span>My Tickets</span>
        </button>
      </div>

      {/* divider */}
      <div className='dropdown-divider-line'></div>

      {/* logout button */}
      <button
        className='dropdown-logout-btn'
        onClick={() => {
          onClose?.();
          onLogout?.();
        }}>
        <LogOut size={16} style={{ transform: 'scaleX(-1)' }} />
        <span>Log out</span>
      </button>

    </div>
  );
}