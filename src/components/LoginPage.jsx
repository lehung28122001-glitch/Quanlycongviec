import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const response = onLogin({ username, password });

    if (response.success) {
      navigate('/app');
    } else {
      setErrorMessage(response.message);
    }
  };

  return (
    <main className="auth-page-wrapper">
      <section className="auth-card glass-panel">
        <header className="auth-header">
          <h1>Đăng nhập</h1>
          <p>Quản lý công việc của bạn bằng tài khoản cá nhân.</p>
        </header>

        {errorMessage && <div className="auth-error">{errorMessage}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="login-username">Tên đăng nhập</label>
            <input
              id="login-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập username"
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="login-password">Mật khẩu</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập password"
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit-button">
            Đăng nhập
          </button>
        </form>

        <p className="auth-switch">
          Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
        </p>
      </section>
    </main>
  );
}
