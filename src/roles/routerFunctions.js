const path = require("path");
const xss = require("xss");
const endpointService = require("./service");

const table = {
  name: "role",
  columns: ["role_name", "department_id"],
  rowId: "role_id",
};

const serializeRow = (row) => ({
  app_user_id: row.app_user_id,
  role_id: row.role_id,
  role_name: xss(row.role_name),
  department_id: row.department_id,
});

const routerFunctions = {
  getAllRowsMatchingUserIdWithDepartments(req, res, next) {
    const knexInstance = req.app.get("db");
    endpointService
      .getAllRowsMatchingUserIdWithDepartments(
        knexInstance,
        req.params.app_user_id
      )
      .then((rows) => {
        res.json(rows.map(serializeRow));
      })
      .catch(next);
  },
  insertRow(req, res, next) {
    const { role_name, department_id } = req.body;
    const app_user_id = req.params.app_user_id;
    const newRow = {
      role_name,
      department_id,
      app_user_id,
    };

    for (const [key, value] of Object.entries(newRow))
      if (key !== "percent_of" && value == null)
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
  },

  getById(req, res, next) {
    endpointService
      .getById(req.app.get("db"), req.params.app_user_id, req.params.row_id)
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
  },

  delete(req, res, next) {
    endpointService
      .deleteRow(req.app.get("db"), req.params.app_user_id, req.params.row_id)
      .then((numRowsAffected) => {
        res.status(204).end();
      })
      .catch(next);
  },
  patch(req, res, next) {
    const { role_name, department_id } = req.body;
    const rowToUpdate = {
      role_name,
      department_id,
    };

    const numberOfValues = Object.values(rowToUpdate).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: `Request body content must contain at least one of the following: ${table.columns}`,
        },
      });
    }
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
  },
};

module.exports = routerFunctions;
