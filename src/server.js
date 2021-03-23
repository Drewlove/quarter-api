const knex = require("knex");
const app = require("./app");
const { PORT, DATABASE_URL } = require("./config");
const { NODE_ENV } = require("./config");

if (NODE_ENV === "production") {
  db = knex({
    client: "pg",
    connection: {
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    },
    useNullAsDefault: true,
  });
} else {
  db = knex({
    client: "pg",
    connection: {
      connectionString: DATABASE_URL,
    },
    useNullAsDefault: true,
  });
}

app.set("db", db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
