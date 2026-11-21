import { useState } from 'react';
import { Search, Users } from 'lucide-react';
import UserCard from '../components/users/UserCard';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import useUsers from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import { useSkills } from '../context/SkillsContext';
import { getMatchInfo } from '../utils/matchingAlgorithm';
import { SKILL_LEVELS } from '../utils/constants';

const selectClass =
  'rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500';

export default function ExplorePage() {
  const { user: me } = useAuth();
  const { users, loading } = useUsers();
  const { categories, getSkillName, getSkillById } = useSkills();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');
  const [sort, setSort] = useState('match');
  const [mutualOnly, setMutualOnly] = useState(false);

  const term = search.trim().toLowerCase();

  // Step 1: nijeke bade, protita user-er match info ber kori
  // Step 2: filter lagai
  let results = users
    .filter((u) => u.id !== me.id)
    .map((u) => ({ user: u, match: getMatchInfo(me, u) }))
    .filter(({ user: u, match }) => {
      if (mutualOnly && !match.isMutual) return false;

      if (term) {
        const text = [
          u.name,
          u.location,
          ...u.teaches.map((t) => getSkillName(t.skillId)),
          ...u.learns.map((id) => getSkillName(id)),
        ]
          .join(' ')
          .toLowerCase();
        if (!text.includes(term)) return false;
      }

      if (
        category !== 'All' &&
        !u.teaches.some((t) => getSkillById(t.skillId)?.category === category)
      ) {
        return false;
      }

      if (level !== 'All' && !u.teaches.some((t) => t.level === level)) return false;

      return true;
    });

  // Step 3: sort kori
  if (sort === 'name') {
    results = [...results].sort((a, b) => a.user.name.localeCompare(b.user.name));
  } else if (sort === 'newest') {
    results = [...results].sort(
      (a, b) => new Date(b.user.joinedAt) - new Date(a.user.joinedAt)
    );
  } else {
    results = [...results].sort((a, b) => b.match.score - a.match.score);
  }

  const hasFilters = search || category !== 'All' || level !== 'All' || mutualOnly;

  const clearFilters = () => {
    setSearch('');
    setCategory('All');
    setLevel('All');
    setMutualOnly(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Explore people</h1>
      <p className="mt-1 text-slate-600">Find people to swap skills with.</p>

      <div className="mt-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, location or skill..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
            <option value="All">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={level} onChange={(e) => setLevel(e.target.value)} className={selectClass}>
            <option value="All">Any teaching level</option>
            {SKILL_LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass}>
            <option value="match">Sort: Best match</option>
            <option value="newest">Sort: Newest</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={mutualOnly}
              onChange={(e) => setMutualOnly(e.target.checked)}
              className="h-4 w-4 accent-brand-600"
            />
            Mutual matches only
          </label>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-medium text-brand-600 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-500">
        Showing {results.length} {results.length === 1 ? 'person' : 'people'}
      </p>

      <div className="mt-4">
        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : results.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No one found"
            text="Try a different search or remove some filters."
          >
            <Button variant="outline" onClick={clearFilters}>
              Clear filters
            </Button>
          </EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map(({ user: u, match }) => (
              <UserCard key={u.id} user={u} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}