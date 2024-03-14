INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");
       
INSERT INTO role (title, salary, department_id)
VALUES 
("Salesperson", 80000, 1),
("Lead Engineer", 150000, 2),
("Software Engineer", 120000, 2),
("Account Manager", 160000, 1),
("Accountant", 125000, 3),
("Legal Team lead", 250000, 4),
("Lawyer", 190000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("MIke", "Chan", 1, NULL),
("Ashely", "Rodrigues", 2, NULL),
("Kevin", "Tupik", 2, 2),
("Kunal", "Singh", 1, NULL),
("Malia", "Brown", 3, 1),
("Sarah", "Lourd", 4, NULL),
("Tom", "Allen", 4, 4);



























