const { getAllDepartmentsWithPositions } = require('./departments.queries');

async function getDepartments(req, res) {
    const rows = await getAllDepartmentsWithPositions();

    const departments = new Map();

    for (const row of rows) {
        const departmentId = Number(row.departmentId);

        if (!departments.has(departmentId)) {
            departments.set(departmentId, {
                departmentId: departmentId,
                departmentName: row.departmentName,
                positions: [],
            });
        }

        if (row.positionId !== null) {
            departments.get(departmentId).positions.push({
                positionId: Number(row.positionId),
                positionName: row.positionName,
            });
        }
    }

    const departmentsArray = Array.from(departments.values());

    return res.status(200).json({
        success: true,
        data: departmentsArray,
    });
}

module.exports = {
    getDepartments,
}