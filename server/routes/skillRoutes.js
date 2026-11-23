import { Router } from 'express';
import { listCategories, listSkills } from '../controllers/skillController.js';

const router = Router();

// Skill list shobar jonno khola, login lagbe na.
router.get('/', listSkills);
router.get('/categories', listCategories);

export default router;