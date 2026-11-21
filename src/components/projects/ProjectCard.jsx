import { Link } from 'react-router-dom';
import { Clock, Heart, MessageCircle, Users } from 'lucide-react';
import Avatar from '../common/Avatar';
import SkillTag from '../skills/SkillTag';
import ProjectCover from './ProjectCover';
import { useSkills } from '../../context/SkillsContext';

const MAX_TAGS = 3;

export default function ProjectCard({ project, owner, myId }) {
  const { getSkillName } = useSkills();

  const liked = project.likes.includes(myId);
  const totalHours = project.contributions.reduce((sum, c) => sum + c.hours, 0);
  const shownSkills = project.skillIds.slice(0, MAX_TAGS);
  const extraCount = project.skillIds.length - shownSkills.length;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <ProjectCover skillIds={project.skillIds} title={project.title} className="h-28" />

      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 font-semibold text-slate-900">{project.title}</h3>

        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <Avatar name={owner?.name ?? '?'} color={owner?.avatarColor} size="sm" />
          <span>{owner?.name ?? 'Unknown user'}</span>
        </div>

        <p className="mt-3 line-clamp-2 text-sm text-slate-600">{project.description}</p>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {shownSkills.map((id) => (
            <SkillTag key={id} name={getSkillName(id)} />
          ))}
          {extraCount > 0 && <span className="text-xs text-slate-500">+{extraCount} more</span>}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-4 pt-4 text-sm text-slate-500">
          <span className={`flex items-center gap-1 ${liked ? 'text-rose-600' : ''}`}>
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            {project.likes.length}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {project.comments.length}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            {project.members.length}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {totalHours}h
          </span>
        </div>
      </div>
    </Link>
  );
}