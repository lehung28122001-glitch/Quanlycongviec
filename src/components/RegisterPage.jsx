import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage({ onRegister }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    const response = onRegister({ username, password });

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
          <h1>Đăng ký tài khoản</h1>
          <p>Tạo tài khoản để bắt đầu quản lý công việc và lịch trình hàng ngày.</p>
        </header>

        {errorMessage && <div className="auth-error">{errorMessage}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="register-username">Tên đăng nhập</label>
            <input
              id="register-username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập username"
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="register-password">Mật khẩu</label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập password"
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit-button">
            Đăng ký
          </button>
        </form>

        <p className="auth-switch">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </section>
    </main>
  );
}
