function notFoundHandler(req, res) {
    return res.status(404).json({
        success: false,
        message: 'Route not found'
    });
}

function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    if (error.type === 'entity.parse.failed') {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON payload'
        });
    }

    console.error(error);

    return res.status(500).json({
        success: false,
        message: 'Internal Server Error'
    }
    );
}

module.exports = {
    notFoundHandler,
    errorHandler
}