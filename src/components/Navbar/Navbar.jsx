import { useState, useRef, useEffect } from "react";
import "./Navbar.css"
import ProfileDropdown from "../ProfileDropdown/ProfileDropDown";
import { Search, X, ChevronDown, User, LogOut } from 'lucide-react';
import SearchOverlay from '../SearchOverlay/SearchOverlay';
export default function Navbar({
  user = null,
  onLoginClick,
  onRegisterClick,
  onLogout,
  onNavigate,
  onSearch,
}) {
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const [searchQuery, setsearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const handleClear = () => {
    setsearchQuery('');
    onSearch?.('');
    inputRef.current?.focus();   // keeps focus inside the pill, so it stays wide
  };

  const handleClickOutside = (ref, event, close) => {
    if (ref.current && !ref.current.contains(event.target)) close();
  };

  useEffect(() => {
    const onMouseDown = (e) => {
      handleClickOutside(dropdownRef, e, () => setdropdownOpen(false));
      handleClickOutside(searchContainerRef, e, () => setSearchOpen(false));
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);


  const handleSearchChange = (e) => {
    setsearchQuery(e.target.value);
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
          <div className="navbar-search-wrapper" ref={searchContainerRef}>
            <div className={`navbar-search ${searchOpen ? 'active' : ''}`}>
              <Search size={15} className="search-icon" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search films and live events"
                aria-label="Search films and live events"
                value={searchQuery}
                onFocus={() => setSearchOpen(true)}
                onClick={() => setSearchOpen(true)}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                className="search-input"
              />

              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  aria-label="Clear search"
                  onClick={handleClear}
                >
                  <X size={12} strokeWidth={2.5} />
                </button>
              )}

              <SearchOverlay
                query={searchQuery}
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
                onSelectMovie={(movie) => onNavigate?.('movie', movie)}
                onBrowseSessions={() => onNavigate?.('sessions')}
              />
            </div>
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
              <div className="navbar-user-wrapper" ref={dropdownRef}>
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
                  <ProfileDropdown
                    user={user}
                    getInitials={getInitials}
                    onNavigate={onNavigate}
                    onLogout={onLogout}
                    onClose={() => setdropdownOpen(false)}
                  />
                )}

              </div>
            )}
        </div>
      </div>
    </header>
  );
}