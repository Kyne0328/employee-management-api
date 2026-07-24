const {
    getEmployees,
    insertEmployee,
} = require('./employees.queries');

function mapEmployeeRow(row) {
    return {
        employeeId: Number(row.employeeId),
        firstName: row.firstName,
        lastName: row.lastName,
        positionId: Number(row.positionId),
        positionName: row.positionName,
        departmentId: Number(row.departmentId),
        departmentName: row.departmentName,
        empStatus: row.empStatus,
        empJoinDate: row.empJoinDate,
    };
}

async function getEmployeesList(req, res) {
    const rows = await getEmployees(req, res);

    const employees = rows.map(mapEmployeeRow);

    return res.status(200).json({
        success: true,
        data: employees,
    })
}

async function createEmployee(req, res) {
  const row = await insertEmployee(req.validated.body);
  const employee = mapEmployeeRow(row);

  return res.status(201).json({
    success: true,
    message: 'Employee created successfully.',
    data: employee,
  });
}

module.exports = {
    getEmployeesList,
    createEmployee,
}