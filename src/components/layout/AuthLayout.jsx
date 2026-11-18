import Logo from '../common/Logo';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Logo />
      <div className="mt-6 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}