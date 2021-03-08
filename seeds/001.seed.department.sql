TRUNCATE department RESTART
IDENTITY CASCADE;

INSERT INTO department
    (app_user_id, department_name)
VALUES
    ('auth0|603aa00aae08220070737444', 'kitchen'),
    ('auth0|603aa00aae08220070737444', 'service'),
    ('auth0|603aa00aae08220070737444', 'bagel production'); 
