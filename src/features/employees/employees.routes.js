const express = require('express');

const {
    getEmployeesList,
    createEmployee,
} = require('./employees.controller');

const createEmployeeSchema = require('./employees.validation');

const { validateRequest } = require('../../middleware/validateRequest');

const router = express.Router();

router.get('/', getEmployeesList);
router.post('/', validateRequest(createEmployeeSchema), createEmployee);

module.exports = router;