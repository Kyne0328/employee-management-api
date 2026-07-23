const express = require('express');

const {
    getDepartments,
} = require('./departments.controller');

const router = express.Router();

router.get('/', getDepartments);

module.exports = router;