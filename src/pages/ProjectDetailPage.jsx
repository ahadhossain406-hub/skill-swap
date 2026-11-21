import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Code, ExternalLink, FolderKanban, Heart, Pencil, Trash2 } from 'lucide-react';
import Avatar from '../components/common/Avatar';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import SkillTag from '../components/skills/SkillTag';
import ProjectCover from '../components/projects/ProjectCover';
import ProjectFormModal from '../components/projects/ProjectFormModal';
import ProjectMembers from '../components/projects/ProjectMembers';
import ContributionTracker from '../components/projects/ContributionTracker';
import ProjectComments from '../components/projects/ProjectComments';
import useUsers from '../hooks/useUsers';
import * as projectService from '../services/projectService';
import { useAuth } from '../context/AuthContext';
import { useSkills } from '../context/SkillsContext';
import { useToast } from '../context/ToastContext';
import { formatDate } from '../utils/formatDate';

export default function ProjectDetailPage() {
  const { projectId } = useParams();
  const id = Number(projectId);
  const navigate = useNavigate();

  const { user: me } = useAuth();
  const { users } = useUsers();
  const { getSkillName } = useSkills();
  const { showToast } = useToast();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setLoading(true);
    projectService
      .getProjectById(id)
      .then(setProject)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-slate-500">Loading...</p>;

  if (!project) {
    return (
      <EmptyState icon={FolderKanban} title="Project not found" text="It may have been deleted.">
        <Link to="/projects" className="text-sm font-semibold text-brand-600 hover:underline">
          Back to Projects
        </Link>
      </EmptyState>
    );
  }

  const isOwner = project.ownerId === me.id;
  const liked = project.likes.includes(me.id);
  const owner = users.find((u) => u.id === project.ownerId);

  // Ekta action chalay. Thik hole project update kore true return kore, na hole error toast ar false.
  const act = async (action, successMessage) => {
    try {
      const updated = await action();
      setProject(updated);
      if (successMessage) showToast(successMessage);
      return true;
    } catch (error) {
      showToast(error.message, 'error');
      return false;
    }
  };

  const handleEdit = async (fields) => {
    const updated = await projectService.editProject(project.id, me.id, fields);
    setProject(updated);
    setEditing(false);
    showToast('Project updated.');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this project for everyone? This cannot be undone.')) return;
    try {
      await projectService.deleteProject(project.id, me.id);
      showToast('Project deleted.');
      navigate('/projects');
    } catch (error) {
      showToast(error.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Link>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <ProjectCover skillIds={project.skillIds} title={project.title} className="h-32" />

        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{project.title}</h1>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                <Avatar name={owner?.name ?? '?'} color={owner?.avatarColor} size="sm" />
                <span>
                  by{' '}
                  {owner ? (
                    <Link to={`/users/${owner.id}`} className="font-semibold text-slate-800 hover:text-brand-600">
                      {owner.name}
                    </Link>
                  ) : (
                    'Unknown user'
                  )}{' '}
                  · {formatDate(project.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={liked ? 'primary' : 'outline'}
                onClick={() => act(() => projectService.toggleLike(project.id, me.id))}
              >
                <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
                {project.likes.length}
              </Button>
              {isOwner && (
                <>
                  <Button variant="outline" onClick={() => setEditing(true)}>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" onClick={handleDelete}>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          <p className="mt-4 whitespace-pre-line text-slate-700">{project.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.skillIds.map((skillId) => (
              <SkillTag key={skillId} name={getSkillName(skillId)} />
            ))}
          </div>

          {(project.githubUrl || project.demoUrl) && (
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline"
                >
                  <Code className="h-4 w-4" />
                  GitHub
                </a>
              )}
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live demo
                </a>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <ContributionTracker
            project={project}
            users={users}
            me={me}
            onAdd={(data) =>
              act(() => projectService.addContribution(project.id, me.id, data), 'Contribution logged.')
            }
            onDelete={(entryId) =>
              act(() => projectService.deleteContribution(project.id, entryId, me.id), 'Entry deleted.')
            }
          />
          <ProjectComments
            project={project}
            users={users}
            me={me}
            onAdd={(text) => act(() => projectService.addComment(project.id, me.id, text))}
            onDelete={(commentId) =>
              act(() => projectService.deleteComment(project.id, commentId, me.id), 'Comment deleted.')
            }
          />
        </div>

        <div>
          <ProjectMembers
            project={project}
            users={users}
            me={me}
            onAdd={(userId, role) =>
              act(() => projectService.addMember(project.id, me.id, userId, role), 'Member added.')
            }
            onRemove={(userId) =>
              act(() => projectService.removeMember(project.id, me.id, userId), 'Member removed.')
            }
          />
        </div>
      </div>

      {editing && (
        <ProjectFormModal project={project} onSave={handleEdit} onClose={() => setEditing(false)} />
      )}
    </div>
  );
}