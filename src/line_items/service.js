//REWRITE, make note of 'orderRow' if you want rows returned alphabetically
const table = {
  name: "line_item",
  orderRow: "line_item_name",
};
const service = {
  getAllRowsMatchingUserId(knex, app_user_id) {
    return knex
      .select("*")
      .from(table.name)
      .where("line_item.app_user_id", app_user_id)
      .orderByRaw(`lower(${table.orderRow}) ASC`);
  },
  getById(knex, app_user_id, row_id) {
    return knex
      .from(table.name)
      .select("*")
      .where(`${table.name}_id`, row_id)
      .where("app_user_id", app_user_id)
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
      .where("app_user_id", app_user_id)
      .update(newFields);
  },
  deleteRow(knex, app_user_id, row_id) {
    return knex(table.name)
      .where(`${table.name}_id`, row_id)
      .where("app_user_id", app_user_id)
      .delete();
  },
};

module.exports = service;
