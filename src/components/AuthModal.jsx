import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, CheckSquare, Sparkles } from 'lucide-react';

export default function AuthModal({ onLogin, onRegister }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  // Reset errors when switching tabs
  useEffect(() => {
    setError('');
    setSuccess('');
  }, [tab]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 400));
    const result = onLogin({ email: loginEmail, password: loginPassword });
    setLoading(false);
    if (!result.success) setError(result.error);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword || !regConfirm) {
      setError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }
    if (regPassword.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (regPassword !== regConfirm) {
      setError('Xác nhận mật khẩu không khớp.');
      return;
    }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 400));
    const result = onRegister({ name: regName, email: regEmail, password: regPassword });
    setLoading(false);
    if (!result.success) {
      setError(result.error);
    } else {
      setSuccess('Đăng ký thành công! Đang đăng nhập...');
    }
  };

  return (
    <div className="auth-overlay">
      {/* Background animated blobs */}
      <div className="auth-bg-blob auth-blob-1" />
      <div className="auth-bg-blob auth-blob-2" />
      <div className="auth-bg-blob auth-blob-3" />

      <div className="auth-card">
        {/* Brand header */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <CheckSquare size={22} />
          </div>
          <span className="auth-brand-name">FocusTask</span>
          <Sparkles size={14} className="auth-brand-sparkle" />
        </div>

        <div className="auth-heading">
          <h2>{tab === 'login' ? 'Chào mừng trở lại!' : 'Tạo tài khoản'}</h2>
          <p>{tab === 'login' ? 'Đăng nhập để quản lý công việc của bạn.' : 'Bắt đầu hành trình năng suất của bạn.'}</p>
        </div>

        {/* Tab switcher */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => setTab('login')}
          >
            Đăng nhập
          </button>
          <button
            className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => setTab('register')}
          >
            Đăng ký
          </button>
          <div className="auth-tab-indicator" style={{ transform: tab === 'login' ? 'translateX(0)' : 'translateX(100%)' }} />
        </div>

        {/* Error / Success alerts */}
        {error && (
          <div className="auth-alert auth-alert-error">
            <X size={14} /> {error}
          </div>
        )}
        {success && (
          <div className="auth-alert auth-alert-success">
            ✓ {success}
          </div>
        )}

        {/* LOGIN FORM */}
        {tab === 'login' && (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <label>Email</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Mật khẩu</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  autoComplete="current-password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className={`auth-submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Đăng nhập'}
            </button>

            <p className="auth-switch-text">
              Chưa có tài khoản?{' '}
              <button type="button" className="auth-link" onClick={() => setTab('register')}>
                Đăng ký ngay
              </button>
            </p>
          </form>
        )}

        {/* REGISTER FORM */}
        {tab === 'register' && (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-field">
              <label>Tên hiển thị</label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-input-icon" />
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  autoComplete="name"
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Email</label>
              <div className="auth-input-wrapper">
                <Mail size={16} className="auth-input-icon" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field">
              <label>Mật khẩu</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ít nhất 6 ký tự"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label>Xác nhận mật khẩu</label>
              <div className="auth-input-wrapper">
                <Lock size={16} className="auth-input-icon" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu"
                  value={regConfirm}
                  onChange={(e) => setRegConfirm(e.target.value)}
                  autoComplete="new-password"
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowConfirm((v) => !v)}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" className={`auth-submit-btn ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? <span className="auth-spinner" /> : 'Tạo tài khoản'}
            </button>

            <p className="auth-switch-text">
              Đã có tài khoản?{' '}
              <button type="button" className="auth-link" onClick={() => setTab('login')}>
                Đăng nhập
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
