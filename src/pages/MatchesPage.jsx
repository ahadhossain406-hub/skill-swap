import { Link } from 'react-router-dom';
import { ArrowLeftRight, Handshake } from 'lucide-react';
import UserCard from '../components/users/UserCard';
import EmptyState from '../components/common/EmptyState';
import useUsers from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import { findMatches } from '../utils/matchingAlgorithm';

export default function MatchesPage() {
  const { user: me } = useAuth();
  const { users, loading } = useUsers();

  if (loading) return <p className="text-slate-500">Loading...</p>;

  const hasSkills = me.teaches.length > 0 && me.learns.length > 0;
  const matches = findMatches(me, users);
  const mutual = matches.filter((m) => m.isMutual);
  const oneWay = matches.filter((m) => !m.isMutual);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">My matches</h1>
      <p className="mt-1 text-slate-600">
        People whose skills fit what you teach and what you want to learn.
      </p>

      {!hasSkills && (
        <div className="mt-6">
          <EmptyState
            icon={Handshake}
            title="Add your skills first"
            text="We need at least one skill you can teach and one you want to learn to find matches."
          >
            <Link
              to="/profile"
              className="inline-flex rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Go to My Profile
            </Link>
          </EmptyState>
        </div>
      )}

      {hasSkills && (
        <>
          <section className="mt-8">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <ArrowLeftRight className="h-5 w-5 text-green-600" />
              Mutual matches ({mutual.length})
            </h2>
            <p className="text-sm text-slate-500">You can teach each other. Best for a swap.</p>

            <div className="mt-4">
              {mutual.length === 0 ? (
                <EmptyState
                  icon={Handshake}
                  title="No mutual matches yet"
                  text="Try adding more skills to your profile, or browse everyone on the Explore page."
                >
                  <Link
                    to="/explore"
                    className="text-sm font-semibold text-brand-600 hover:underline"
                  >
                    Go to Explore
                  </Link>
                </EmptyState>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {mutual.map((m) => (
                    <UserCard key={m.user.id} user={m.user} match={m} showSwap />
                  ))}
                </div>
              )}
            </div>
          </section>

          {oneWay.length > 0 && (
            <section className="mt-10">
              <h2 className="text-lg font-semibold text-slate-900">
                One-way matches ({oneWay.length})
              </h2>
              <p className="text-sm text-slate-500">
                Only one of you can teach the other. You could still ask them for a swap.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {oneWay.map((m) => (
                  <UserCard key={m.user.id} user={m.user} match={m} showSwap />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}