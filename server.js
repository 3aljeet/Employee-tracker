const inquirer = require('inquirer');
const connection = require('./config/connection');

// Function to connect to the database
const connectDB = () => {
  return new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        reject(err);
      } else {
        console.log('Connected to MySQL database');
        resolve();
      }
    });
  });
};

// Function to view all departments
const viewDepartments = async () => {
  const [departments] = await connection.promise().query('SELECT * FROM department');
  console.table(departments);
};

// Function to view all roles
const viewRoles = async () => {
  const [roles] = await connection.promise().query('SELECT * FROM role');
  console.table(roles);
};

// Function to view all employees
const viewEmployees = async () => {
  const [employees] = await connection.promise().query('SELECT * FROM employee');
  console.table(employees);
};

// Function to add a department
const addDepartment = async () => {
  const department = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    },
  ]);

  await connection.promise().query('INSERT INTO department (name) VALUES (?)', [department.name]);
  console.log('Department added successfully!');
};

// Function to add a role
const addRole = async () => {
  const departments = await connection.promise().query('SELECT * FROM department');
  const role = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the name of the role:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the salary for the role:',
    },
    {
      type: 'list',
      name: 'department_id',
      message: 'Select the department for the role:',
      choices: departments[0].map((dept) => ({ name: dept.name, value: dept.id })),
    },
  ]);

  await connection
    .promise()
    .query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [
      role.title,
      role.salary,
      role.department_id,
    ]);
  console.log('Role added successfully!');
};

// Function to add an employee
const addEmployee = async () => {
  const roles = await connection.promise().query('SELECT * FROM role');
  const employees = await connection.promise().query('SELECT * FROM employee');
  const employee = await inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'Enter the employee\'s first name:',
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'Enter the employee\'s last name:',
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the employee\'s role:',
      choices: roles[0].map((role) => ({ name: role.title, value: role.id })),
    },
    {
      type: 'list',
      name: 'manager_id',
      message: 'Select the employee\'s manager:',
      choices: [
        { name: 'None', value: null },
        ...employees[0].map((emp) => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
      ],
    },
  ]);

  await connection
    .promise()
    .query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [
      employee.first_name,
      employee.last_name,
      employee.role_id,
      employee.manager_id,
    ]);
  console.log('Employee added successfully!');
};

// Function to update an employee role
const updateEmployeeRole = async () => {
  const employees = await connection.promise().query('SELECT * FROM employee');
  const roles = await connection.promise().query('SELECT * FROM role');
  const updateInfo = await inquirer.prompt([
    {
      type: 'list',
      name: 'employee_id',
      message: 'Select the employee to update:',
      choices: employees[0].map((emp) => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id })),
    },
    {
      type: 'list',
      name: 'role_id',
      message: 'Select the new role for the employee:',
      choices: roles[0].map((role) => ({ name: role.title, value: role.id })),
    },
  ]);

  await connection
    .promise()
    .query('UPDATE employee SET role_id = ? WHERE id = ?', [updateInfo.role_id, updateInfo.employee_id]);
  console.log('Employee role updated successfully!');
};

// Start the application
const startApp = async () => {
  await connectDB();

  while (true) {
    const { action } = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit',
        ],
      },
    ]);

    switch (action) {
      case 'View all departments':
        await viewDepartments();
        break;
      case 'View all roles':
        await viewRoles();
        break;
      case 'View all employees':
        await viewEmployees();
        break;
      case 'Add a department':
        await addDepartment();
        break;
      case 'Add a role':
        await addRole();
        break;
      case 'Add an employee':
        await addEmployee();
        break;
      case 'Update an employee role':
        await updateEmployeeRole();
        break;
      case 'Exit':
        connection.end();
        process.exit();
    }
  }
};

// Run the application
startApp();
