import { Router } from 'express';
import {
  addComment,
  addContribution,
  addMember,
  deleteComment,
  deleteContribution,
  removeMember,
} from '../controllers/projectTeamController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { commentRules, contributionRules, memberRules } from '../validators/teamValidators.js';

const router = Router();

router.use(authenticate);

// Eta projectRoutes-er shathe ekoi /api/projects prefix-e boshe.
router.post('/:id/comments', commentRules, validate, addComment);
router.delete('/:id/comments/:commentId', deleteComment);

router.post('/:id/members', memberRules, validate, addMember);
router.delete('/:id/members/:userId', removeMember);

router.post('/:id/contributions', contributionRules, validate, addContribution);
router.delete('/:id/contributions/:contributionId', deleteContribution);

export default router;