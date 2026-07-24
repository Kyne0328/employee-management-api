const {pool} = require('../../config/database');

async function insertUser({username, passwordHash}) {
  const result = await pool.query(
    `
      INSERT INTO users (
        username,
        password_hash
      )
      VALUES ($1, $2)
      RETURNING
        user_id AS "userId",
        username,
        created_at AS "createdAt"
    `,
    [username, passwordHash],
  );

  return result.rows[0];
}

async function findUserByUsername(username) {
  const result = await pool.query(
    `
      SELECT
        user_id AS "userId",
        username,
        password_hash AS "passwordHash"
      FROM users
      WHERE username = $1
    `,
    [username],
  );

  return result.rows[0] ?? null;
}

async function findUserById(userId) {
  const result = await pool.query(
    `
      SELECT
        user_id AS "userId",
        username
      FROM users
      WHERE user_id = $1
    `,
    [userId],
  );

  return result.rows[0] ?? null;
}

module.exports = {
  findUserById,
  findUserByUsername,
  insertUser,
};
