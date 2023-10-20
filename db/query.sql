SELECT e.id,
       concat(e.first_name, ' ', e.last_name) AS employee,
       role.title,
       departments.name AS department,
       role.salary,
       concat(m.first_name, ' ', m.last_name) AS manager
       FROM employee e
       JOIN role
       ON e.role_id = role.id
       JOIN departments
       ON departments.id = role.department_id
       LEFT JOIN employee m ON e.manager_id = m.id;
    --    role.title,
    --    departments.name,
    --    role.salary,
    --    WHERE employee.role_id = role.id
    --    AND departments.id = role.department_id;

-- SELECT concat(e.first_name, ' ', e.last_name) AS employee, 
--        concat(m.first_name, ' ', m.last_name) AS manager
--     FROM employee e
--     LEFT JOIN employee m
--     ON e.manager_id = m.id;

-- SELECT e.first_name AS Employee,
--         (m.first_name) AS Manager
--         FROM employee e
--         JOIN employee m on e.manager_id = m.id;