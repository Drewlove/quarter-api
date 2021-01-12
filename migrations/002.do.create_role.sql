DROP TABLE IF EXISTS subcommunity
CASCADE;

CREATE TABLE role(
    role_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, 
    role_name TEXT NOT NULL, 
    department_id INTEGER REFERENCES department
(department_id) ON
DELETE CASCADE NOT NULL
);