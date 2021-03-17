TRUNCATE department RESTART
IDENTITY CASCADE;

INSERT INTO department
    (app_user_id, department_name)
VALUES
    ('603aa00aae08220070737444', 'kitchen'),
    ('603aa00aae08220070737444', 'service'),
    ('603aa00aae08220070737444', 'bagel production'),

    ('603d5037c23beb006ada3d0d', 'front of house'),
    ('603d5037c23beb006ada3d0d', 'back of house'); 
