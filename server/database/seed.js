import bcrypt from 'bcrypt';
import { pool } from '../config/db.js';
import * as data from './seedData.js';

// Ekta helper: ek table-e onek row ekshathe dhokay.
// INSERT ... VALUES ? te nested array dile mysql2 nijei bulk insert baniye dey.
async function insertRows(connection, sql, rows) {
  if (rows.length > 0) await connection.query(sql, [rows]);
}

async function seed() {
  const connection = await pool.getConnection();

  try {
    const [[{ total }]] = await connection.query('SELECT COUNT(*) AS total FROM users');
    if (total > 0) {
      console.log('⚠️  Database already has data. Run "npm run db:reset" to start fresh.');
      return;
    }

    // Transaction: shob insert hoy, na hole kichui hoy na.
    await connection.beginTransaction();

    await insertRows(
      connection,
      'INSERT INTO categories (id, name) VALUES ?',
      data.categories.map((name, index) => [index + 1, name])
    );

    await insertRows(
      connection,
      'INSERT INTO skills (id, name, category_id) VALUES ?',
      data.skills.map(([name, category], index) => [
        index + 1,
        name,
        data.categories.indexOf(category) + 1,
      ])
    );

    // Password kokhono plain text-e save hoy na. bcrypt diye hash kore save kori.
    const userRows = [];
    for (const user of data.users) {
      const passwordHash = await bcrypt.hash(user.password, 10);
      userRows.push([
        user.id,
        user.name,
        user.email,
        passwordHash,
        user.role,
        user.bio,
        user.location,
        user.color,
        user.joinedAt,
      ]);
    }
    await insertRows(
      connection,
      'INSERT INTO users (id, name, email, password_hash, role, bio, location, avatar_color, created_at) VALUES ?',
      userRows
    );

    await insertRows(
      connection,
      'INSERT INTO user_skills (user_id, skill_id, type, level) VALUES ?',
      data.users.flatMap((user) => [
        ...user.teaches.map(([skillId, level]) => [user.id, skillId, 'teach', level]),
        ...user.learns.map((skillId) => [user.id, skillId, 'learn', null]),
      ])
    );

    await insertRows(
      connection,
      'INSERT INTO exchange_requests (id, from_user_id, to_user_id, offered_skill_id, requested_skill_id, message, status, created_at, responded_at) VALUES ?',
      data.requests
    );
    await insertRows(
      connection,
      'INSERT INTO sessions (id, request_id, teacher_id, learner_id, skill_id, session_date, session_time, duration_mins, mode, location, notes, status, created_at, completed_at) VALUES ?',
      data.sessions
    );
    await insertRows(
      connection,
      'INSERT INTO reviews (id, session_id, reviewer_id, reviewee_id, skill_id, rating, comment, created_at) VALUES ?',
      data.reviews
    );
    await insertRows(
      connection,
      'INSERT INTO notifications (id, user_id, message, link, is_read, created_at) VALUES ?',
      data.notifications
    );
    await insertRows(
      connection,
      'INSERT INTO projects (id, owner_id, title, description, github_url, demo_url, created_at) VALUES ?',
      data.projects
    );
    await insertRows(
      connection,
      'INSERT INTO project_skills (project_id, skill_id) VALUES ?',
      data.projectSkills
    );
    await insertRows(
      connection,
      'INSERT INTO project_members (project_id, user_id, role) VALUES ?',
      data.projectMembers
    );
    await insertRows(
      connection,
      'INSERT INTO project_likes (project_id, user_id) VALUES ?',
      data.projectLikes
    );
    await insertRows(
      connection,
      'INSERT INTO project_comments (project_id, user_id, text, created_at) VALUES ?',
      data.projectComments
    );
    await insertRows(
      connection,
      'INSERT INTO contributions (project_id, user_id, description, hours, created_at) VALUES ?',
      data.contributions
    );

    await connection.commit();

    console.log('✅ Database seeded. Rows per table:');
    const tables = [
      'users',
      'categories',
      'skills',
      'user_skills',
      'exchange_requests',
      'sessions',
      'reviews',
      'notifications',
      'projects',
      'project_members',
      'contributions',
    ];
    for (const table of tables) {
      const [[{ count }]] = await connection.query(`SELECT COUNT(*) AS count FROM ${table}`);
      console.log(`   ${table}: ${count}`);
    }
  } catch (error) {
    await connection.rollback();
    console.error('❌ Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    connection.release();
    await pool.end();
  }
}

seed();