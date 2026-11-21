import { useMemo, useState } from 'react';
import { Check, Search } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useSkills } from '../../context/SkillsContext';
import { SKILL_LEVELS } from '../../utils/constants';

// type = 'teach' ba 'learn'
// takenIds = jei skill gulo user already add koreche (list-e dekhabo na)
export default function AddSkillModal({ type, takenIds, onAdd, onClose }) {
  const { skills, categories } = useSkills();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedId, setSelectedId] = useState(null);
  const [level, setLevel] = useState('Intermediate');

  const isTeach = type === 'teach';

  const visibleSkills = useMemo(
    () =>
      skills.filter(
        (skill) =>
          !takenIds.includes(skill.id) &&
          (category === 'All' || skill.category === category) &&
          skill.name.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [skills, takenIds, category, search]
  );

  const handleAdd = () => {
    if (selectedId === null) return;
    onAdd(selectedId, level);
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={isTeach ? 'Add a skill you can teach' : 'Add a skill you want to learn'}
    >
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search skills..."
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
          {visibleSkills.length === 0 ? (
            <p className="p-4 text-center text-sm text-slate-500">No skills found.</p>
          ) : (
            visibleSkills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => setSelectedId(skill.id)}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                  selectedId === skill.id
                    ? 'bg-brand-50 font-semibold text-brand-700'
                    : 'hover:bg-slate-50'
                }`}
              >
                <span>
                  {skill.name}
                  <span className="ml-2 text-xs font-normal text-slate-400">{skill.category}</span>
                </span>
                {selectedId === skill.id && <Check className="h-4 w-4" />}
              </button>
            ))
          )}
        </div>

        {isTeach && (
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Your level
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
            >
              {SKILL_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleAdd} disabled={selectedId === null}>
            Add skill
          </Button>
        </div>
      </div>
    </Modal>
  );
}