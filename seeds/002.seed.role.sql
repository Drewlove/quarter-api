TRUNCATE TABLE role
RESTART IDENTITY CASCADE;

INSERT INTO role
    (app_user_id, role_name, department_id)
VALUES
    ('603aa00aae08220070737444', 'production', 3),
    ('603aa00aae08220070737444', 'register', 2),
    ('603aa00aae08220070737444', 'sous chef', 1),
    ('603aa00aae08220070737444', 'head chef', 1),
    ('603aa00aae08220070737444', 'line prep', 2),
    ('603aa00aae08220070737444', 'doughs', 3),
    ('603aa00aae08220070737444', 'lead production', 3),
    ('603aa00aae08220070737444', 'expediter', 2),

    ('603d5037c23beb006ada3d0d', 'server', 4),
    ('603d5037c23beb006ada3d0d', 'chef', 5);



    
