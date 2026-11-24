import fs from 'node:fs/promises';
import * as recordingService from '../services/recordingService.js';
import AppError from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { parseId } from '../utils/parseId.js';
import { RECORDINGS_DIR } from '../utils/upload.js';

export const listRecordings = asyncHandler(async (req, res) => {
  res.json({ recordings: await recordingService.getRecordingsForUser(req.user.id) });
});

export const createRecording = asyncHandler(async (req, res) => {
  try {
    const recording = await recordingService.createRecording(
      req.user.id,
      {
        sessionId: Number(req.body.sessionId),
        durationSec: Number(req.body.durationSec),
        title: req.body.title,
      },
      req.file
    );
    res.status(201).json({ recording });
  } catch (error) {
    // Kono bhul hole upload hoye jawa file muche dei, jate faltu file jome na thake.
    if (req.file) await fs.unlink(req.file.path).catch(() => {});
    throw error;
  }
});

// Video "stream" kore pathay. sendFile browser-er Range request bujhe,
// tai video-r jekono jaygay jump kora jay.
export const streamRecording = asyncHandler(async (req, res, next) => {
  const file = await recordingService.getRecordingFile(
    parseId(req.params.id, 'Recording'),
    req.user.id
  );

  res.sendFile(file.filename, { root: RECORDINGS_DIR }, (error) => {
    if (error && !res.headersSent) {
      next(
        error.code === 'ENOENT'
          ? new AppError('The video file is missing on the server.', 404)
          : error
      );
    }
  });
});

export const removeRecording = asyncHandler(async (req, res) => {
  await recordingService.deleteRecording(parseId(req.params.id, 'Recording'), req.user.id);
  res.json({ message: 'Recording deleted.' });
});