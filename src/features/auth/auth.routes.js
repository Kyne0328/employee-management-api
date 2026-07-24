const express = require('express');

const {
    getCurrentUser,
    login,
    logout,
    register,
} = require('./auth.controller');

const {
    loginSchema,
    registerSchema,
} = require('./auth.validation');

const { validateRequest } = require('../../middleware/validateRequest');

const router = express.Router();

router.post(
    '/register',
    validateRequest(registerSchema),
    register,
);

router.post(
    '/login',
    validateRequest(loginSchema),
    login,
);

router.get('/current', getCurrentUser);

router.post('/logout', logout);

module.exports = router;