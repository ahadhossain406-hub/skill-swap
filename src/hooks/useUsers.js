import { useEffect, useState } from 'react';
import * as userService from '../services/userService';

// Custom hook: shob user load kore ar loading state-o dey.
// Explore ar Matches, duita page-i eta use kore, tai ekbar-i likhlam.
export default function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService
      .getAllUsers()
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return { users, loading };
}