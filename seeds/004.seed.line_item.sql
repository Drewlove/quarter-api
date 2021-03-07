TRUNCATE TABLE line_item
RESTART IDENTITY CASCADE;

INSERT INTO line_item
    (line_item_category, line_item_name, amount, line_item_amount_type, percent_of)
VALUES
    ('sales', 'Food', 130000.25, 'dollars', null),
    ('sales', 'Beverage', 13000.50, 'dollars', null),
    ('sales', 'Catering', 10000.28, 'dollars', null),
    ('overhead', 'manager salary', 13000, 'dollars', null),
    ('overhead', 'utilities', 2000, 'dollars', null),
    ('overhead', 'rent', 18000, 'dollars', null),
    ('cogs', 'Food', 30, 'percent', 1),
    ('cogs', 'Beverage', 15, 'percent', 2),
    ('cogs', 'Catering', 25, 'percent', 3);
