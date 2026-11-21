import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CalendarDays, Handshake, Inbox, Star, Video } from 'lucide-react';
import Avatar from '../components/common/Avatar';
import useUsers from '../hooks/useUsers';
import * as projectService from '../services/projectService';
import * as reviewService from '../services/reviewService';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestsContext';
import { useSessions } from '../context/SessionsContext';
import { useSkills } from '../context/SkillsContext';
import { formatSessionDate, formatTime, sessionDateTime } from '../utils/dateTime';
import { findMatches } from '../utils/matchingAlgorithm';
import { summarizeRatings } from '../utils/ratings';

function StatCard({ to, icon: Icon, label, value, hint }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="truncate text-sm text-slate-500">{label}</p>
        {hint && <p className="truncate text-xs text-slate-400">{hint}</p>}
      </div>
    </Link>
  );
}

function Panel({ title, linkTo, linkText, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {linkTo && (
          <Link to={linkTo} className="text-sm font-medium text-brand-600 hover:underline">
            {linkText}
          </Link>
        )}
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function HoursChart({ data, emptyText }) {
  const hasData = data.some((d) => d.hours > 0);

  if (!hasData) {
    return <p className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">{emptyText}</p>;
  }

  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => `${value} h`} />
          <Bar dataKey="hours" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function DashboardPage() {
  const { user: me } = useAuth();
  const { users } = useUsers();
  const { requests, pendingReceivedCount } = useRequests();
  const { sessions } = useSessions();
  const { getSkillName } = useSkills();

  const [reviews, setReviews] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    reviewService.getReviewsForUser(me.id).then(setReviews);
    projectService.getAllProjects().then(setProjects);
  }, [me.id]);

  const findUser = (id) => users.find((u) => u.id === id);
  const firstName = me.name.split(' ')[0];

  const mutualMatches = findMatches(me, users).filter((m) => m.isMutual);

  const upcoming = sessions
    .filter((s) => s.status === 'scheduled')
    .sort((a, b) => sessionDateTime(a.date, a.time) - sessionDateTime(b.date, b.time));

  const pendingRequests = requests.filter((r) => r.toUserId === me.id && r.status === 'pending');
  const { average, count } = summarizeRatings(reviews);

  // Chart 1: completed session-e koto ghonta shekhiyechi ar shikhechi.
  const completed = sessions.filter((s) => s.status === 'completed');
  const hoursWhere = (test) =>
    Math.round((completed.filter(test).reduce((sum, s) => sum + s.durationMins, 0) / 60) * 10) / 10;

  const sessionChart = [
    { name: 'Taught', hours: hoursWhere((s) => s.teacherId === me.id), color: '#f59e0b' },
    { name: 'Learned', hours: hoursWhere((s) => s.learnerId === me.id), color: '#0ea5e9' },
  ];

  // Chart 2: amar project-e kaj-er ghonta.
  const projectChart = projects
    .filter((p) => p.members.some((m) => m.userId === me.id))
    .map((p) => ({
      name: p.title.length > 14 ? `${p.title.slice(0, 14)}…` : p.title,
      hours:
        Math.round(
          p.contributions.filter((c) => c.userId === me.id).reduce((sum, c) => sum + c.hours, 0) * 10
        ) / 10,
      color: '#6366f1',
    }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5);

  const needsSkills = me.teaches.length === 0 || me.learns.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Hello, {firstName} 👋</h1>
        <p className="mt-1 text-slate-600">Here is what is happening on your SkillSwap.</p>
      </div>

      {needsSkills && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          <p>Add at least one skill to teach and one to learn, so we can find your matches.</p>
          <Link to="/profile" className="font-semibold underline">
            Go to My Profile
          </Link>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard to="/matches" icon={Handshake} label="Mutual matches" value={mutualMatches.length} />
        <StatCard to="/requests" icon={Inbox} label="Pending requests" value={pendingReceivedCount} hint="Waiting for you" />
        <StatCard to="/sessions" icon={CalendarDays} label="Upcoming sessions" value={upcoming.length} />
        <StatCard
          to="/profile"
          icon={Star}
          label="Your rating"
          value={count === 0 ? '–' : average}
          hint={count === 0 ? 'No reviews yet' : `${count} ${count === 1 ? 'review' : 'reviews'}`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Hours taught vs learned">
          <HoursChart data={sessionChart} emptyText="Complete a session to see your hours here." />
        </Panel>
        <Panel title="My hours by project" linkTo="/projects" linkText="All projects">
          <HoursChart data={projectChart} emptyText="Log work on a project to see your hours here." />
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title="Next sessions" linkTo="/sessions" linkText="View all">
          {upcoming.length === 0 ? (
            <p className="text-sm text-slate-500">No upcoming sessions.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.slice(0, 3).map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-2 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{getSkillName(s.skillId)}</p>
                    <p className="text-xs text-slate-500">
                      {formatSessionDate(s.date)} · {formatTime(s.time)}
                    </p>
                  </div>
                  {s.mode === 'online' && (
                    <Link
                      to={`/sessions/${s.id}/room`}
                      className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-green-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-green-700"
                    >
                      <Video className="h-3 w-3" />
                      Join
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Requests for you" linkTo="/requests" linkText="View all">
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-slate-500">No pending requests.</p>
          ) : (
            <ul className="space-y-3">
              {pendingRequests.slice(0, 3).map((r) => {
                const sender = findUser(r.fromUserId);
                return (
                  <li key={r.id} className="flex items-center gap-3 text-sm">
                    <Avatar name={sender?.name ?? '?'} color={sender?.avatarColor} size="sm" />
                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-900">{sender?.name ?? 'Unknown user'}</p>
                      <p className="truncate text-xs text-slate-500">
                        {getSkillName(r.offeredSkillId)} ↔ {getSkillName(r.requestedSkillId)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <Panel title="Top matches" linkTo="/matches" linkText="View all">
          {mutualMatches.length === 0 ? (
            <p className="text-sm text-slate-500">No mutual matches yet.</p>
          ) : (
            <ul className="space-y-3">
              {mutualMatches.slice(0, 3).map((m) => (
                <li key={m.user.id}>
                  <Link to={`/users/${m.user.id}`} className="flex items-center gap-3 text-sm hover:opacity-80">
                    <Avatar name={m.user.name} color={m.user.avatarColor} size="sm" />
                    <span className="min-w-0 flex-1 truncate font-medium text-slate-900">{m.user.name}</span>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                      {m.score}%
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}