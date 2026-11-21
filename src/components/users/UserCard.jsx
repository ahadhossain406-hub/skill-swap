import { Link } from 'react-router-dom';
import { MapPin, Sparkles } from 'lucide-react';
import Avatar from '../common/Avatar';
import SkillTag from '../skills/SkillTag';
import { useSkills } from '../../context/SkillsContext';
import SendRequestButton from '../requests/SendRequestButton';
const MAX_TAGS = 3;

// match   = getMatchInfo() er result (na dile badge/swap dekhabe na)
// showSwap = true hole "They teach you / You teach them" box dekhabe
export default function UserCard({ user, match = null, showSwap = false }) {
  const { getSkillName } = useSkills();

  const shownSkills = user.teaches.slice(0, MAX_TAGS);
  const extraCount = user.teaches.length - shownSkills.length;
  const names = (ids) => ids.map((id) => getSkillName(id)).join(', ');

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start gap-3">
        <Avatar name={user.name} color={user.avatarColor} size="md" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-900">{user.name}</h3>
          {user.location && (
            <p className="flex items-center gap-1 text-xs text-slate-500">
              <MapPin className="h-3 w-3" />
              {user.location}
            </p>
          )}
        </div>
        {match?.isMutual && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            <Sparkles className="h-3 w-3" />
            Mutual · {match.score}%
          </span>
        )}
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600">
        {user.bio || 'No bio yet.'}
      </p>

      <div className="mt-3">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Teaches</p>
        <div className="flex flex-wrap gap-1.5">
          {shownSkills.length === 0 && <span className="text-sm text-slate-400">Nothing yet</span>}
          {shownSkills.map((t) => (
            <SkillTag key={t.skillId} name={getSkillName(t.skillId)} level={t.level} />
          ))}
          {extraCount > 0 && (
            <span className="self-center text-xs text-slate-500">+{extraCount} more</span>
          )}
        </div>
      </div>

      <p className="mt-3 line-clamp-1 text-sm text-slate-600">
        <span className="font-medium text-slate-700">Wants to learn: </span>
        {user.learns.length > 0 ? names(user.learns) : 'Nothing yet'}
      </p>

      {showSwap && match && (
        <div className="mt-3 space-y-2 rounded-lg bg-slate-50 p-3 text-sm">
          {match.theyCanTeachMe.length > 0 && (
            <p>
              <span className="font-medium text-slate-700">They can teach you: </span>
              <span className="text-brand-700">{names(match.theyCanTeachMe)}</span>
            </p>
          )}
          {match.iCanTeachThem.length > 0 && (
            <p>
              <span className="font-medium text-slate-700">You can teach them: </span>
              <span className="text-brand-700">{names(match.iCanTeachThem)}</span>
            </p>
          )}
          <div>
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Match score</span>
              <span>{match.score}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-brand-600"
                style={{ width: `${match.score}%` }}
              />
            </div>
          </div>
        </div>
      )}

            <div className="mt-4 flex gap-2">
        <Link
          to={`/users/${user.id}`}
          className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          View profile
        </Link>
        <SendRequestButton targetUser={user} className="flex-1" />
      </div>
    </div>
  );
}