const mysql = require('mysql');
const inquirer = require('inquirer');
const Ctable = require('console.table');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Thetree94%',
    database: 'employee_db'
});

function runApp() {
    inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            choices: ['View employees', 'View employees by role', 'View employees by manager', 'Add employee', 'Add departmet', 'Add role', 'Delete employee'],
            name: 'choice'
        }).then(function(data){
            switch (data.choice) {
                case 'Add employee':
                    addEmployee();
                break;
                case 'Add departmet':
                    addDepartment();
                break;
                case 'Add role':
                    addRole();
                break;
            }
        })
};

function addDepartment() {
    inquirer
        .prompt([{
            type: 'input',
            message: "What is the department name?",
            name: 'department_name'
        }
    ]).then(function(data){
        var department = { name: data.department_name }
        connection.query('INSERT INTO department SET ?', department, function(err){
            if(err) throw err;

            console.log("Added department!")
            runApp();
        })

    })
};

function addRole(){
    connection.query('SELECT * FROM department', function(err, results){
        if(err) throw err;

        inquirer
            .prompt([
                {
                    type: 'rawlist',
                    message: 'What department does this role belong to?',
                    choices: function(){
                        var choiceArry = []
                        for(var i = 0; i < results.length; i++){
                            choiceArry.push(results[i].name)
                        }
                        return choiceArry
                    },
                    name: 'choice'
                },
                {
                    type: 'input',
                    message: 'What is the title of this role?',
                    name: 'title'
                },
                {
                    type: 'input',
                    message: 'What is the salary of this role?',
                    name: 'salary'
                }
            ]).then(function(data){
                var role = {
                    title: data.title,
                    salary: data.salary,
                    department_id: data.choice
                }
                connection.query("INSERT INTO role SET ?", role,  function(err, result){
                    if(err) throw err;
                    console.log('Added new role!');
                    runApp();
                })
                
            })
    })
}

connection.connect(function(err){
    if(err){
        console.log('error connecting: ' + err.stack);
        return;
    }
    console.log('Connected as id ' + connection.threadId)
});

runApp();

