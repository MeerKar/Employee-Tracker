// Dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
require("dotenv").config();
const consoleTable = require("console.table");
// const app = express();
const PORT = process.env.PORT || 3001;

// Connect to database
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

console.log(`Connected to the employees_db database.`);

db.connect(function (err) {
  if (err) throw err;
  console.log("**************************************");
  console.log("           EMPLOYEE TRACKER           ");
  console.log("**************************************");
  Question();
});

// Prompt Question
function Question() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "intro",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View All Roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then((answer) => {
      switch (answer.intro) {
        case "View All Employees":
          viewEmployees();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Update Employee Role":
          updateRole();
          break;
        case "View All Roles":
          viewRoles();
          break;
        case "Add Role":
          addRole();
          break;
        case "View All Departments":
          viewDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        case "Quit":
          console.log("Bye!");
          db.end();
          break;
      }
    });
}

// Viewing
function viewDepartments() {
  const sql = `SELECT department.id, department.name AS Department FROM department;`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(res);
    Question();
  });
}

function viewRoles() {
  const sql = `SELECT role.id, role.title AS role, role.salary, department.name AS department FROM role INNER JOIN department ON (department.id = role.department_id);`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(res);
    Question();
  });
}

function viewEmployees() {
  const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN role ON (role.id = employee.role_id) INNER JOIN department ON (department.id = role.department_id) ORDER BY employee.id;`;
  db.query(sql, (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(res);
    Question();
  });
}

// Adding
function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "department",
        message: "What is the name of the department?",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department(name) VALUES('${answer.department}');`;
      db.query(sql, (err, res) => {
        if (err) {
          console.log(err);
          return;
        }
        console.log("Added " + answer.department + " to the database");
        Question();
      });
    });
}

function addRole() {
  const sql2 = `SELECT * FROM department`;
  db.query(sql2, (error, response) => {
    departmentList = response.map((departments) => ({
      name: departments.name,
      value: departments.id,
    }));
    return inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "department",
          message: "Which Department does the role belong to?",
          choices: departmentList,
        },
      ])
      .then((answers) => {
        const sql = `INSERT INTO role SET title='${answers.title}', salary= ${answers.salary}, department_id= ${answers.department};`;
        db.query(sql, (err, res) => {
          if (err) {
            console.log(err);
            return;
          }
          console.log("Added " + answers.title + " to the database");
          Question();
        });
      });
  });
}

function addEmployee() {
  const sql2 = `SELECT * FROM employee`;
  db.query(sql2, (error, response) => {
    employeeList = response.map((employees) => ({
      name: employees.first_name.concat(" ", employees.last_name),
      value: employees.id,
    }));

    const sql3 = `SELECT * FROM role`;
    db.query(sql3, (error, response) => {
      roleList = response.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      return inquirer
        .prompt([
          {
            type: "input",
            name: "first",
            message: "What is the employee's first name?",
          },
          {
            type: "input",
            name: "last",
            message: "What is the employee's last name?",
          },
          {
            type: "list",
            name: "role",
            message: "What is the employee's role?",
            choices: roleList,
          },
          {
            type: "list",
            name: "manager",
            message: "Who is the employee's manager?",
            choices: employeeList,
          },
        ])
        .then((answers) => {
          const sql = `INSERT INTO employee SET first_name='${answers.first}', last_name= '${answers.last}', role_id= ${answers.role}, manager_id=${answers.manager};`;
          db.query(sql, (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log(
              "Added " + answers.first + " " + answers.last + " to the database"
            );
            Question();
          });
        });
    });
  });
}

// Updating
function updateRole() {
  const sql2 = `SELECT * FROM employee`;
  db.query(sql2, (error, response) => {
    employeeList = response.map((employees) => ({
      name: employees.first_name.concat(" ", employees.last_name),
      value: employees.id,
    }));
    const sql3 = `SELECT * FROM role`;
    db.query(sql3, (error, response) => {
      roleList = response.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      return inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which employee's role do you want to update?",
            choices: employeeList,
          },
          {
            type: "list",
            name: "role",
            message: "Which role do you want to assign the selected employee?",
            choices: roleList,
          },
          {
            type: "list",
            name: "manager",
            message: "Who will be this employee's manager?",
            choices: employeeList,
          },
        ])
        .then((answers) => {
          const sql = `UPDATE employee SET role_id= ${answers.role}, manager_id=${answers.manager} WHERE id =${answers.employee};`;
          db.query(sql, (err, res) => {
            if (err) {
              console.log(err);
              return;
            }
            console.log("Employee role updated");
            Question();
          });
        });
    });
  });
}
