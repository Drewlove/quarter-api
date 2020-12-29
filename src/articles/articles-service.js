const ArticlesService = {
  getAllArticles(knex) {
    return knex.from("article").select("*");
  },
  insertArticle(knex, newArticle) {
    return knex
      .insert(newArticle)
      .into("article")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },
  getById(knex, id) {
    return knex.from("article").select("*").where("id", id).first();
  },
  deleteArticle(knex, id) {
    return knex.from("article").where({ id }).delete();
  },
  updateArticle(knex, id, newArticleFields) {
    return knex.from("article").where({ id }).update(newArticleFields);
  },
};

module.exports = ArticlesService;
