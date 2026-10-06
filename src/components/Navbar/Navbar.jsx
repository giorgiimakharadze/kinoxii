import { useState } from "react";
import { Search, ChevronDown, User, LogOut } from 'lucide-react';
import "./Navbar.css"


export default function Navbar({
  user = null,
  onLoginClick,
  onRegisterClick,
  onLogout,
  onNavigate,
  onSearch,
}) {
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const [searchQuery, setseatchQuery] = useState('');

  const handleSearchChange = (e) => {
    setseatchQuery(e.target.value);
    onSearch?.(e.target.value);
  }

  const getInitials = () => {
    if (!user) return '';
    if (user.fullName) {
      const parts = user.fullName.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (user.username || 'U').slice(0, 2).toUpperCase();
  };

  const displayName = user ? (user.fullName ? user.fullName.split(' ')[0] : user.username) : '';

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* logo and navigation */}
        <div className="navbar-left">
          <div
            className="navbar-logo"
            onClick={() => onNavigate?.('home')}
            role="button"
            tabIndex={0}
          >
            <span className="kino">KINO</span>
            <span className="xii">XII</span>
          </div>
          <nav className="navbar-nav">
            <button
              className="nav-link"
              onClick={() => onNavigate?.('sessions')}
            >
              SESSIONS
            </button>
          </nav>
        </div>
        {/* search and user */}
        <div className="navbar-right">
          {/* search */}
          <div className="navbar-search">
            <Search size={15} className="search-icon" />
            <input type="text"
              placeholder="Search films and events"
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>

          {/* user */}
          {/* guest state */}
          {!user ? (
            <div className="navbar-auth-buttons">
              <button className="signup-btn" onClick={onRegisterClick}>
                Sign Up
              </button>
              <button className="login-btn" onClick={onLoginClick}>
                Log in
              </button>
            </div>) :
            // authorized user
            (
              <div className="navbar-user-wrapper">
                <button
                  className="user-profile-btn"
                  onClick={() => setdropdownOpen(!dropdownOpen)}
                >
                  {/* avatar with indicator dot */}
                  <div className="user-avatar-container">
                    {user.avatar ? (
                      <img src={user.avatar} alt={displayName}
                        className="user-avatar-img"
                      />
                    ) : (
                      <div className="user-avatar-initials">
                        {getInitials()}
                      </div>
                    )}
                    {/* green for complete, orange if incomplete */}
                    <span
                      className={`status-dot ${user.profileComplete ? 'dot-complete' : 'dot-incomplete'}`}
                    />
                  </div>
                  <span className="user-display-name">{displayName}</span>
                  <ChevronDown size={14}
                    className={`chevron-icon ${dropdownOpen ? 'open' : ''}`}
                  />
                </button>
                {/* user dropdown menu */}
                {dropdownOpen && (
                  <div className="navbar-dropdown">
                    <button className="dropdown-item"
                      onClick={() => {
                        setdropdownOpen(false);
                        onNavigate?.('profile');
                      }}
                    >
                      <User size={16} />
                      <span>My Profile</span>
                    </button>
                    <div className="dropdown-separator" />
                    <button
                      className="dropdown-item danger"
                      onClick={() => {
                        setdropdownOpen(false);
                        onLogout?.();
                      }}
                    >
                      <LogOut size={16} />
                      <span>Log out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
        </div>
      </div>
    </header>
  );
}