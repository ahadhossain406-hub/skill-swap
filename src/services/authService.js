import { getItem, setItem, removeItem } from './storage';
import { STORAGE_KEYS, AVATAR_COLORS } from '../utils/constants';
import { mockUsers } from '../data/users';

// Load users from localStorage. On the very first run, seed with mock users.
function loadUsers() {
  const stored = getItem(STORAGE_KEYS.USERS, null);
  if (stored) return stored;
  setItem(STORAGE_KEYS.USERS, mockUsers);
  return mockUsers;
}

// Never hand the password to the UI.
function withoutPassword(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export async function register({ name, email, password }) {
  const users = loadUsers();
  const cleanEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email === cleanEmail)) {
    throw new Error('An account with this email already exists.');
  }

  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: cleanEmail,
    password,
    role: 'user',
    bio: '',
    location: '',
    avatarColor: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
    teaches: [],
    learns: [],
    joinedAt: new Date().toISOString(),
  };

  setItem(STORAGE_KEYS.USERS, [...users, newUser]);
  setItem(STORAGE_KEYS.CURRENT_USER_ID, newUser.id);
  return withoutPassword(newUser);
}

export async function login(email, password) {
  const users = loadUsers();
  const user = users.find(
    (u) => u.email === email.trim().toLowerCase() && u.password === password
  );

  if (!user) {
    throw new Error('Invalid email or password.');
  }

  setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
  return withoutPassword(user);
}

export async function logout() {
  removeItem(STORAGE_KEYS.CURRENT_USER_ID);
}

export async function getCurrentUser() {
  const id = getItem(STORAGE_KEYS.CURRENT_USER_ID, null);
  if (id === null) return null;
  const user = loadUsers().find((u) => u.id === id);
  return user ? withoutPassword(user) : null;
}