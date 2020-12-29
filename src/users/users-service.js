const UsersService = {
  getAllUsers(knex) {
    return knex.select("*").from("user");
  },
  getById(knex, id) {
    return knex.from("user").select("*").where("app_user_id", id).first();
  },
  insertUser(knex, newUser) {
    return knex
      .insert(newUser)
      .into("user")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  updateUser(knex, id, newFields) {
    return knex("user").where({ id }).update(newFields);
  },
  deleteUser(knex, id) {
    return knex("user").where({ id }).delete();
  },
};

module.exports = UsersService;
