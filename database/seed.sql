BEGIN;

INSERT INTO departments (department_name)
VALUES
    ('Information Technology'),
    ('Human Resources'),
    ('Finance'),
    ('Operations'),
    ('Administration')
ON CONFLICT DO NOTHING;

INSERT INTO positions (department_id, position_name)
SELECT
    department.department_id,
    source.position_name
FROM (
    VALUES
        ('Information Technology', 'Software Developer'),
        ('Information Technology', 'Technical Support'),
        ('Human Resources', 'HR Assistant'),
        ('Human Resources', 'Recruitment Assistant'),
        ('Finance', 'Accounting Assistant'),
        ('Finance', 'Payroll Assistant'),
        ('Operations', 'Operations Staff'),
        ('Operations', 'Warehouse Staff'),
        ('Administration', 'Administrative Assistant'),
        ('Administration', 'Records Clerk')
) AS source(department_name, position_name)
JOIN departments AS department
    ON department.department_name = source.department_name
ON CONFLICT DO NOTHING;

INSERT INTO employees (
    first_name,
    last_name,
    position_id,
    emp_status,
    emp_join_date
)
SELECT
    source.first_name,
    source.last_name,
    position.position_id,
    source.emp_status,
    source.emp_join_date::DATE
FROM (
    VALUES
        (
            'Juan',
            'Dela Cruz',
            'Information Technology',
            'Software Developer',
            1,
            '2026-07-21'
        ),
        (
            'Maria',
            'Santos',
            'Human Resources',
            'HR Assistant',
            1,
            '2026-07-14'
        ),
        (
            'Ana',
            'Reyes',
            'Finance',
            'Accounting Assistant',
            0,
            '2026-07-07'
        )
) AS source(
    first_name,
    last_name,
    department_name,
    position_name,
    emp_status,
    emp_join_date
)
JOIN departments AS department
    ON department.department_name = source.department_name
JOIN positions AS position
    ON position.department_id = department.department_id
    AND position.position_name = source.position_name
WHERE NOT EXISTS (
    SELECT 1
    FROM employees AS employee
    WHERE employee.first_name = source.first_name
      AND employee.last_name = source.last_name
      AND employee.position_id = position.position_id
      AND employee.emp_join_date = source.emp_join_date::DATE
);

COMMIT;
