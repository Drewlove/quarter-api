TRUNCATE department RESTART
IDENTITY CASCADE;

INSERT INTO department
    (app_user_id, department_name)
VALUES
    ('603aa00aae08220070737444', 'kitchen'),
    ('603aa00aae08220070737444', 'service'),
    ('603aa00aae08220070737444', 'bagel production'),

    ('6078bd8ac282fc006ab892fb', 'front of house'),
    ('6078bd8ac282fc006ab892fb', 'back of house');

