import { useState } from 'react';
import { Inbox, Send } from 'lucide-react';
import RequestCard from '../components/requests/RequestCard';
import EmptyState from '../components/common/EmptyState';
import useUsers from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestsContext';
import { useToast } from '../context/ToastContext';

const STATUSES = ['all', 'pending', 'accepted', 'declined', 'cancelled'];

export default function RequestsPage() {
  const { user: me } = useAuth();
  const { requests, loading, pendingReceivedCount, respondToRequest } = useRequests();
  const { users } = useUsers();
  const { showToast } = useToast();

  const [tab, setTab] = useState('received'); // 'received' ba 'sent'
  const [status, setStatus] = useState('all');

  const received = requests.filter((r) => r.toUserId === me.id);
  const sent = requests.filter((r) => r.fromUserId === me.id);

  const currentList = (tab === 'received' ? received : sent).filter(
    (r) => status === 'all' || r.status === status
  );

  const findUser = (id) => users.find((u) => u.id === id);

  const handleAction = async (requestId, action, successMessage) => {
    try {
      await respondToRequest(requestId, action);
      showToast(successMessage);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const tabClass = (name) =>
    `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
      tab === name ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Swap requests</h1>
      <p className="mt-1 text-slate-600">Manage requests you received and sent.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => setTab('received')} className={tabClass('received')}>
          <Inbox className="h-4 w-4" />
          Received ({received.length})
          {pendingReceivedCount > 0 && (
            <span className="rounded-full bg-red-500 px-2 text-xs text-white">
              {pendingReceivedCount} new
            </span>
          )}
        </button>
        <button type="button" onClick={() => setTab('sent')} className={tabClass('sent')}>
          <Send className="h-4 w-4" />
          Sent ({sent.length})
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
              status === s
                ? 'bg-slate-800 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : currentList.length === 0 ? (
          <EmptyState
            icon={tab === 'received' ? Inbox : Send}
            title="No requests here"
            text={
              tab === 'received'
                ? 'When someone wants to swap skills with you, it will show up here.'
                : 'Find a match on the Explore page and send your first request.'
            }
          />
        ) : (
          currentList.map((request) => {
            const otherId = tab === 'received' ? request.fromUserId : request.toUserId;
            return (
              <RequestCard
                key={request.id}
                request={request}
                otherUser={findUser(otherId)}
                direction={tab}
                onAccept={(id) => handleAction(id, 'accept', 'Request accepted!')}
                onDecline={(id) => handleAction(id, 'decline', 'Request declined.')}
                onCancel={(id) => handleAction(id, 'cancel', 'Request cancelled.')}
              />
            );
          })
        )}
      </div>
    </div>
  );
}