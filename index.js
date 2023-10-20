const mysql = require('mysql2');
const inquirer = require('inquirer');
const functions = require('./javascript/functions.js');
depChoices = ['sales', 'engineering', 'finance', 'legal']
randQuestion = {
    name: 'department',
    type: 'input',
    message: 'Which department is this role in?'
}
//Create a connection to mysql db
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysqlpass',
    database: 'company_db',
    multipleStatements: true
});
//connects to db
db.connect((err) => {
    if (err) {
        console.log('Error connecting to Db')
    }
    console.log('Connection established')
    startPrompt()

})
//Main Menu Prompt
function startPrompt() {
    inquirer.prompt([
        functions.mainQuestion
    ]).then((answer) => {
        const searchQuery = answer.choices
        console.log(answer.choices)
        switch(searchQuery) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'View All Departments':
                viewDepartments();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
        }
    
    })

}
//======== View options
//Show all employees' id, name, title, department, salary and manager
const viewAllEmployees = function () {
    let sql = `SELECT e.id,
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
                LEFT JOIN employee m ON e.manager_id = m.id;`
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(`====================================================================================`);
        console.log(`                                 Current Employees:                                 `);
        console.log(`====================================================================================`);
        console.table(res);
        console.log(`====================================================================================`);
        startPrompt();
    })
};

const viewRoles = function () {
    //correct syntax
    let sql = `select role.id,
             role.title,
             departments.name AS department,
             role.salary
             from role, departments
            where departments.id = role.department_id
            ORDER BY role.department_id;`
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(`====================================================================================`);
        console.log(`                                 Current Roles:                                 `);
        console.log(`====================================================================================`);
        console.table(res);
        console.log(`====================================================================================`);
        startPrompt();    })
};

const viewDepartments = function () {
    let sql = `SELECT * FROM departments;`
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(`====================================================================================`);
        console.log(`                                 Departments                                        `);
        console.log(`====================================================================================`);
        console.table(res);
        console.log(`====================================================================================`);
        startPrompt();    })
};


//====== Adding to tables
const addEmployee = function () {
    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'What is the employees first name?'
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'What is the employees last name?'
        },
    ]).then((answer)=> {
        let employeeData = Object.values(answer)
        roleSql = 'SELECT id, title FROM role'
        db.query(roleSql, (err, result) => {  
            if (err) throw err;  
            let roleArr = res.map(({id, title}) => 
                ({ name: title, value: id}));
        inquirer.prompt([
            {
            name: 'role',
            type: 'list',
            choices: roleArr
            }
        ]).then((answer)=>{
            employeeData.push(answer.role)
            managerSql = `SELECT id, CONCAT(first_name, ' ', last_name) AS manager FROM employee`
            db.query(managerSql, (err, result) => {  
                if (err) throw err;
                let managerArr = res.map(({id, manager}) => ({name: manager, value: id}))
                managerArr.unshift({name: "None", value: null})
                inquirer.prompt([
                    {
                        name: 'manager',
                        type: 'list',
                        message: `Who is the employee's manager`,
                        choices: managerArr
                    }
                ]).then((answer)=> {
                    employeeData.push(answer.manager)
                    addEmpSql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUE(?, ?, ?, ?)`
                    db.query(addEmpSql, employeeData, (err, result) => {
                        if (err) throw err;
                        console.log(`${employeeData[0]} ${employeeData[1]} has been added to the database`);
                        viewAllEmployees()
                    })
                })
            })
        })  
        })
    })
};

const addRole = function () {
    sql = `SELECT * FROM departments`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        let depChoices = res.map(({id, name}) => ({name: name, value: id}));
        inquirer.prompt([
            {
                name: 'department',
                type: 'list',
                message: 'Which department is this role in?',
                choices: depChoices
            },
            {
                name: 'title',
                type: 'input',
                message: 'what is the name of the new role'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the position`s salary'
            }
        ]).then((answer) => {
            let roleData = Object.values(answer)
            let addRoleSql = `INSERT INTO role (department_id, title, salary) VALUES (?, ?, ?)`
            db.query(addRoleSql, roleData, (err, result) => {
                if (err) throw err;
                console.log(`${roleData[1]} added to the roles table`)
                viewRoles()
            })
        })

    })
}
const addDepartment = function () {
    inquirer.prompt([
        {
            name: 'department',
            type: 'input',
            message: 'What is the name of the department?'
        }
    ]).then((answer) => {
        sql = `INSERT INTO departments(name) VALUE (?);`
        db.query(sql, answer.department, (err, result) => {
            if (err) throw err            
            console.log(`${answer.department} has been added to the list of departments`)
            viewDepartments()
        })
    })
}



