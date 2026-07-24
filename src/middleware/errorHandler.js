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

  if (
    error.code === '23503' && error.constraint === 'employees_position_id_fkey'
  ) {
    return res.status(400).json({
      success: false,
      message: 'Invalid position ID.',
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
