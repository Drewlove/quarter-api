const logger = require("./logger");
const { NODE_ENV } = require("./config");

function validateBearerToken(req, res, next) {
  const apiToken =
    NODE_ENV === "development"
      ? process.env.API_TOKEN_DEV
      : process.env.API_TOKEN;

  const authToken = req.get("Authorization");
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    logger.error(authToken.split(" ")[1]);
    logger.error(apiToken);
    return res.status(401).json({ error: "unathorized request" });
  }
  next();
}

module.exports = validateBearerToken;
