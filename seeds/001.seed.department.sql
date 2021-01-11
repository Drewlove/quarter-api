TRUNCATE department RESTART
IDENTITY CASCADE;

INSERT INTO department
    (department_name)
VALUES
    ('kitchen'),
    ('service'),
    ('bagel production'); 
