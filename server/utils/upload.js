import crypto from 'node:crypto';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import AppError from './AppError.js';

// Video file gulo server/uploads/recordings folder-e save hoy.
// (.gitignore-e uploads ache, tai GitHub-e jay na.)
export const RECORDINGS_DIR = fileURLToPath(new URL('../uploads/recordings', import.meta.url));
fs.mkdirSync(RECORDINGS_DIR, { recursive: true });

const MAX_SIZE_MB = 200;

// multer: browser theke ashe multipart/form-data (file + text field). Multer file-ta
// disk-e save kore, req.file-e tar info dey, text field gulo req.body-te dey.
export const uploadRecording = multer({
  storage: multer.diskStorage({
    destination: RECORDINGS_DIR,
    // User-er deya file-er nam use kori na (nirapotta). Random nam dei.
    filename: (req, file, cb) => {
      const extension = file.mimetype.startsWith('video/mp4') ? '.mp4' : '.webm';
      cb(null, `${crypto.randomUUID()}${extension}`);
    },
  }),
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = file.mimetype.startsWith('video/webm') || file.mimetype.startsWith('video/mp4');
    cb(allowed ? null : new AppError('Only WebM or MP4 video files are allowed.', 400), allowed);
  },
}).single('video'); // form-e file-er field-er nam "video"