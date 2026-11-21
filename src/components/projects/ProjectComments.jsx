import { useState } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { formatDate } from '../../utils/formatDate';

// onAdd(text) ar onDelete(id): Promise<boolean> return kore.
export default function ProjectComments({ project, users, me, onAdd, onDelete }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const isOwner = project.ownerId === me.id;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const ok = await onAdd(text);
    setSaving(false);
    if (ok) setText('');
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="flex items-center gap-2 font-semibold text-slate-900">
        <MessageCircle className="h-5 w-5 text-brand-600" />
        Comments ({project.comments.length})
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={text}
          maxLength={300}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
        />
        <Button type="submit" loading={saving} disabled={!text.trim()}>
          Post
        </Button>
      </form>

      {project.comments.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">No comments yet. Be the first to say something.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {project.comments.map((comment) => {
            const user = users.find((u) => u.id === comment.userId);
            const canDelete = comment.userId === me.id || isOwner;

            return (
              <li key={comment.id} className="flex items-start gap-3">
                <Avatar name={user?.name ?? '?'} color={user?.avatarColor} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-slate-900">{user?.name ?? 'Unknown user'}</span>
                    <span className="ml-2 text-xs text-slate-400">{formatDate(comment.createdAt)}</span>
                  </p>
                  <p className="text-sm text-slate-700">{comment.text}</p>
                </div>
                {canDelete && (
                  <button
                    type="button"
                    aria-label="Delete comment"
                    onClick={() => onDelete(comment.id)}
                    className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}