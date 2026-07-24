const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const {checkDatabaseConnection} = require('./config/database');
const {env} = require('./config/environment');
const {sessionMiddleware} = require('./config/session');
const authRoutes = require('./features/auth/auth.routes');
const departmentRoutes = require(
  './features/departments/departments.routes',
);
const employeeRoutes = require(
  './features/employees/employees.routes',
);
const {
  errorHandler,
  notFoundHandler,
} = require('./middleware/errorHandler');
const {requireAuth} = require('./middleware/requireAuth');

const app = express();

if (env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

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
app.use(sessionMiddleware);

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

app.use('/api/auth', authRoutes);
app.use('/api/departments', requireAuth, departmentRoutes);
app.use('/api/employees', requireAuth, employeeRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
