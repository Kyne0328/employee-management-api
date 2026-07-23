const {Pool} = require('pg');

const {env} = require('./environment');

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
});

pool.on('error', (error) => {
  console.error('Unexpected PostgreSQL pool error.', error);
});

async function checkDatabaseConnection() {
  const result = await pool.query(
    'SELECT NOW() AS "databaseTime"',
  );

  return result.rows[0];
}

module.exports = {
  pool,
  checkDatabaseConnection,
};
