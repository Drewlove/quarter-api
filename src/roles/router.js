const path = require("path");
const express = require("express");
const xss = require("xss");
const endpointService = require("./service");
const logger = require("../logger");
const endpointRouter = express.Router();
const jsonParser = express.json();

const { DOMAIN, AUDIENCE } = require("../config");

//REWRITE, include each row from table
const serializeRow = (row) => ({
  role_id: row.role_id,
  role_name: xss(row.role_name),
  department_id: row.department_id,
});

const serializeRowWithDepartment = (row) => ({
  role_id: row.role_id,
  role_name: xss(row.role_name),
  department_id: row.department_id,
  department_name: row.department_name,
});

const table = {
  name: "role",
  columns: ["role_id", "role_name", "department_id"],
  rowId: "role_id",
};

endpointRouter
  .route("/")
  .get((req, res, next) => {
    const knexInstance = req.app.get("db");
    endpointService
      .getAllRowsWithDepartments(knexInstance)
      .then((rows) => {
        // res.json(rows.map(serializeRowWithDepartment));
        res.json({
          name: "guy",
          // domain: DOMAIN,
          // audience: AUDIENCE,
        });
      })
      .catch(next);
  })
  .post(jsonParser, (req, res, next) => {
    const { role_name, department_id } = req.body;
    const newRow = { role_name, department_id };

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
          .location(path.posix.join(req.originalUrl, `/${row[table.rowId]}`))
          .json(serializeRow(row));
      })
      .catch(next);
  });

endpointRouter
  .route("/:row_id")
  .all((req, res, next) => {
    endpointService
      .getById(req.app.get("db"), req.params.row_id)
      .then((row) => {
        if (!row) {
          return res.status(404).json({
            error: { message: `Row from table: '${table.name}' doesn't exist` },
          });
        }
        res.row = row;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json(serializeRowWithDepartment(res.row));
  })
  .delete((req, res, next) => {
    endpointService
      .deleteRow(req.app.get("db"), req.params.row_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(jsonParser, (req, res, next) => {
    //REWRITE, use table's column names
    const { role_name, role_id, department_id } = req.body;
    const rowToUpdate = { role_name, role_id, department_id };

    const numberOfValues = Object.values(rowToUpdate).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body content must contain at least one of the following: ${table.columns}`,
        },
      });

    endpointService
      .updateRow(req.app.get("db"), req.params.row_id, rowToUpdate)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = endpointRouter;
