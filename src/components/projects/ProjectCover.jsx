import { useSkills } from '../../context/SkillsContext';

// Prothom skill-er category onujayi rong.
const gradients = {
  Design: 'from-pink-500 to-rose-500',
  Programming: 'from-indigo-500 to-blue-500',
  Languages: 'from-emerald-500 to-teal-500',
  Music: 'from-amber-500 to-orange-500',
  Business: 'from-sky-500 to-cyan-500',
  Academics: 'from-violet-500 to-purple-500',
  Lifestyle: 'from-lime-500 to-green-600',
};

export default function ProjectCover({ skillIds, title, className = '' }) {
  const { getSkillById } = useSkills();
  const category = getSkillById(skillIds[0])?.category;
  const gradient = gradients[category] ?? 'from-slate-500 to-slate-700';

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br ${gradient} ${className}`}>
      <span className="text-5xl font-extrabold text-white/80">
        {title.charAt(0).toUpperCase()}
      </span>
    </div>
  );
}