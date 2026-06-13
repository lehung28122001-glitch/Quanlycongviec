import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, ChevronDown, LogOut, User, CheckSquare, Sparkles } from 'lucide-react';

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Navbar({ theme, toggleTheme, currentUser, onLogout, onOpenProfile, tasks }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const completedToday = tasks
    ? tasks.filter((t) => {
        if (!t.completed) return false;
        const today = new Date().toDateString();
        return new Date(t.createdAt).toDateString() === today;
      }).length
    : 0;

  return (
    <nav className="app-navbar glass-panel">
      {/* Left: Brand */}
      <div className="navbar-brand">
        <div className="navbar-logo">
          <CheckSquare size={18} />
        </div>
        <span className="navbar-title">FocusTask</span>
        <Sparkles size={13} className="navbar-sparkle" />
      </div>

      {/* Center: greeting */}
      {currentUser && (
        <div className="navbar-center">
          <span className="navbar-greeting">
            Xin chào, <strong>{currentUser.name ? currentUser.name.split(' ').pop() : currentUser.username || currentUser}</strong>! 👋
          </span>
          {completedToday > 0 && (
            <span className="navbar-badge-today">
              🎯 {completedToday} xong hôm nay
            </span>
          )}
        </div>
      )}

      {/* Right: actions */}
      <div className="navbar-actions">
        {/* Theme toggle */}
        <button
          className="navbar-icon-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* User avatar dropdown */}
        {currentUser && (
          <div className="navbar-user-menu" ref={dropdownRef}>
            <button
              className="navbar-avatar-btn"
              onClick={() => setDropdownOpen((v) => !v)}
            >
              <span
                className="navbar-avatar"
                style={{ backgroundColor: currentUser.avatarColor || '#6366f1' }}
              >
                {getInitials(currentUser.name || currentUser.username || currentUser)}
              </span>
              <span className="navbar-user-name">
                {currentUser.name ? currentUser.name.split(' ').pop() : currentUser.username || currentUser}
              </span>
              <ChevronDown size={14} className={`navbar-chevron ${dropdownOpen ? 'open' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="navbar-dropdown">
                {/* User info header */}
                <div className="navbar-dropdown-header">
                  <span
                    className="navbar-dropdown-avatar"
                    style={{ backgroundColor: currentUser.avatarColor || '#6366f1' }}
                  >
                    {getInitials(currentUser.name || currentUser.username || currentUser)}
                  </span>
                  <div>
                    <div className="navbar-dropdown-name">
                      {currentUser.name || currentUser.username || currentUser}
                    </div>
                    <div className="navbar-dropdown-email">
                      {currentUser.email || ''}
                    </div>
                  </div>
                </div>

                <div className="navbar-dropdown-divider" />

                {onOpenProfile && (
                  <button
                    className="navbar-dropdown-item"
                    onClick={() => { setDropdownOpen(false); onOpenProfile(); }}
                  >
                    <User size={15} />
                    Trang cá nhân
                  </button>
                )}

                <div className="navbar-dropdown-divider" />

                <button
                  className="navbar-dropdown-item navbar-dropdown-logout"
                  onClick={() => { setDropdownOpen(false); onLogout(); }}
                >
                  <LogOut size={15} />
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
