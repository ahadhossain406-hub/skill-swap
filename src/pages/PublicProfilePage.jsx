import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, GraduationCap, MapPin, Sparkles } from 'lucide-react';
import Avatar from '../components/common/Avatar';
import SkillTag from '../components/skills/SkillTag';
import EmptyState from '../components/common/EmptyState';
import SendRequestButton from '../components/requests/SendRequestButton';
import ProfileActivity from '../components/profile/ProfileActivity';
import * as userService from '../services/userService';
import { useAuth } from '../context/AuthContext';
import { useSkills } from '../context/SkillsContext';
import { getMatchInfo } from '../utils/matchingAlgorithm';

export default function PublicProfilePage() {
  const { userId } = useParams(); // URL theke /users/:userId er userId
  const id = Number(userId);

  const { user: me } = useAuth();
  const { getSkillName } = useSkills();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    userService
      .getUserById(id)
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [id]);

  // Nijer profile dekhte chaile My Profile page-e pathai.
  if (id === me.id) return <Navigate to="/profile" replace />;

  if (loading) return <p className="text-slate-500">Loading...</p>;

  if (!profile || profile.role === 'admin') {
    return (
      <EmptyState title="User not found" text="This profile does not exist.">
        <Link to="/explore" className="text-sm font-semibold text-brand-600 hover:underline">
          Back to Explore
        </Link>
      </EmptyState>
    );
  }

  const match = getMatchInfo(me, profile);
  const names = (ids) => ids.map((skillId) => getSkillName(skillId)).join(', ');
  const hasAnyMatch = match.theyCanTeachMe.length > 0 || match.iCanTeachThem.length > 0;

  const joinedText = new Date(profile.joinedAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <Link
        to="/explore"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Explore
      </Link>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <Avatar name={profile.name} color={profile.avatarColor} size="lg" />
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
              {profile.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {profile.location}
                </span>
              )}
              <span>Member since {joinedText}</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-slate-700">{profile.bio || 'This user has not written a bio yet.'}</p>
        <div className="mt-4">
          <SendRequestButton targetUser={profile} />
        </div>
      </section>

      <section
        className={`rounded-2xl border p-6 ${
          match.isMutual ? 'border-green-200 bg-green-50' : 'border-slate-200 bg-white'
        }`}
      >
        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
          <Sparkles className={`h-5 w-5 ${match.isMutual ? 'text-green-600' : 'text-slate-400'}`} />
          {match.isMutual
            ? `Mutual match! (${match.score}%)`
            : hasAnyMatch
            ? `One-way match (${match.score}%)`
            : 'No direct match yet'}
        </h2>

        {hasAnyMatch ? (
          <div className="mt-3 space-y-1 text-sm">
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
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-600">
            Your skills do not overlap yet. Add more skills to your{' '}
            <Link to="/profile" className="font-semibold text-brand-600 hover:underline">
              profile
            </Link>{' '}
            to find more matches.
          </p>
        )}
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <GraduationCap className="h-5 w-5 text-brand-600" />
            Can teach
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.teaches.length === 0 && (
              <p className="text-sm text-slate-500">Nothing added yet.</p>
            )}
            {profile.teaches.map((t) => (
              <SkillTag key={t.skillId} name={getSkillName(t.skillId)} level={t.level} />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="flex items-center gap-2 font-semibold text-slate-900">
            <BookOpen className="h-5 w-5 text-brand-600" />
            Wants to learn
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.learns.length === 0 && (
              <p className="text-sm text-slate-500">Nothing added yet.</p>
            )}
            {profile.learns.map((skillId) => (
              <SkillTag key={skillId} name={getSkillName(skillId)} />
            ))}
          </div>
        </section>
      </div>

      <ProfileActivity userId={profile.id} />
    </div>
  );
}