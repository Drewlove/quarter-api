TRUNCATE TABLE shift
RESTART IDENTITY CASCADE;

INSERT INTO shift
    (shift_day, shift_department, shift_role, shift_start, shift_end, people, wage)
VALUES
    ('{0, 1, 2, 3, 4}', 1, 4, '07:00:00', '15:00:00', 1, 27.50),
    ('{0, 3}', 1, 3, '09:00:00', '16:30:00', 1, 15),

    ('{1, 3, 5}', 3, 1, '15:00:00', '18:00:00', 3, 13.50),
    ('{0, 2, 4}', 3, 6, '17:00:00', '19:30:00', 1, 15),
    ('{3, 4, 5, 6}', 2, 2, '07:00:00', '13:15:00', 1, 14.50),
    ('{3, 4, 5, 6}', 2, 5, '06:30:00', '14:00:00', 2, 13.50),
    ('{3, 4, 5, 6}', 2, 8, '07:00:00', '14:00:00', 1, 13.50);


-- departments
--     ('kitchen'), id --> 1
--     ('service'), id --> 2
--     ('bagel production') id --> 3

-- roles
    -- ('production', 3),  id --> 1
    -- ('register', 2), id --> 2
    -- ('sous chef', 1), id --> 3
    -- ('head chef', 1), id --> 4
    -- ('line prep', 2), id --> 5
    -- ('doughs', 3), id --> 6
    -- ('lead production', 3), id --> 7
    -- ('expediter', 2); id --> 8