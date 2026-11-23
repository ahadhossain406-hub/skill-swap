import { pool } from '../config/db.js';
import AppError from '../utils/AppError.js';

// Database-er row ke frontend-er user object-er moto sajay.
// includeEmail: shudhu nijer data-te email dekhai, onner-ta na.
function formatUser(row, skillRows, { includeEmail = false } = {}) {
  const user = {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    location: row.location,
    avatarColor: row.avatar_color,
    joinedAt: row.created_at,
    teaches: skillRows
      .filter((s) => s.type === 'teach')
      .map((s) => ({ skillId: s.skill_id, level: s.level })),
    learns: skillRows.filter((s) => s.type === 'learn').map((s) => s.skill_id),
  };
  if (includeEmail) user.email = row.email;
  return user;
}

// Onek user-er skill ekshathe ekta query-te ane (protita user-er jonno alada query na).
async function loadSkillRows(userIds) {
  if (userIds.length === 0) return [];
  const [rows] = await pool.query(
    'SELECT user_id, skill_id, type, level FROM user_skills WHERE user_id IN (?) ORDER BY id',
    [userIds]
  );
  return rows;
}

async function buildUsers(rows, options) {
  const skillRows = await loadSkillRows(rows.map((r) => r.id));
  return rows.map((row) =>
    formatUser(
      row,
      skillRows.filter((s) => s.user_id === row.id),
      options
    )
  );
}

// Shob user (admin bade).
export async function getAllUsers() {
  const [rows] = await pool.query("SELECT * FROM users WHERE role <> 'admin' ORDER BY id");
  return buildUsers(rows);
}

export async function getUserById(id, options) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  if (rows.length === 0) return null;
  const [user] = await buildUsers(rows, options);
  return user;
}

// Profile update. Shob field optional: jeta pathabe shudhu seta-i bodlabe.
export async function updateProfile(userId, { name, bio, location, teaches, learns }) {
  const connection = await pool.getConnection();

  try {
    // Transaction: skill delete kore notun dhokanor majhkhane error hole purono skill phire ashbe.
    await connection.beginTransaction();

    const fields = {};
    if (name !== undefined) fields.name = name;
    if (bio !== undefined) fields.bio = bio;
    if (location !== undefined) fields.location = location;

    if (Object.keys(fields).length > 0) {
      await connection.query('UPDATE users SET ? WHERE id = ?', [fields, userId]);
    }

    if (teaches !== undefined || learns !== undefined) {
      const [current] = await connection.query(
        'SELECT skill_id, type, level FROM user_skills WHERE user_id = ?',
        [userId]
      );

      // Jeta pathano hoy ni, seta ager moto-i thake.
      const finalTeaches =
        teaches !== undefined
          ? teaches.map((t) => ({ skillId: Number(t.skillId), level: t.level }))
          : current
              .filter((r) => r.type === 'teach')
              .map((r) => ({ skillId: r.skill_id, level: r.level }));
      const finalLearns =
        learns !== undefined
          ? learns.map(Number)
          : current.filter((r) => r.type === 'learn').map((r) => r.skill_id);

      // Ek skill duita list-e ba duibar thakte parbe na.
      const allIds = [...finalTeaches.map((t) => t.skillId), ...finalLearns];
      if (new Set(allIds).size !== allIds.length) {
        throw new AppError('A skill can appear only once, either in teach or in learn.', 400);
      }

      if (allIds.length > 0) {
        const [found] = await connection.query('SELECT id FROM skills WHERE id IN (?)', [allIds]);
        if (found.length !== allIds.length) {
          throw new AppError('One or more skills do not exist.', 400);
        }
      }

      await connection.query('DELETE FROM user_skills WHERE user_id = ?', [userId]);

      const newRows = [
        ...finalTeaches.map((t) => [userId, t.skillId, 'teach', t.level]),
        ...finalLearns.map((id) => [userId, id, 'learn', null]),
      ];
      if (newRows.length > 0) {
        await connection.query(
          'INSERT INTO user_skills (user_id, skill_id, type, level) VALUES ?',
          [newRows]
        );
      }
    }

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return getUserById(userId, { includeEmail: true });
}