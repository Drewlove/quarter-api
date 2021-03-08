module.exports = {
  PORT: process.env.PORT || 9000,
  NODE_ENV: process.env.NODE_ENV || "development",
  API_TOKEN: process.env.API_TOKEN || "dummy-api-token",
  DOMAIN: process.env.AUTH0_DOMAIN,
  AUDIENCE: process.env.AUTH0_AUDIENCE,
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres@localhost/db_boilerplate",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://postgres@localhost/db_boilerplate",
};
