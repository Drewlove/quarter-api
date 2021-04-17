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

    ('6078bd8ac282fc006ab892fb', 'sales', 'Retail', 120000.00, 'dollars', null),
    ('6078bd8ac282fc006ab892fb', 'sales', 'Catering', 5000.00, 'dollars', null),
    ('6078bd8ac282fc006ab892fb', 'overhead', 'manager salary', 4000, 'dollars', null),
    ('6078bd8ac282fc006ab892fb', 'overhead', 'accounting\bookkeeping', 2000, 'dollars', null),
    ('6078bd8ac282fc006ab892fb', 'overhead', 'utilities', 2000, 'dollars', null),
    ('6078bd8ac282fc006ab892fb', 'overhead', 'rent', 9000, 'dollars', null),
    ('6078bd8ac282fc006ab892fb', 'overhead', 'repairs', 1500, 'dollars', null),
    ('6078bd8ac282fc006ab892fb', 'overhead', 'supplies', 1500, 'dollars', null),
    ('6078bd8ac282fc006ab892fb', 'overhead', 'insurance', 2000, 'dollars', null),
    ('6078bd8ac282fc006ab892fb', 'overhead', 'credit card fees', 3.5, 'percent', 10),
    ('6078bd8ac282fc006ab892fb', 'cogs', 'Retail', 27, 'percent', 10),
    ('6078bd8ac282fc006ab892fb', 'cogs', 'Catering', 20, 'percent', 11);
