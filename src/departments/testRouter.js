const express = require("express");
const xss = require("xss");
const endpointRouter = express.Router();
const jsonParser = express.json();
const routerFunctions = require("./routerFunctions");

const serializeRow = (row) => ({
  app_user_id: row.app_user_id,
  department_id: row.department_id,
  department_name: xss(row.department_name),
});

endpointRouter
  .route("/:app_user_id")
  .get(routerFunctions.getAllRowsMatchingUserId)
  .post(jsonParser, routerFunctions.insertRow);

endpointRouter
  .route("/:app_user_id/:row_id")
  .all(routerFunctions.getById)
  .get((req, res, next) => {
    res.json(serializeRow(res.row));
  })
  .delete(routerFunctions.delete)
  .patch(jsonParser, routerFunctions.patch);

module.exports = endpointRouter;
