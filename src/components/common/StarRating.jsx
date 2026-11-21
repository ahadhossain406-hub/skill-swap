import { Star } from 'lucide-react';

const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-7 w-7' };

// onChange dile star-e click kore rating deya jay. Na dile shudhu dekhay.
export default function StarRating({ value, onChange = null, size = 'md' }) {
  return (
    <div className="inline-flex items-center gap-0.5" aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const icon = (
          <Star
            className={`${sizes[size]} ${
              star <= Math.round(value) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
            }`}
          />
        );

        return onChange ? (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            aria-label={`${star} ${star === 1 ? 'star' : 'stars'}`}
            className="rounded p-0.5 transition hover:scale-110"
          >
            {icon}
          </button>
        ) : (
          <span key={star}>{icon}</span>
        );
      })}
    </div>
  );
}