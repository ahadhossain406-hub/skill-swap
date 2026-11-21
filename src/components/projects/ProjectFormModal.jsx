import { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useSkills } from '../../context/SkillsContext';

const DESCRIPTION_LIMIT = 600;
const MAX_SKILLS = 5;

// project dile edit mode, na dile notun project.
// onSave(fields) async function. Error throw korle ekhane banner-e dekhabo.
export default function ProjectFormModal({ project = null, onSave, onClose }) {
  const { skills } = useSkills();

  const [form, setForm] = useState({
    title: project?.title ?? '',
    description: project?.description ?? '',
    githubUrl: project?.githubUrl ?? '',
    demoUrl: project?.demoUrl ?? '',
  });
  const [skillIds, setSkillIds] = useState(project?.skillIds ?? []);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const toggleSkill = (id) => {
    setError('');
    setSkillIds((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= MAX_SKILLS) return prev;
      return [...prev, id];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await onSave({ ...form, skillIds });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={project ? 'Edit project' : 'New project'}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          id="title"
          name="title"
          label="Project title"
          placeholder="e.g. Portfolio Website"
          value={form.title}
          onChange={handleChange}
        />

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            maxLength={DESCRIPTION_LIMIT}
            value={form.description}
            onChange={handleChange}
            placeholder="What are you building and what skills does it use?"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {form.description.length}/{DESCRIPTION_LIMIT}
          </p>
        </div>

        <div>
          <p className="mb-1 text-sm font-medium text-slate-700">
            Skills used ({skillIds.length}/{MAX_SKILLS})
          </p>
          <div className="flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-lg border border-slate-200 p-2">
            {skills.map((skill) => {
              const selected = skillIds.includes(skill.id);
              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => toggleSkill(skill.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    selected
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {skill.name}
                </button>
              );
            })}
          </div>
        </div>

        <Input
          id="githubUrl"
          name="githubUrl"
          label="GitHub link (optional)"
          placeholder="https://github.com/..."
          value={form.githubUrl}
          onChange={handleChange}
        />
        <Input
          id="demoUrl"
          name="demoUrl"
          label="Live demo link (optional)"
          placeholder="https://..."
          value={form.demoUrl}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            {project ? 'Save changes' : 'Create project'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}