import { Router } from 'express';
import { getUser, listUsers, updateMe } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { updateProfileRules } from '../validators/userValidators.js';

const router = Router();

// Ei file-er shob route-e login lagbe.
router.use(authenticate);

router.get('/', listUsers);
router.patch('/me', updateProfileRules, validate, updateMe);
router.get('/:id', getUser);

export default router;