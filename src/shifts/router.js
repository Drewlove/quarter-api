const express = require("express");
const endpointRouter = express.Router();
const jsonParser = express.json();
const { checkJwt } = require("../authz/check-jwt");
const routerFunctions = require("./routerFunctions");

const serializeRowDeptsAndRoles = (row) => ({
  app_user_id: row.app_user_id,
  shift_id: row.shift_id,
  shift_day: row.shift_day,
  shift_department: row.shift_department,
  shift_role: row.shift_role,
  shift_start: row.shift_start,
  shift_end: row.shift_end,
  people: row.people,
  wage: row.wage,
  payroll_tax: row.payroll_tax,
  department_name: row.department_name,
  role_name: row.role_name,
});

const table = {
  name: "shift",
  columns: [
    "shift_id",
    "shift_day",
    "shift_department",
    "shift_role",
    "shift_start",
    "shift_end",
    "people",
    "wage",
    "payroll_tax",
  ],
  rowId: "shift_id",
};

//test router, does not require auth0 authentication via checkJwt function
endpointRouter
  .route("/test/:app_user_id")
  .get(routerFunctions.getAllRowsMatchingUserId)
  .post(jsonParser, routerFunctions.insertRow);

endpointRouter
  .route("/test/:app_user_id/:row_id")
  .all(routerFunctions.getById)
  .get((req, res, next) => {
    res.json(serializeRowDeptsAndRoles(res.row));
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
    res.json(serializeRowDeptsAndRoles(res.row));
  })
  .delete(routerFunctions.delete)
  .patch(jsonParser, routerFunctions.patch);

module.exports = endpointRouter;
