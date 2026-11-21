import { createContext, useContext, useEffect, useState } from 'react';
import * as requestService from '../services/requestService';
import { useAuth } from './AuthContext';

const RequestsContext = createContext(null);

export function RequestsProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Login/logout holei request list notun kore load hobe.
  useEffect(() => {
    if (!userId) {
      setRequests([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    requestService
      .getRequestsForUser(userId)
      .then(setRequests)
      .finally(() => setLoading(false));
  }, [userId]);

  const refresh = async () => {
    setRequests(await requestService.getRequestsForUser(userId));
  };

  const sendRequest = async (data) => {
    await requestService.createRequest({ fromUser: user, ...data });
    await refresh();
  };

  // action = 'accept' | 'decline' | 'cancel'
  const respondToRequest = async (requestId, action) => {
    await requestService.updateRequestStatus(requestId, userId, action);
    await refresh();
  };

  const pendingReceivedCount = requests.filter(
    (r) => r.toUserId === userId && r.status === 'pending'
  ).length;

  // Ei user-er sathe ekhon kono pending request ache kina?
  const hasPendingWith = (otherUserId) =>
    requests.some(
      (r) =>
        r.status === 'pending' && (r.fromUserId === otherUserId || r.toUserId === otherUserId)
    );

  return (
    <RequestsContext.Provider
      value={{
        requests,
        loading,
        pendingReceivedCount,
        hasPendingWith,
        sendRequest,
        respondToRequest,
      }}
    >
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  const context = useContext(RequestsContext);
  if (!context) throw new Error('useRequests must be used inside <RequestsProvider>');
  return context;
}