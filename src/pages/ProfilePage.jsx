import { useState } from 'react';
import { BookOpen, GraduationCap, MapPin, Pencil, Plus } from 'lucide-react';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import SkillTag from '../components/skills/SkillTag';
import AddSkillModal from '../components/skills/AddSkillModal';
import EditProfileModal from '../components/profile/EditProfileModal';
import ProfileActivity from '../components/profile/ProfileActivity';
import { useAuth } from '../context/AuthContext';
import { useSkills } from '../context/SkillsContext';
import { useToast } from '../context/ToastContext';

// Duita skill section-er jonno ekta reusable box.
function SkillSection({ icon: Icon, title, description, onAdd, isEmpty, emptyText, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-900">{title}</h2>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>
        <Button variant="secondary" onClick={onAdd}>
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {isEmpty ? <p className="text-sm text-slate-500">{emptyText}</p> : children}
      </div>
    </section>
  );
}

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const { getSkillName } = useSkills();
  const { showToast } = useToast();

  const [editing, setEditing] = useState(false);
  const [addType, setAddType] = useState(null); // null, 'teach' ba 'learn'

  // Je skill already kono ekta list-e ache, seta onno list-e add kora jabe na.
  const takenIds = [...user.teaches.map((t) => t.skillId), ...user.learns];

  // Action cholano, successful hole toast dekhano, fail hole error toast dekhano.
  const run = async (action, successMessage) => {
    try {
      await action();
      showToast(successMessage);
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  const saveProfile = async (values) => {
    await updateProfile(values);
    setEditing(false);
    showToast('Profile updated.');
  };

  const addSkill = async (skillId, level) => {
    const type = addType;
    setAddType(null);
    await run(
      () =>
        type === 'teach'
          ? updateProfile({ teaches: [...user.teaches, { skillId, level }] })
          : updateProfile({ learns: [...user.learns, skillId] }),
      `${getSkillName(skillId)} added.`
    );
  };

  const removeTeach = (skillId) =>
    run(
      () => updateProfile({ teaches: user.teaches.filter((t) => t.skillId !== skillId) }),
      `${getSkillName(skillId)} removed.`
    );

  const removeLearn = (skillId) =>
    run(
      () => updateProfile({ learns: user.learns.filter((id) => id !== skillId) }),
      `${getSkillName(skillId)} removed.`
    );

  const joinedText = new Date(user.joinedAt).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={user.name} color={user.avatarColor} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user.name}</h1>
              <p className="text-sm text-slate-500">{user.email}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                {user.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {user.location}
                  </span>
                )}
                <span>Member since {joinedText}</span>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4" />
            Edit profile
          </Button>
        </div>
        <p className="mt-4 text-slate-700">
          {user.bio || 'You have not written a bio yet. Click "Edit profile" to add one.'}
        </p>
      </section>

      <SkillSection
        icon={GraduationCap}
        title="Skills I can teach"
        description="Others will find you when they want to learn these."
        onAdd={() => setAddType('teach')}
        isEmpty={user.teaches.length === 0}
        emptyText="No skills added yet. Add something you are good at."
      >
        {user.teaches.map((t) => (
          <SkillTag
            key={t.skillId}
            name={getSkillName(t.skillId)}
            level={t.level}
            onRemove={() => removeTeach(t.skillId)}
          />
        ))}
      </SkillSection>

      <SkillSection
        icon={BookOpen}
        title="Skills I want to learn"
        description="We will match you with people who can teach these."
        onAdd={() => setAddType('learn')}
        isEmpty={user.learns.length === 0}
        emptyText="No skills added yet. Add something you want to learn."
      >
        {user.learns.map((skillId) => (
          <SkillTag
            key={skillId}
            name={getSkillName(skillId)}
            onRemove={() => removeLearn(skillId)}
          />
        ))}
      </SkillSection>

      <ProfileActivity userId={user.id} />

      {editing && (
        <EditProfileModal user={user} onSave={saveProfile} onClose={() => setEditing(false)} />
      )}

      {addType && (
        <AddSkillModal
          type={addType}
          takenIds={takenIds}
          onAdd={addSkill}
          onClose={() => setAddType(null)}
        />
      )}
    </div>
  );
}