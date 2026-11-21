import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, X } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';

// onAdd(userId, role) ar onRemove(userId): duitoi Promise<boolean> return kore.
export default function ProjectMembers({ project, users, me, onAdd, onRemove }) {
  const [userId, setUserId] = useState('');
  const [role, setRole] = useState('');

  const isOwner = project.ownerId === me.id;
  const memberIds = project.members.map((m) => m.userId);
  const candidates = users.filter((u) => !memberIds.includes(u.id));

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!userId) return;
    const ok = await onAdd(Number(userId), role);
    if (ok) {
      setUserId('');
      setRole('');
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 font-semibold text-slate-900">
        <Users className="h-5 w-5 text-brand-600" />
        Team ({project.members.length})
      </h2>

      <ul className="mt-4 space-y-3">
        {project.members.map((member) => {
          const user = users.find((u) => u.id === member.userId);
          const isProjectOwner = member.userId === project.ownerId;

          return (
            <li key={member.userId} className="flex items-center gap-3">
              <Avatar name={user?.name ?? '?'} color={user?.avatarColor} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">
                  {user ? (
                    <Link to={`/users/${user.id}`} className="hover:text-brand-600">
                      {user.name}
                    </Link>
                  ) : (
                    'Unknown user'
                  )}
                  {isProjectOwner && (
                    <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      Owner
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500">{member.role}</p>
              </div>
              {isOwner && !isProjectOwner && (
                <button
                  type="button"
                  aria-label={`Remove ${user?.name ?? 'member'}`}
                  onClick={() => {
                    if (window.confirm(`Remove ${user?.name ?? 'this member'} from the team?`)) {
                      onRemove(member.userId);
                    }
                  }}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {isOwner && (
        <form onSubmit={handleAdd} className="mt-5 space-y-2 border-t border-slate-100 pt-4">
          <p className="text-sm font-medium text-slate-700">Add a team member</p>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="">Choose a person...</option>
            {candidates.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={role}
            maxLength={30}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role (e.g. Developer)"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
          />
          <Button type="submit" variant="secondary" disabled={!userId} className="w-full">
            Add member
          </Button>
        </form>
      )}
    </section>
  );
}