TRUNCATE TABLE line_item
RESTART IDENTITY CASCADE;

INSERT INTO line_item
    (app_user_id, line_item_category, line_item_name, amount, line_item_amount_type, percent_of)
VALUES
    ('603aa00aae08220070737444', 'sales', 'Food', 130000.25, 'dollars', null),
    ('603aa00aae08220070737444', 'sales', 'Beverage', 13000.50, 'dollars', null),
    ('603aa00aae08220070737444', 'sales', 'Catering', 10000.28, 'dollars', null),
    ('603aa00aae08220070737444', 'overhead', 'manager salary', 13000, 'dollars', null),
    ('603aa00aae08220070737444', 'overhead', 'utilities', 2000, 'dollars', null),
    ('603aa00aae08220070737444', 'overhead', 'rent', 18000, 'dollars', null),
    ('603aa00aae08220070737444', 'cogs', 'Food', 30, 'percent', 1),
    ('603aa00aae08220070737444', 'cogs', 'Beverage', 15, 'percent', 2),
    ('603aa00aae08220070737444', 'cogs', 'Catering', 25, 'percent', 3),

    ('603d5037c23beb006ada3d0d', 'sales', 'Food', 500.00, 'dollars', null),
    ('603d5037c23beb006ada3d0d', 'sales', 'Beverage', 100.50, 'dollars', null),
    ('603d5037c23beb006ada3d0d', 'sales', 'Catering', 300.00, 'dollars', null),
    ('603d5037c23beb006ada3d0d', 'overhead', 'manager salary', 200, 'dollars', null),
    ('603d5037c23beb006ada3d0d', 'overhead', 'utilities', 50, 'dollars', null),
    ('603d5037c23beb006ada3d0d', 'overhead', 'rent', 200, 'dollars', null),
    ('603d5037c23beb006ada3d0d', 'cogs', 'Food', 50, 'percent', 10),
    ('603d5037c23beb006ada3d0d', 'cogs', 'Beverage', 50, 'percent', 11),
    ('603d5037c23beb006ada3d0d', 'cogs', 'Catering', 50, 'percent', 12);
