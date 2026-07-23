const app = require('./app');
const {pool} = require('./config/database');
const {env} = require('./config/environment');

const server = app.listen(env.PORT, () => {
  console.log(
    `Employee Management API listening on http://localhost:${env.PORT}`,
  );
});

let shuttingDown = false;

function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log(`${signal} received. Closing server.`);

  server.close(async (serverError) => {
    if (serverError) {
      console.error(
        'Failed to close the HTTP server cleanly.',
        serverError,
      );
      process.exit(1);
    }

    try {
      await pool.end();
      console.log('PostgreSQL connection pool closed.');
      process.exit(0);
    } catch (databaseError) {
      console.error(
        'Failed to close the PostgreSQL connection pool.',
        databaseError,
      );
      process.exit(1);
    }
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
