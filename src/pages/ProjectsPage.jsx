import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, Plus, Search } from 'lucide-react';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectFormModal from '../components/projects/ProjectFormModal';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import useUsers from '../hooks/useUsers';
import * as projectService from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import { useSkills } from '../context/SkillsContext';
import { useToast } from '../context/ToastContext';

const selectClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const { user: me } = useAuth();
  const { users } = useUsers();
  const { skills, getSkillName } = useSkills();
  const { showToast } = useToast();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [view, setView] = useState('all'); // 'all' ba 'mine'
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('all');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    projectService
      .getAllProjects()
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (fields) => {
    const created = await projectService.createProject({ ownerId: me.id, ...fields });
    showToast('Project created!');
    navigate(`/projects/${created.id}`);
  };

  const term = search.trim().toLowerCase();
  const ownerName = (id) => users.find((u) => u.id === id)?.name ?? '';
  const hoursOf = (p) => p.contributions.reduce((sum, c) => sum + c.hours, 0);

  let results = projects.filter((p) => {
    if (view === 'mine' && !p.members.some((m) => m.userId === me.id)) return false;
    if (skillFilter !== 'all' && !p.skillIds.includes(Number(skillFilter))) return false;

    if (term) {
      const text = [p.title, p.description, ownerName(p.ownerId), ...p.skillIds.map((id) => getSkillName(id))]
        .join(' ')
        .toLowerCase();
      if (!text.includes(term)) return false;
    }
    return true;
  });

  if (sort === 'liked') {
    results = [...results].sort((a, b) => b.likes.length - a.likes.length);
  } else if (sort === 'active') {
    results = [...results].sort((a, b) => hoursOf(b) - hoursOf(a));
  } else {
    results = [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  const sortedSkills = [...skills].sort((a, b) => a.name.localeCompare(b.name));

  const tabClass = (name) =>
    `rounded-lg px-4 py-2 text-sm font-semibold transition ${
      view === name ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
    }`;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="mt-1 text-slate-600">
            See what the community is building, and share your own work.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="h-4 w-4" />
          New project
        </Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button type="button" onClick={() => setView('all')} className={tabClass('all')}>
          All projects
        </button>
        <button type="button" onClick={() => setView('mine')} className={tabClass('mine')}>
          My projects
        </button>
      </div>

      <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, description, person or skill..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <select value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} className={selectClass}>
            <option value="all">All skills</option>
            {sortedSkills.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
            <option value="newest">Sort: Newest</option>
            <option value="liked">Sort: Most liked</option>
            <option value="active">Sort: Most hours logged</option>
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Showing {results.length} {results.length === 1 ? 'project' : 'projects'}
      </p>

      <div className="mt-4">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : results.length === 0 ? (
          <EmptyState
            icon={FolderKanban}
            title="No projects found"
            text={
              view === 'mine'
                ? 'You are not part of any project yet. Create one or ask an owner to add you.'
                : 'Try a different search or skill filter.'
            }
          >
            <Button onClick={() => setCreating(true)}>Create a project</Button>
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                owner={users.find((u) => u.id === project.ownerId)}
                myId={me.id}
              />
            ))}
          </div>
        )}
      </div>

      {creating && <ProjectFormModal onSave={handleCreate} onClose={() => setCreating(false)} />}
    </div>
  );
}