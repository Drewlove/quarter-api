const logger = require("./logger");

function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  console.log(authToken.split(" ")[1], apiToken);
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    logger.error(`Unauthorized request to path: ${req.path}`);
    return res.status(401).json({ error: "unathorized request" });
  }
  next();
}

module.exports = validateBearerToken;
