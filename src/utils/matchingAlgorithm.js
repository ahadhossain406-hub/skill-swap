// Duijon user-er moddhe skill match ber kore.
//
// Mutual match mane duita shorto-i shotti:
//   1. Se ami-ke kichu shekhate pare (ami je skill shikhte chai, se seta shekhay)
//   2. Ami take kichu shekhate pari (se je skill shikhte chay, ami seta shekhai)
export function getMatchInfo(me, other) {
  const myTeachIds = me.teaches.map((t) => t.skillId);
  const theirTeachIds = other.teaches.map((t) => t.skillId);

  // Je skill gulo se ami-ke shekhate pare
  const theyCanTeachMe = theirTeachIds.filter((id) => me.learns.includes(id));

  // Je skill gulo ami take shekhate pari
  const iCanTeachThem = myTeachIds.filter((id) => other.learns.includes(id));

  const isMutual = theyCanTeachMe.length > 0 && iCanTeachThem.length > 0;

  // Score = duijon mile joto skill shikhte chay, tar moddhe koto-ta mile gele.
  const totalWanted = me.learns.length + other.learns.length;
  const matchedCount = theyCanTeachMe.length + iCanTeachThem.length;
  const score = totalWanted === 0 ? 0 : Math.round((matchedCount / totalWanted) * 100);

  return { theyCanTeachMe, iCanTeachThem, isMutual, score };
}

// Shob user-er moddhe jader sathe kono-na-kono match ache, tader list.
// Score besi hole ager-e dekhabe.
export function findMatches(me, users) {
  return users
    .filter((u) => u.id !== me.id)
    .map((other) => ({ user: other, ...getMatchInfo(me, other) }))
    .filter((m) => m.theyCanTeachMe.length > 0 || m.iCanTeachThem.length > 0)
    .sort((a, b) => b.score - a.score);
}