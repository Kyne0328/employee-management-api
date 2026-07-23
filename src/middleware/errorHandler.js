function notFoundHandler(req, res) {
  return res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      message: 'Request body must contain valid JSON.',
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: 'An unexpected server error occurred.',
  });
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
