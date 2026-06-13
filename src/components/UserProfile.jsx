import React, { useState } from 'react';
import {
  X, User, FileText, Palette, CheckCircle2,
  Clock, AlertCircle, Save, LogOut, TrendingUp, Calendar
} from 'lucide-react';

const AVATAR_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6',
  '#84cc16', '#f97316',
];

function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();
}

export default function UserProfile({ currentUser, tasks, onUpdateProfile, onLogout, onClose }) {
  const displayName = currentUser.name || currentUser.username || '';
  const [name, setName] = useState(displayName);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatarColor, setAvatarColor] = useState(currentUser.avatarColor || '#6366f1');
  const [saved, setSaved] = useState(false);

  // Stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed).length;
  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.completed) return false;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const due = new Date(t.dueDate); due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Joined date
  const joinedDate = currentUser.joinedAt
    ? new Date(currentUser.joinedAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : 'Không rõ';

  const handleSave = () => {
    if (!name.trim()) return;
    onUpdateProfile({ name: name.trim(), bio: bio.trim(), avatarColor });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="profile-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="profile-panel">
        {/* Close button */}
        <button className="profile-close-btn" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Avatar section */}
        <div className="profile-avatar-section">
          <div
            className="profile-avatar-large"
            style={{ backgroundColor: avatarColor }}
          >
            {getInitials(name)}
          </div>
          <div>
            <h2 className="profile-display-name">{displayName}</h2>
            <p className="profile-email">{currentUser.email || ''}</p>
            <span className="profile-join-date">
              <Calendar size={12} /> Tham gia: {joinedDate}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="profile-stats">
          <div className="profile-stat-card">
            <CheckCircle2 size={18} style={{ color: '#10b981' }} />
            <span className="profile-stat-value">{completedTasks}</span>
            <span className="profile-stat-label">Đã xong</span>
          </div>
          <div className="profile-stat-card">
            <Clock size={18} style={{ color: '#f59e0b' }} />
            <span className="profile-stat-value">{pendingTasks}</span>
            <span className="profile-stat-label">Đang chờ</span>
          </div>
          <div className="profile-stat-card">
            <AlertCircle size={18} style={{ color: '#f43f5e' }} />
            <span className="profile-stat-value">{overdueTasks}</span>
            <span className="profile-stat-label">Quá hạn</span>
          </div>
          <div className="profile-stat-card">
            <TrendingUp size={18} style={{ color: 'var(--accent-primary)' }} />
            <span className="profile-stat-value">{completionRate}%</span>
            <span className="profile-stat-label">Hoàn thành</span>
          </div>
        </div>

        {/* Completion bar */}
        <div className="profile-progress-section">
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            <span>Tiến độ tổng</span>
            <span style={{ color: 'var(--accent-primary)' }}>{completedTasks}/{totalTasks}</span>
          </div>
          <div className="profile-progress-bar-bg">
            <div
              className="profile-progress-bar-fill"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        <div className="profile-divider" />

        {/* Edit form */}
        <div className="profile-form">
          <h3 className="profile-section-title">Chỉnh sửa hồ sơ</h3>

          <div className="profile-field">
            <label><User size={13} /> Tên hiển thị</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên của bạn"
            />
          </div>

          <div className="profile-field">
            <label><FileText size={13} /> Giới thiệu</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Một vài điều về bạn..."
              rows={3}
            />
          </div>

          <div className="profile-field">
            <label><Palette size={13} /> Màu avatar</label>
            <div className="profile-color-picker">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  className={`profile-color-swatch ${avatarColor === color ? 'selected' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setAvatarColor(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          <div className="profile-actions">
            <button
              className={`profile-save-btn ${saved ? 'saved' : ''}`}
              onClick={handleSave}
              disabled={!name.trim()}
            >
              {saved ? '✓ Đã lưu!' : <><Save size={15} /> Lưu thay đổi</>}
            </button>
            <button className="profile-logout-btn" onClick={onLogout}>
              <LogOut size={15} /> Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
