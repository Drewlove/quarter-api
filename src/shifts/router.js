const path = require("path");
const express = require("express");
const xss = require("xss");
const endpointService = require("./service");
const { checkJwt } = require("../authz/check-jwt");
const logger = require("../logger");

const endpointRouter = express.Router();
const jsonParser = express.json();

//REWRITE, include each row from table
const serializeRow = (row) => ({
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
});

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

endpointRouter
  .route("/")
  .get(checkJwt, (req, res, next) => {
    const knexInstance = req.app.get("db");
    endpointService
      .getAllRows(knexInstance)
      .then((rows) => {
        res.json(rows.map(serializeRowDeptsAndRoles));
      })
      .catch(next);
  })
  .post(jsonParser, checkJwt, (req, res, next) => {
    const {
      app_user_id,
      shift_day,
      shift_department,
      shift_role,
      shift_start,
      shift_end,
      people,
      wage,
      payroll_tax,
    } = req.body;
    const newRow = {
      app_user_id,
      shift_day,
      shift_department,
      shift_role,
      shift_start,
      shift_end,
      people,
      wage,
      payroll_tax,
    };

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
  .all(checkJwt, (req, res, next) => {
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
    res.json(serializeRow(res.row));
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
    const {
      app_user_id,
      shift_id,
      shift_day,
      shift_department,
      shift_role,
      shift_start,
      shift_end,
      people,
      wage,
      payroll_tax,
    } = req.body;
    const rowToUpdate = {
      app_user_id,
      shift_id,
      shift_day,
      shift_department,
      shift_role,
      shift_start,
      shift_end,
      people,
      wage,
      payroll_tax,
    };

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
