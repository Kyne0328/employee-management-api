const express = require('express');

const {
    getEmployeesList,
    createEmployee,
    updateEmployee,
    deleteEmployee,
} = require('./employees.controller');

const {
    createEmployeeSchema,
    updateEmployeeSchema,
    deleteEmployeeSchema,
} = require('./employees.validation');

const { validateRequest } = require('../../middleware/validateRequest');

const router = express.Router();

router.get('/', getEmployeesList);
router.post('/', validateRequest(createEmployeeSchema), createEmployee);
router.put('/:employeeId', validateRequest(updateEmployeeSchema), updateEmployee);
router.delete('/:employeeId', validateRequest(deleteEmployeeSchema), deleteEmployee);

module.exports = router;