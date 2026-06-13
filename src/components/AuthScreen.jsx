import { useState } from 'react';
import { User, Lock, Eye, EyeOff, CheckSquare, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AuthScreen({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleModeChange = (newMode) => {
    setMode(newMode);
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Rút gọn khoảng trắng thừa
    const trimmedUsername = username.trim();

    // Validations cơ bản
    if (!trimmedUsername) {
      setError('Tên đăng nhập không được để trống.');
      return;
    }
    if (trimmedUsername.length < 3) {
      setError('Tên đăng nhập phải chứa ít nhất 3 ký tự.');
      return;
    }
    if (!password) {
      setError('Mật khẩu không được để trống.');
      return;
    }
    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    // Lấy danh sách users từ localStorage
    const users = JSON.parse(localStorage.getItem('focustask_users')) || [];

    if (mode === 'login') {
      // Tìm user trong hệ thống
      const user = users.find(
        (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
      );

      if (!user || user.password !== password) {
        setError('Tên đăng nhập hoặc mật khẩu không chính xác.');
        return;
      }

      setSuccess('Đăng nhập thành công!');
      setTimeout(() => {
        onLoginSuccess(user.username);
      }, 600);
    } else {
      // Đăng ký
      if (password !== confirmPassword) {
        setError('Mật khẩu nhập lại không khớp.');
        return;
      }

      // Kiểm tra username đã tồn tại chưa
      const userExists = users.some(
        (u) => u.username.toLowerCase() === trimmedUsername.toLowerCase()
      );

      if (userExists) {
        setError('Tên đăng nhập này đã tồn tại trong hệ thống.');
        return;
      }

      // Tạo user mới. Mặc định gán các tasks rỗng hoặc default.
      // Ở đây ta sẽ lưu trữ user mới với tasks trống. Lúc đăng nhập vào App.jsx,
      // nếu user chưa có tasks, hệ thống sẽ tự động gán DEFAULT_TASKS.
      const newUser = {
        username: trimmedUsername,
        password: password,
        tasks: []
      };

      users.push(newUser);
      localStorage.setItem('focustask_users', JSON.stringify(users));

      setSuccess('Đăng ký tài khoản thành công!');
      setTimeout(() => {
        // Tự động đăng nhập luôn sau khi đăng ký thành công
        onLoginSuccess(newUser.username);
      }, 800);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="auth-logo">
            <CheckSquare size={26} />
          </div>
          <h2 className="auth-title">FocusTask</h2>
          <p className="auth-subtitle">
            {mode === 'login' ? 'Quản lý công việc hiệu quả và tập trung' : 'Tạo tài khoản mới để bắt đầu sử dụng'}
          </p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => handleModeChange('login')}
          >
            Đăng nhập
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => handleModeChange('register')}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-body">
          {error && (
            <div className="auth-alert auth-alert-error">
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="auth-alert auth-alert-success">
              <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
              <span>{success}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Tên đăng nhập</label>
            <div className="auth-input-wrapper">
              <input
                id="username"
                type="text"
                placeholder="Nhập tên đăng nhập..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
              <User size={18} className="auth-input-icon" />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Mật khẩu</label>
            <div className="auth-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <Lock size={18} className="auth-input-icon" />
              <button
                type="button"
                className="auth-input-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
              <div className="auth-input-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Nhập lại mật khẩu..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <Lock size={18} className="auth-input-icon" />
                <button
                  type="button"
                  className="auth-input-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', height: '42px' }}
          >
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký tài khoản'}
          </button>
        </form>
      </div>
    </div>
  );
}
