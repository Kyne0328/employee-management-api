const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const {checkDatabaseConnection} = require('./config/database');
const {env} = require('./config/environment');
const {
  errorHandler,
  notFoundHandler,
} = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

app.use(
  express.json({
    limit: '100kb',
  }),
);

app.get('/api/health', async (req, res) => {
  const database = await checkDatabaseConnection();

  return res.status(200).json({
    success: true,
    status: 'ok',
    service: 'employee-management-api',
    database: {
      status: 'connected',
      time: database.databaseTime,
    },
    timestamp: new Date().toISOString(),
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
