const path = require("path");
const express = require("express");
const xss = require("xss");
const endpointService = require("./service");
const endpointRouter = express.Router();
const jsonParser = express.json();
const { checkJwt } = require("../authz/check-jwt");
// const logger = require("../logger");

const serializeRow = (row) => ({
  app_user_id: row.app_user_id,
  department_id: row.department_id,
  department_name: xss(row.department_name),
});

const table = {
  name: "department",
  columns: ["app_user_id", "department_name"],
  rowId: "department_id",
};

endpointRouter
  // .route("/:app_user_id")
  // .get(checkJwt, (req, res, next) => {
  .route("/")
  .get((req, res, next) => {
    res.json({ ok: true });
    // const knexInstance = req.app.get("db");
    // endpointService
    //   // .getAllRows(knexInstance, req.params.app_user_id)
    //   .getAllRows(knexInstance)
    //   .then((rows) => {
    //     res.json(rows.map(serializeRow));
    //   })
    //   .catch(next);
  })
  .post(jsonParser, checkJwt, (req, res, next) => {
    const { department_name } = req.body;
    const app_user_id = req.params.app_user_id;
    const newRow = { department_name, app_user_id };

    for (const [key, value] of Object.entries(newRow))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` },
        });

    endpointService
      .insertRow(req.app.get("db"), newRow)
      .then((row) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${row.department_id}`))
          .json(serializeRow(row));
      })
      .catch(next);
  });

endpointRouter
  .route("/:app_user_id/:row_id")
  .all(checkJwt, (req, res, next) => {
    endpointService
      .getById(req.app.get("db"), req.params.app_user_id, req.params.row_id)
      .then((row) => {
        if (!row) {
          return res.status(404).json({
            error: { message: `Row doesn't exist` },
          });
        }
        res.row = row;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeRow(res.row));
  })
  .delete((req, res, next) => {
    endpointService
      .deleteRow(req.app.get("db"), req.params.app_user_id, req.params.row_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    const { department_name } = req.body;
    const rowToUpdate = { department_name };

    const numberOfValues = Object.values(rowToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body content must contain 'name' `,
        },
      });

    endpointService
      .updateRow(
        req.app.get("db"),
        req.params.app_user_id,
        req.params.row_id,
        rowToUpdate
      )
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = endpointRouter;
