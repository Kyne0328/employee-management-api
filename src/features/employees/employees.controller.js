const {
    getEmployees,
    insertEmployee,
    updateEmployeeById,
    deleteEmployeeById
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

async function updateEmployee(req, res) {
    const { employeeId } = req.validated.params;

    const row = await updateEmployeeById(
        employeeId,
        req.validated.body,
    );

    if (!row) {
        return res.status(404).json({
            success: false,
            message: 'Employee not found.',
        });
    }

    const employee = mapEmployeeRow(row);

    return res.status(200).json({
        success: true,
        message: 'Employee updated successfully.',
        data: employee,
    });
}

async function deleteEmployee(req, res) {
    const { employeeId } = req.validated.params;

    const deletedEmployee = await deleteEmployeeById(employeeId);

    if (!deletedEmployee) {
        return res.status(404).json({
            success: false,
            message: 'Employee not found.',
        });
    }

    return res.status(200).json({
        success: true,
        data: {
            employeeId: Number(deletedEmployee.employeeId),
        },
    })
}

module.exports = {
    getEmployeesList,
    createEmployee,
    updateEmployee,
    deleteEmployee,
}