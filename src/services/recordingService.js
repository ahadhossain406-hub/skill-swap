import { getItem, setItem } from './storage';
import { STORAGE_KEYS } from '../utils/constants';

// Video file boro, tai localStorage-e (limit ~5MB) rakha jay na.
// Video IndexedDB-te thake (browser-er boro storage). Recording-er info (title, time) localStorage-e.
// Part 2-e video server-e upload hobe.
const DB_NAME = 'skillswap-recordings';
const STORE_NAME = 'videos';

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// IndexedDB-er ekta kaj chalay, shesh hole database bondho kore.
async function runRequest(mode, makeRequest) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode);
    const request = makeRequest(tx.objectStore(STORE_NAME));
    tx.oncomplete = () => {
      db.close();
      resolve(request.result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
    tx.onabort = () => {
      db.close();
      reject(tx.error);
    };
  });
}

const putBlob = (id, blob) => runRequest('readwrite', (store) => store.put(blob, id));
const deleteBlob = (id) => runRequest('readwrite', (store) => store.delete(id));
const getBlob = async (id) => (await runRequest('readonly', (store) => store.get(id))) ?? null;

function loadMeta() {
  return getItem(STORAGE_KEYS.RECORDINGS, []);
}

export async function getRecordingsForUser(userId) {
  return loadMeta()
    .filter((r) => r.teacherId === userId || r.learnerId === userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function saveRecording({ blob, session, recordedBy, title, durationSec }) {
  if (session.teacherId !== recordedBy && session.learnerId !== recordedBy) {
    throw new Error('You are not part of this session.');
  }

  const id = Date.now();
  await putBlob(id, blob);

  const meta = {
    id,
    sessionId: session.id,
    skillId: session.skillId,
    teacherId: session.teacherId,
    learnerId: session.learnerId,
    recordedBy,
    title,
    durationSec,
    sizeBytes: blob.size,
    mimeType: blob.type,
    createdAt: new Date().toISOString(),
  };

  setItem(STORAGE_KEYS.RECORDINGS, [...loadMeta(), meta]);
  return meta;
}

export async function getRecordingBlob(recordingId) {
  return getBlob(recordingId);
}

export async function deleteRecording(recordingId, userId) {
  const all = loadMeta();
  const recording = all.find((r) => r.id === recordingId);

  if (!recording) throw new Error('Recording not found.');
  if (recording.recordedBy !== userId) {
    throw new Error('Only the person who recorded it can delete it.');
  }

  await deleteBlob(recordingId);
  setItem(
    STORAGE_KEYS.RECORDINGS,
    all.filter((r) => r.id !== recordingId)
  );
}