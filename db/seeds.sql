-- Insert sample departments
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Finance');
INSERT INTO department (name) VALUES ('Engineering');

-- Insert sample roles
INSERT INTO role (title, salary, department_id) VALUES ('Sales Manager', 70000.00, 1);
INSERT INTO role (title, salary, department_id) VALUES ('Accountant', 60000.00, 2);
INSERT INTO role (title, salary, department_id) VALUES ('Software Engineer', 80000.00, 3);

-- Insert sample employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('John', 'Doe', 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Jane', 'Smith', 2, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('Alice', 'Johnson', 3, 1);
