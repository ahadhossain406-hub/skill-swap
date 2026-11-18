export default function Input({ label, error, id, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 focus:ring-brand-500 ${
          error ? 'border-red-400' : 'border-slate-300'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}