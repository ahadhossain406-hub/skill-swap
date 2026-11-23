import AppError from '../utils/AppError.js';
import { getAllUsers, getUserById } from './userService.js';

// Matching-er niyom: frontend-er matchingAlgorithm.js-er hubohu ekoi.
//   - se ami-ke kichu shekhate pare (ami je skill shikhte chai)
//   - ami take kichu shekhate pari
// Duitoi thakle "mutual", ekta thakle "one-way".
function getMatchInfo(me, other) {
  const myTeachIds = me.teaches.map((t) => t.skillId);
  const theirTeachIds = other.teaches.map((t) => t.skillId);

  const theyCanTeachMe = theirTeachIds.filter((id) => me.learns.includes(id));
  const iCanTeachThem = myTeachIds.filter((id) => other.learns.includes(id));

  const isMutual = theyCanTeachMe.length > 0 && iCanTeachThem.length > 0;

  const totalWanted = me.learns.length + other.learns.length;
  const matchedCount = theyCanTeachMe.length + iCanTeachThem.length;
  const score = totalWanted === 0 ? 0 : Math.round((matchedCount / totalWanted) * 100);

  return { theyCanTeachMe, iCanTeachThem, isMutual, score };
}

// Amar shathe kono-na-kono match ache emon shob user, score besi hole age.
export async function getMatchesForUser(userId) {
  const me = await getUserById(userId);
  if (!me) throw new AppError('User not found.', 404);

  const users = await getAllUsers();

  return users
    .filter((other) => other.id !== userId)
    .map((other) => ({ user: other, ...getMatchInfo(me, other) }))
    .filter((match) => match.theyCanTeachMe.length > 0 || match.iCanTeachThem.length > 0)
    .sort((a, b) => b.score - a.score);
}