import { useState } from 'react';
import { BarChart3, Trash2 } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatDate';

// onAdd({ description, hours }) ar onDelete(id): Promise<boolean> return kore.
export default function ContributionTracker({ project, users, me, onAdd, onDelete }) {
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState('');
  const [saving, setSaving] = useState(false);

  const isMember = project.members.some((m) => m.userId === me.id);
  const isOwner = project.ownerId === me.id;
  const userOf = (id) => users.find((u) => u.id === id);

  // Step 1: protita user-er moto ghonta jog kori.
  const totals = {};
  project.contributions.forEach((c) => {
    totals[c.userId] = (totals[c.userId] ?? 0) + c.hours;
  });
  const totalHours = Object.values(totals).reduce((sum, h) => sum + h, 0);

  // Step 2: team-er shobai-ke list-e rakhi (jar kaj nai se-o 0% hisebe thakbe).
  const peopleIds = [...new Set([...project.members.map((m) => m.userId), ...Object.keys(totals).map(Number)])];

  const rows = peopleIds
    .map((userId) => {
      const user = userOf(userId);
      const userHours = Math.round((totals[userId] ?? 0) * 10) / 10;
      return {
        userId,
        name: user?.name ?? 'Unknown user',
        color: user?.avatarColor ?? '#94a3b8',
        hours: userHours,
        percent: totalHours > 0 ? Math.round((userHours / totalHours) * 100) : 0,
      };
    })
    .sort((a, b) => b.hours - a.hours);

  const chartData = rows.filter((r) => r.hours > 0);

  const timeline = [...project.contributions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const ok = await onAdd({ description, hours: Number(hours) });
    setSaving(false);
    if (ok) {
      setDescription('');
      setHours('');
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 font-semibold text-slate-900">
        <BarChart3 className="h-5 w-5 text-brand-600" />
        Contribution tracker
      </h2>
      <p className="text-sm text-slate-500">
        See who contributed how much. Total logged: {Math.round(totalHours * 10) / 10} hours.
      </p>

      {chartData.length === 0 ? (
        <p className="mt-6 rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
          No contributions logged yet. Team members can add the first one below.
        </p>
      ) : (
        <div className="mt-4 grid items-center gap-4 sm:grid-cols-2">
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="hours"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {chartData.map((entry) => (
                    <Cell key={entry.userId} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} h`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <ul className="space-y-3">
            {rows.map((row) => (
              <li key={row.userId}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-medium text-slate-800">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: row.color }} />
                    {row.name}
                  </span>
                  <span className="text-slate-500">
                    {row.hours}h · {row.percent}%
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${row.percent}%`, backgroundColor: row.color }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isMember ? (
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row"
        >
          <input
            type="text"
            value={description}
            maxLength={150}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you work on?"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="number"
            value={hours}
            min="0.5"
            max="24"
            step="0.5"
            onChange={(e) => setHours(e.target.value)}
            placeholder="Hours"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500 sm:w-24"
          />
          <Button type="submit" loading={saving}>
            Log work
          </Button>
        </form>
      ) : (
        <p className="mt-6 border-t border-slate-100 pt-4 text-sm text-slate-500">
          Only team members can log contributions.
        </p>
      )}

      {timeline.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">Activity</h3>
          <ul className="mt-3 space-y-3">
            {timeline.map((entry) => {
              const user = userOf(entry.userId);
              const canDelete = entry.userId === me.id || isOwner;

              return (
                <li key={entry.id} className="flex items-start gap-3">
                  <Avatar name={user?.name ?? '?'} color={user?.avatarColor} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-800">
                      <span className="font-semibold">{user?.name ?? 'Unknown user'}</span> logged{' '}
                      <span className="font-semibold text-brand-700">{entry.hours}h</span>
                    </p>
                    <p className="text-sm text-slate-600">{entry.description}</p>
                    <p className="text-xs text-slate-400">{formatDate(entry.createdAt)}</p>
                  </div>
                  {canDelete && (
                    <button
                      type="button"
                      aria-label="Delete entry"
                      onClick={() => {
                        if (window.confirm('Delete this entry?')) onDelete(entry.id);
                      }}
                      className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}