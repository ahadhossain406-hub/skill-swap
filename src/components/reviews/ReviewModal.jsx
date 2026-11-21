import { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import StarRating from '../common/StarRating';

const COMMENT_LIMIT = 300;
const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very good', 'Excellent'];

// onSubmit(rating, comment) async. Error throw korle ekhane banner-e dekhabo.
export default function ReviewModal({ teacherName, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please choose a star rating.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onSubmit(rating, comment);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <Modal open onClose={onClose} title={`Rate ${teacherName}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="text-center">
          <StarRating
            value={rating}
            size="lg"
            onChange={(star) => {
              setRating(star);
              setError('');
            }}
          />
          <p className="mt-1 h-5 text-sm font-medium text-slate-600">{LABELS[rating]}</p>
        </div>

        <div>
          <label htmlFor="review-comment" className="mb-1 block text-sm font-medium text-slate-700">
            Comment (optional)
          </label>
          <textarea
            id="review-comment"
            rows={3}
            maxLength={COMMENT_LIMIT}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the session? What did you learn?"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-500"
          />
          <p className="mt-1 text-right text-xs text-slate-400">
            {comment.length}/{COMMENT_LIMIT}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={saving}>
            Submit review
          </Button>
        </div>
      </form>
    </Modal>
  );
}