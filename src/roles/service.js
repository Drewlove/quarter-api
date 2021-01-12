//REWRITE, make note of 'orderRow' if you want rows returned alphabetically
const table = {
  name: "role",
  orderRow: "role_name",
};
const service = {
  getAllRows(knex) {
    return knex.select("*").from(table.name).orderBy(table.orderRow, "ASC");
  },
  getAllRowsWithDepartments(knex) {
    return knex("role")
      .join("department", "role.department_id", "=", "department.department_id")
      .select(
        "role.role_id",
        "role.role_name",
        "department.department_id",
        "department.department_name"
      )
      .orderBy("role.role_name", "ASC");
  },
  //getById(knex, row_id)
  getById(knex, row_id) {
    return knex("role")
      .join("department", "role.department_id", "=", "department.department_id")
      .select(
        "role.role_id",
        "role.role_name",
        "department.department_id",
        "department.department_name"
      )
      .where(`${table.name}_id`, row_id)
      .first();
  },
  insertRow(knex, newRow) {
    return knex
      .insert(newRow)
      .into(table.name)
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  updateRow(knex, row_id, newFields) {
    return knex(table.name).where(`${table.name}_id`, row_id).update(newFields);
  },
  deleteRow(knex, row_id) {
    return knex(table.name).where(`${table.name}_id`, row_id).delete();
  },
};

module.exports = service;
