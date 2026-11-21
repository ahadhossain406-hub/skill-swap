import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Star } from 'lucide-react';
import StarRating from '../common/StarRating';
import useUsers from '../../hooks/useUsers';
import * as projectService from '../../services/projectService';
import * as reviewService from '../../services/reviewService';
import { useSkills } from '../../context/SkillsContext';
import { formatDate } from '../../utils/formatDate';
import { summarizeRatings } from '../../utils/ratings';

// Kono user-er rating/review ar project dekhay. Nijer ar onner profile, duitoi use kore.
export default function ProfileActivity({ userId }) {
  const { users } = useUsers();
  const { getSkillName } = useSkills();
  const [reviews, setReviews] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    Promise.all([reviewService.getReviewsForUser(userId), projectService.getAllProjects()]).then(
      ([loadedReviews, allProjects]) => {
        setReviews(loadedReviews);
        setProjects(allProjects.filter((p) => p.members.some((m) => m.userId === userId)));
      }
    );
  }, [userId]);

  const { average, count } = summarizeRatings(reviews);
  const nameOf = (id) => users.find((u) => u.id === id)?.name ?? 'Unknown user';

  const hoursBy = (project) =>
    Math.round(
      project.contributions.filter((c) => c.userId === userId).reduce((sum, c) => sum + c.hours, 0) * 10
    ) / 10;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
          <Star className="h-5 w-5 text-amber-500" />
          Ratings &amp; reviews
        </h2>

        {count === 0 ? (
          <p className="mt-3 text-sm text-slate-500">No reviews yet.</p>
        ) : (
          <>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-3xl font-bold text-slate-900">{average}</span>
              <div>
                <StarRating value={average} />
                <p className="text-xs text-slate-500">
                  {count} {count === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
            <ul className="mt-4 space-y-4">
              {reviews.map((review) => (
                <li key={review.id} className="border-t border-slate-100 pt-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-800">{nameOf(review.reviewerId)}</span>
                    <StarRating value={review.rating} size="sm" />
                  </div>
                  <p className="text-xs text-slate-400">
                    {getSkillName(review.skillId)} · {formatDate(review.createdAt)}
                  </p>
                  {review.comment && <p className="mt-1 text-sm text-slate-600">{review.comment}</p>}
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 font-semibold text-slate-900">
          <FolderKanban className="h-5 w-5 text-brand-600" />
          Projects
        </h2>

        {projects.length === 0 ? (
          <p className="mt-3 text-sm text-slate-500">Not part of any project yet.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {projects.map((project) => {
              const role = project.members.find((m) => m.userId === userId)?.role;
              return (
                <li key={project.id} className="border-t border-slate-100 pt-3 first:border-0 first:pt-0">
                  <Link to={`/projects/${project.id}`} className="font-medium text-slate-900 hover:text-brand-600">
                    {project.title}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {role} · {hoursBy(project)}h logged
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}