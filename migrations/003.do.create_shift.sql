DROP TABLE IF EXISTS shift
CASCADE;

CREATE TABLE shift(
    shift_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, 
    shift_day INTEGER[] NOT NULL,
    shift_department INTEGER REFERENCES department
(department_id) ON
DELETE CASCADE NOT NULL,
    shift_role INTEGER
REFERENCES role
(role_id) ON
DELETE CASCADE NOT NULL,
    shift_start TIME
NOT NULL, 
    shift_end TIME NOT NULL, 
    people INTEGER NOT NULL, 
    wage NUMERIC
(5,2) NOT NULL
);
