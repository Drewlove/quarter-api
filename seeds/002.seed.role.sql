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

    ('6078bd8ac282fc006ab892fb', 'service', 4),
    ('6078bd8ac282fc006ab892fb', 'chef', 5),
    ('6078bd8ac282fc006ab892fb', 'line cook', 5);



    
