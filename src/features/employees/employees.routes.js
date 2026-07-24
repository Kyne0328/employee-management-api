const express = require('express');

const {
  createEmployee,
  deleteEmployee,
  getEmployeesList,
  updateEmployee,
} = require('./employees.controller');
const {
  createEmployeeSchema,
  deleteEmployeeSchema,
  updateEmployeeSchema,
} = require('./employees.validation');
const {
  validateRequest,
} = require('../../middleware/validateRequest');

const router = express.Router();

router.get('/', getEmployeesList);
router.post(
  '/',
  validateRequest(createEmployeeSchema),
  createEmployee,
);
router.put(
  '/:employeeId',
  validateRequest(updateEmployeeSchema),
  updateEmployee,
);
router.delete(
  '/:employeeId',
  validateRequest(deleteEmployeeSchema),
  deleteEmployee,
);

module.exports = router;
