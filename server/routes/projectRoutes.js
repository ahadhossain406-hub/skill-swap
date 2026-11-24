import { Router } from 'express';
import {
  createProject,
  deleteProject,
  getProject,
  likeProject,
  listProjects,
  updateProject,
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { projectRules } from '../validators/projectValidators.js';

const router = Router();

router.use(authenticate);

router.get('/', listProjects);
router.post('/', projectRules, validate, createProject);
router.get('/:id', getProject);
router.put('/:id', projectRules, validate, updateProject);
router.delete('/:id', deleteProject);
router.post('/:id/like', likeProject);

export default router;