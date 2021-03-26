const path = require("path");
const express = require("express");
const xss = require("xss");
const endpointRouter = express.Router();
const jsonParser = express.json();
const { checkJwt } = require("../authz/check-jwt");
const routerFunctions = require("./routerFunctions");

const serializeRow = (row) => ({
  app_user_id: row.app_user_id,
  department_id: row.department_id,
  department_name: xss(row.department_name),
});

//test router, does not require auth0 authentication via checkJwt function
endpointRouter
  .route("/test/:app_user_id")
  .get(routerFunctions.getAllRowsMatchingUserId)
  .post(jsonParser, routerFunctions.insertRow);

endpointRouter
  .route("/test/:app_user_id/:row_id")
  .all(routerFunctions.getById)
  .get((req, res, next) => {
    res.json(serializeRow(res.row));
  })
  .delete(routerFunctions.delete)
  .patch(jsonParser, routerFunctions.patch);

//actual router
endpointRouter
  .route("/:app_user_id")
  .get(checkJwt, routerFunctions.getAllRowsMatchingUserId)
  .post(jsonParser, checkJwt, routerFunctions.insertRow);

endpointRouter
  .route("/:app_user_id/:row_id")
  .all(checkJwt, routerFunctions.getById)
  .get((req, res, next) => {
    res.json(serializeRow(res.row));
  })
  .delete(routerFunctions.delete)
  .patch(jsonParser, routerFunctions.patch);

module.exports = endpointRouter;
