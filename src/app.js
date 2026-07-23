const cors = require('cors');
const express = require('express');
const helmet = require('helmet');

const { env } = require('./config/environment');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(
    cors({
        origin: env.CLIENT_ORIGIN,
        credentials: true
    })
);

app.use(express.json());

app.get('/api/health', (req, res) => {
    return res.status(200).json({
        success: true,
        status: 'OK',
        service: 'Employee Management API',
        timestamp: new Date().toISOString()
    });
});

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;