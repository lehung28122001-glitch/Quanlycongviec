import { useState, useCallback } from 'react';

const USERS_KEY = 'focustask_users';
const CURRENT_USER_KEY = 'focustask_currentUser';

// Simple hash for password (not cryptographically secure — fine for a local app)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(36);
}

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadCurrentUser() {
  try {
    const id = localStorage.getItem(CURRENT_USER_KEY);
    if (!id) return null;
    const users = loadUsers();
    return users.find((u) => u.id === id) || null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState(() => loadCurrentUser());

  // REGISTER
  const register = useCallback(({ name, email, password }) => {
    const users = loadUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, error: 'Email này đã được đăng ký.' };
    }
    const newUser = {
      id: generateId(),
      name,
      email,
      passwordHash: simpleHash(password),
      bio: '',
      avatarColor: '#6366f1',
      joinedAt: new Date().toISOString(),
    };
    const updated = [...users, newUser];
    saveUsers(updated);
    localStorage.setItem(CURRENT_USER_KEY, newUser.id);
    setCurrentUser(newUser);
    return { success: true };
  }, []);

  // LOGIN
  const login = useCallback(({ email, password }) => {
    const users = loadUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, error: 'Email không tồn tại.' };
    if (user.passwordHash !== simpleHash(password)) {
      return { success: false, error: 'Mật khẩu không đúng.' };
    }
    localStorage.setItem(CURRENT_USER_KEY, user.id);
    setCurrentUser(user);
    return { success: true };
  }, []);

  // LOGOUT
  const logout = useCallback(() => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
  }, []);

  // UPDATE PROFILE
  const updateProfile = useCallback((updates) => {
    const users = loadUsers();
    const updated = users.map((u) =>
      u.id === currentUser.id ? { ...u, ...updates } : u
    );
    saveUsers(updated);
    const updatedUser = { ...currentUser, ...updates };
    localStorage.setItem(CURRENT_USER_KEY, updatedUser.id);
    setCurrentUser(updatedUser);
  }, [currentUser]);

  return { currentUser, register, login, logout, updateProfile };
}
