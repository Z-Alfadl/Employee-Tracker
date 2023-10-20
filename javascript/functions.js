const mainQuestion = {
    name: 'choices',
    type: 'list',
    message: 'What would you like to do',
    choices: [
        { name: 'View All Employees' },
        { name: 'View All Roles' },
        { name: 'View All Departments' },
        { name: 'Add Employee' },
        { name: 'Add Role' },
        { name: 'Add Department' },
    ]
}



            // { name: 'View All Employees'} DONE------------------------,
            // {name: 'Add Employee'},
            // {name: 'View All Roles'} DONE --------------------,
            // {name: 'Add Role'},
            // {name: 'View All Departments}, DONE---------,
            // {name: 'Add Department'},
module.exports = {mainQuestion};