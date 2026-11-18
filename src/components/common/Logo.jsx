import { Link } from 'react-router-dom';
import { ArrowLeftRight } from 'lucide-react';

export default function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 text-xl font-bold text-slate-900">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
        <ArrowLeftRight className="h-4 w-4" />
      </span>
      SkillSwap
    </Link>
  );
}