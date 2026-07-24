function requireAuth(req, res, next) {
  if (!req.session?.user?.userId) {
    return res.status(401).json({
      success: false,
      message: 'Authentication is required.',
    });
  }

  return next();
}

module.exports = {
  requireAuth,
};
