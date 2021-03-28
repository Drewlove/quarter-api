const express = require("express");
const xss = require("xss");
const endpointRouter = express.Router();
const jsonParser = express.json();
const { checkJwt } = require("../authz/check-jwt");
const routerFunctions = require("./routerFunctions");

const serializeRow = (row) => ({
  app_user_id: row.app_user_id,
  role_id: row.role_id,
  role_name: xss(row.role_name),
  department_id: row.department_id,
});

//test router, does not require auth0 authentication via checkJwt function
endpointRouter
  .route("/test/:app_user_id")
  .get(routerFunctions.getAllRowsMatchingUserIdWithDepartments)
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
  .get(checkJwt, routerFunctions.getAllRowsMatchingUserIdWithDepartments)
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

// const path = require("path");
// const express = require("express");
// const xss = require("xss");
// const endpointService = require("./service");
// const endpointRouter = express.Router();
// const jsonParser = express.json();
// const { checkJwt } = require("../authz/check-jwt");

// const serializeRow = (row) => ({
//   app_user_id: row.app_user_id,
//   role_id: row.role_id,
//   role_name: xss(row.role_name),
//   department_id: row.department_id,
// });

// const serializeRowWithDepartment = (row) => ({
//   app_user_id: row.app_user_id,
//   role_id: row.role_id,
//   role_name: xss(row.role_name),
//   department_id: row.department_id,
//   department_name: row.department_name,
// });

// const table = {
//   name: "role",
//   columns: ["role_id", "role_name", "department_id"],
//   rowId: "role_id",
// };

// endpointRouter
//   .route("/:app_user_id")
//   .get(checkJwt, (req, res, next) => {
//     const knexInstance = req.app.get("db");
//     endpointService
//       .getAllRowsMatchingUserIdWithDepartments(
//         knexInstance,
//         req.params.app_user_id
//       )
//       .then((rows) => {
//         res.json(rows.map(serializeRowWithDepartment));
//       })
//       .catch(next);
//   })
//   .post(jsonParser, checkJwt, (req, res, next) => {
//     const { role_name, department_id } = req.body;
//     const app_user_id = req.params.app_user_id;
//     const newRow = { app_user_id, role_name, department_id };

//     for (const [key, value] of Object.entries(newRow))
//       if (value == null)
//         return res.status(400).json({
//           error: { message: `Missing '${key}' in request body` },
//         });

//     endpointService
//       .insertRow(req.app.get("db"), newRow)
//       .then((row) => {
//         res
//           .status(201)
//           .location(path.posix.join(req.originalUrl, `/${row[table.rowId]}`))
//           .json(serializeRow(row));
//       })
//       .catch(next);
//   });

// endpointRouter
//   .route("/:app_user_id/:row_id")
//   .all(checkJwt, (req, res, next) => {
//     endpointService
//       .getById(req.app.get("db"), req.params.app_user_id, req.params.row_id)
//       .then((row) => {
//         if (!row) {
//           return res.status(404).json({
//             error: { message: `Row from table: '${table.name}' doesn't exist` },
//           });
//         }
//         res.row = row;
//         next();
//       })
//       .catch(next);
//   })
//   .get((req, res, next) => {
//     res.json(serializeRowWithDepartment(res.row));
//   })
//   .delete((req, res, next) => {
//     endpointService
//       .deleteRow(req.app.get("db"), req.params.app_user_id, req.params.row_id)
//       .then((numRowsAffected) => {
//         res.status(204).end();
//       })
//       .catch(next);
//   })
//   .patch(jsonParser, (req, res, next) => {
//     //REWRITE, use table's column names
//     const { role_name, department_id } = req.body;
//     const rowToUpdate = { role_name, department_id };

//     const numberOfValues = Object.values(rowToUpdate).filter(Boolean).length;
//     if (numberOfValues === 0)
//       return res.status(400).json({
//         error: {
//           message: `Request body content must contain at least one of the following: ${table.columns}`,
//         },
//       });

//     endpointService
//       .updateRow(
//         req.app.get("db"),
//         req.params.app_user_id,
//         req.params.row_id,
//         rowToUpdate
//       )
//       .then((numRowsAffected) => {
//         res.status(204).end();
//       })
//       .catch(next);
//   });

// module.exports = endpointRouter;
