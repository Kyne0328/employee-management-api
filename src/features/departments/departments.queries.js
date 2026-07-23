const { pool } = require('../../config/database');

async function findAllDepartmentsWithPositions() {
    const result = await pool.query(`
        SELECT department.department_id AS "departmentId",
            department.department_name AS "departmentName",
            position.position_id as "positionId",
            position.position_name AS "positionName"  
        FROM departments department
        LEFT JOIN positions position ON position.department_id = department.department_id
        ORDER BY department.department_name ASC, position.position_name ASC
        `)
    return result.rows;
}

module.exports = {
    findAllDepartmentsWithPositions,
};