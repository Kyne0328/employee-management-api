const app = require('./app');
const { env } = require('./config/environment');

const server = app.listen(env.PORT, () => {
    console.log(`server is running on ${env.CLIENT_ORIGIN}`
    );
});

function shutdown(signal) {
    console.log(`Received ${signal}. Shutting down gracefully...`);

    server.close(() => {
        if (error) {
            console.error('Error during server shutdown:', error);
            process.exit(1);
        }
        process.exit(0);
    });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));