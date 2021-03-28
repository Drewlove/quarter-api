const table = {
  name: "role",
  orderRow: "role_name",
};

const service = {
  getAllRows(knex) {
    return knex.select("*").from(table.name).orderBy(table.orderRow, "ASC");
  },
  getAllRowsMatchingUserIdWithDepartments(knex, app_user_id) {
    return knex("role")
      .join("department", "role.department_id", "=", "department.department_id")
      .select(
        "role.app_user_id",
        "role.role_id",
        "role.role_name",
        "department.department_id",
        "department.department_name"
      )
      .where(`role.app_user_id`, app_user_id)
      .orderByRaw(`lower(${table.orderRow}) ASC`);
  },
  getById(knex, app_user_id, row_id) {
    return knex("role")
      .join("department", "role.department_id", "=", "department.department_id")
      .select(
        "role.app_user_id",
        "role.role_id",
        "role.role_name",
        "department.department_id",
        "department.department_name"
      )
      .where(`${table.name}_id`, row_id)
      .where("role.app_user_id", app_user_id)
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
  updateRow(knex, app_user_id, row_id, newFields) {
    return knex(table.name)
      .where(`${table.name}_id`, row_id)
      .where("role.app_user_id", app_user_id)
      .update(newFields);
  },
  deleteRow(knex, app_user_id, row_id) {
    return knex(table.name)
      .where(`${table.name}_id`, row_id)
      .where("role.app_user_id", app_user_id)
      .delete();
  },
};

module.exports = service;
