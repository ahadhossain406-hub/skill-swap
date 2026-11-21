import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import Button from '../common/Button';
import StarRating from '../common/StarRating';
import ReviewModal from './ReviewModal';
import * as reviewService from '../../services/reviewService';
import { useToast } from '../../context/ToastContext';

// SessionCard-er bhitore boshe. Completed session-e review ba "Rate" button dekhay.
export default function SessionReview({ session, partner, myId }) {
  const { showToast } = useToast();
  const [review, setReview] = useState(undefined); // undefined = ekhono load hoyni
  const [open, setOpen] = useState(false);

  const completed = session.status === 'completed';
  const isLearner = session.learnerId === myId;
  const partnerName = partner?.name ?? 'your partner';

  useEffect(() => {
    if (!completed) return;
    reviewService.getReviewForSession(session.id).then(setReview);
  }, [completed, session.id]);

  if (!completed || review === undefined) return null;

  const handleSubmit = async (rating, comment) => {
    const created = await reviewService.createReview({
      reviewerId: myId,
      sessionId: session.id,
      rating,
      comment,
    });
    setReview(created);
    setOpen(false);
    showToast('Thanks for your review!');
  };

  return (
    <div className="mt-4 border-t border-slate-100 pt-4">
      {review ? (
        <div>
          <div className="flex items-center gap-2">
            <StarRating value={review.rating} size="sm" />
            <span className="text-xs text-slate-500">
              {isLearner ? 'Your review' : `Review from ${partnerName}`}
            </span>
          </div>
          {review.comment && <p className="mt-1 text-sm text-slate-600">{review.comment}</p>}
        </div>
      ) : isLearner ? (
        <Button variant="secondary" onClick={() => setOpen(true)}>
          <Star className="h-4 w-4" />
          Rate {partnerName}
        </Button>
      ) : (
        <p className="text-sm text-slate-500">Waiting for {partnerName} to rate this session.</p>
      )}

      {open && (
        <ReviewModal teacherName={partnerName} onSubmit={handleSubmit} onClose={() => setOpen(false)} />
      )}
    </div>
  );
}