import { createContext, useContext, useEffect, useState } from 'react';
import * as sessionService from '../services/sessionService';
import { useAuth } from './AuthContext';

const SessionsContext = createContext(null);

export function SessionsProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setSessions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    sessionService
      .getSessionsForUser(userId)
      .then(setSessions)
      .finally(() => setLoading(false));
  }, [userId]);

  const refresh = async () => {
    setSessions(await sessionService.getSessionsForUser(userId));
  };

  const scheduleSession = async (data) => {
    await sessionService.createSession({ creatorId: userId, ...data });
    await refresh();
  };

  const completeSession = async (sessionId) => {
    await sessionService.updateSessionStatus(sessionId, userId, 'complete');
    await refresh();
  };

  const cancelSession = async (sessionId) => {
    await sessionService.updateSessionStatus(sessionId, userId, 'cancel');
    await refresh();
  };

  return (
    <SessionsContext.Provider
      value={{ sessions, loading, scheduleSession, completeSession, cancelSession }}
    >
      {children}
    </SessionsContext.Provider>
  );
}

export function useSessions() {
  const context = useContext(SessionsContext);
  if (!context) throw new Error('useSessions must be used inside <SessionsProvider>');
  return context;
}