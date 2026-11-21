import { X } from 'lucide-react';

export default function SkillTag({ name, level, onRemove }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
      {name}
      {level && (
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-500">
          {level}
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="rounded-full p-0.5 hover:bg-brand-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </span>
  );
}