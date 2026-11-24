import { Router } from 'express';
import {
  createRecording,
  listRecordings,
  removeRecording,
  streamRecording,
} from '../controllers/recordingController.js';
import { authenticate } from '../middleware/auth.js';
import { uploadRecording } from '../utils/upload.js';

const router = Router();

router.use(authenticate);

router.get('/', listRecordings);
// authenticate age, tarpor upload. Login chhara keu file pathate parbe na.
router.post('/', uploadRecording, createRecording);
router.get('/:id/file', streamRecording);
router.delete('/:id', removeRecording);

export default router;