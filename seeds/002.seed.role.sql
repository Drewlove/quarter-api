TRUNCATE TABLE role
RESTART IDENTITY CASCADE;

INSERT INTO role
    (role_name, department_id)
VALUES
    ('production', 3),
    ('register', 2),
    ('sous chef', 1),
    ('head chef', 1),
    ('line prep', 2),
    ('doughs', 3),
    ('lead production', 3),
    ('expediter', 2);



    
