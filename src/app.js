require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
// const {CLIENT_ORIGIN} = require('./config')
const helmet = require("helmet");
const { NODE_ENV } = require("./config");
const validateBearerToken = require("./validate-bearer-token");
const { PORT, DATABASE_URL } = require("./config");

const departmentsRouter = require("./departments/router");
const rolesRouter = require("./roles/router");
const shiftsRouter = require("./shifts/router");
const lineItemsRouter = require("./line_items/router");

const app = express();

app.use(
  morgan(NODE_ENV === "production" ? "tiny" : "common", {
    skip: () => NODE_ENV === "test",
  })
);

app.use(cors());
// app.use(
//   cors({
//     origin: CLIENT_ORIGIN
//   }))
app.use(helmet());

app.use(validateBearerToken);
app.use("/api/departments", departmentsRouter);
app.use("/api/roles", rolesRouter);
app.use("/api/shifts", shiftsRouter);
app.use("/api/line_items", lineItemsRouter);

//Open heroku url in browser, see if {ok: true} appears
app.get("/TEST", (req, res) => {
  res.json({ ok: true });
});

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: "Server error" };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
