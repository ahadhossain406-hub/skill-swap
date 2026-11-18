import { BookOpen, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">
        Hello, {user.name.split(' ')[0]} 👋
      </h1>
      <p className="mt-1 text-slate-600">Here is a quick look at your SkillSwap profile.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{user.teaches.length}</p>
            <p className="text-sm text-slate-500">Skills you can teach</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{user.learns.length}</p>
            <p className="text-sm text-slate-500">Skills you want to learn</p>
          </div>
        </div>
      </div>
    </div>
  );
}