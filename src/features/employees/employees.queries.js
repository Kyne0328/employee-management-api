const { pool } = require('../../config/database');

async function getEmployees(req, res) {
    const result = await pool.query(`
        SELECT employee.employee_id AS "employeeId",
            employee.first_name AS "firstName",
            employee.last_name AS "lastName",
            employee.position_id AS "positionId",
            employee.emp_status AS "empStatus",
            position.position_name AS "positionName",
            department.department_id AS "departmentId",
            department.department_name AS "departmentName",
            TO_CHAR(employee.emp_join_date, 'YYYY-MM-DD') AS "empJoinDate"
            FROM employees AS employee
            INNER JOIN positions AS position 
                ON employee.position_id = position.position_id
            INNER JOIN departments as department 
                ON department.department_id = position.department_id
            ORDER BY 
                employee.last_name ASC, 
                employee.first_name ASC, 
                employee.employee_id ASC
        `);
    return result.rows;
}

async function insertEmployee({
    firstName,
    lastName,
    positionId,
    empStatus,
    empJoinDate,
}) {
    const result = await pool.query(
        `
      WITH inserted_employee AS (
        INSERT INTO employees (
          first_name,
          last_name,
          position_id,
          emp_status,
          emp_join_date
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          employee_id,
          first_name,
          last_name,
          position_id,
          emp_status,
          emp_join_date
      )
      SELECT
        employee.employee_id AS "employeeId",
        employee.first_name AS "firstName",
        employee.last_name AS "lastName",
        employee.position_id AS "positionId",
        position.position_name AS "positionName",
        department.department_id AS "departmentId",
        department.department_name AS "departmentName",
        employee.emp_status AS "empStatus",
        TO_CHAR(
          employee.emp_join_date,
          'YYYY-MM-DD'
        ) AS "empJoinDate"
      FROM inserted_employee AS employee
      INNER JOIN positions AS position
        ON position.position_id = employee.position_id
      INNER JOIN departments AS department
        ON department.department_id = position.department_id
    `,
        [
            firstName,
            lastName,
            positionId,
            empStatus,
            empJoinDate,
        ],
    );
    return result.rows[0];
}
module.exports = {
    getEmployees,
    insertEmployee,
}