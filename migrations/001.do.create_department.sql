DROP TABLE IF EXISTS department
CASCADE;

CREATE TABLE department(
    app_user_id TEXT NOT NULL, 
    department_id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY, 
    department_name TEXT NOT NULL
);
