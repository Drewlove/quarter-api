const path = require("path");
const xss = require("xss");
const endpointService = require("./service");

const table = {
  name: "line_item",
  columns: [
    "line_item_category",
    "line_item_name",
    "amount",
    "line_item_amount_type",
    "percent_of",
  ],
  rowId: "line_item_id",
};

const serializeRow = (row) => ({
  app_user_id: row.app_user_id,
  line_item_category: row.line_item_category,
  line_item_id: row.line_item_id,
  line_item_name: xss(row.line_item_name),
  amount: row.amount,
  line_item_amount_type: row.line_item_amount_type,
  percent_of: row.percent_of,
});

const routerFunctions = {
  getAllRowsMatchingUserId(req, res, next) {
    const knexInstance = req.app.get("db");
    endpointService
      .getAllRowsMatchingUserId(knexInstance, req.params.app_user_id)
      .then((rows) => {
        res.json(rows.map(serializeRow));
      })
      .catch(next);
  },
  insertRow(req, res, next) {
    const {
      line_item_category,
      line_item_name,
      amount,
      line_item_amount_type,
      percent_of,
    } = req.body;
    const app_user_id = req.params.app_user_id;
    const newRow = {
      line_item_category,
      line_item_name,
      amount,
      line_item_amount_type,
      percent_of,
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
    const app_user_id = req.params.app_user_id;
    const {
      line_item_category,
      line_item_name,
      amount,
      line_item_amount_type,
      percent_of,
    } = req.body;
    const rowToUpdate = {
      line_item_category,
      line_item_name,
      amount,
      line_item_amount_type,
      percent_of,
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
