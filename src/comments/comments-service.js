const CommentsService = {
  getAllComments(knex) {
    return knex.select("*").from("comment");
  },

  insertComment(knex, newComment) {
    return knex
      .insert(newComment)
      .into("comment")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getById(knex, id) {
    return knex.from("comment").select("*").where("id", id).first();
  },

  deleteComment(knex, id) {
    return knex("comment").where({ id }).delete();
  },

  updateComment(knex, id, newCommentFields) {
    return knex("comment").where({ id }).update(newCommentFields);
  },
};

module.exports = CommentsService;
