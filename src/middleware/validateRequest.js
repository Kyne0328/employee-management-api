function validateRequest(schema) {
  return function requestValidationMiddleware(req, res, next) {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join('.') || 'request',
        message: issue.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Request validation failed.',
        errors,
      });
    }

    req.validated = result.data;

    return next();
  };
}

module.exports = {
  validateRequest,
};