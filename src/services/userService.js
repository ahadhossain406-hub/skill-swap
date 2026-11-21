import { getItem } from './storage';
import { STORAGE_KEYS } from '../utils/constants';
import { mockUsers } from '../data/users';

function loadUsers() {
  return getItem(STORAGE_KEYS.USERS, null) ?? mockUsers;
}

// Password kokhono UI-te pathabo na.
function withoutPassword(user) {
  const { password, ...safeUser } = user;
  return safeUser;
}

// Shob user (admin bade). Part 3-e eta backend API theke ashbe.
export async function getAllUsers() {
  return loadUsers()
    .filter((u) => u.role !== 'admin')
    .map(withoutPassword);
}

export async function getUserById(id) {
  const user = loadUsers().find((u) => u.id === id);
  return user ? withoutPassword(user) : null;
}