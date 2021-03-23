const knex = require("knex");
const app = require("./app");
const { NODE_ENV } = require("./config");
const { PORT, DATABASE_URL } = require("./config");

const db = knex({
  client: "pg",
  connection: {
    connectionString: DATABASE_URL,
  },
  useNullAsDefault: true,
});

if (NODE_ENV === "production") {
  db.connection.ssl = { rejectUnauthorized: false };
}

app.set("db", db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
