const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-20 w-20 text-2xl',
};

export default function Avatar({ name = '?', color = '#6366f1', size = 'md' }) {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${sizes[size]}`}
      style={{ backgroundColor: color }}
      aria-label={name}
    >
      {initials}
    </div>
  );
}