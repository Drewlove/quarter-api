const table = {
  name: "department",
  orderRow: "department_name",
};

const service = {
  getAllRows(knex, app_user_id) {
    return knex
      .select("*")
      .from(table.name)
      .where(`app_user_id`, app_user_id)
      .orderBy(table.orderRow, "ASC");
  },
  getById(knex, row_id) {
    return knex
      .from(table.name)
      .select("*")
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
