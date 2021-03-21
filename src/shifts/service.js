const table = {
  name: "shift",
  orderRow: "shift_id",
};
const service = {
  getAllRows(knex, app_user_id) {
    return knex
      .select("*")
      .from(table.name)
      .join(
        "department",
        "shift.shift_department",
        "=",
        "department.department_id"
      )
      .join("role", "shift.shift_role", "=", "role.role_id")
      .where(`shift.app_user_id`, app_user_id);
  },
  getById(knex, app_user_id, row_id) {
    return knex
      .from(table.name)
      .select("*")
      .join(
        "department",
        "shift.shift_department",
        "=",
        "department.department_id"
      )
      .join("role", "shift.shift_role", "=", "role.role_id")
      .where(`${table.name}_id`, row_id)
      .where("shift.app_user_id", app_user_id)
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
      .where("shift.app_user_id", app_user_id)
      .update(newFields);
  },
  deleteRow(knex, app_user_id, row_id) {
    return knex(table.name)
      .where(`${table.name}_id`, row_id)
      .where("shift.app_user_id", app_user_id)
      .delete();
  },
};

module.exports = service;
