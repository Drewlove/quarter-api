const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const { DOMAIN, AUDIENCE } = require("../config");

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    // jwksUri: `https://${DOMAIN}/.well-known/jwks.json`,
    jwksUri: `https://dev-twvvyq34.auth0.com/.well-known/jwks.json`,
  }),
  //   audience: AUDIENCE,
  audience: "https://quarter.api",
  //   issuer: `https://${DOMAIN}/`,
  issuer: `https://dev-twvvyq34.auth0.com/`,
  algorithms: ["RS256"],
});

module.exports = {
  checkJwt,
};

// AUTH0_DOMAIN=dev-twvvyq34.auth0.com
// AUTH0_AUDIENCE=https://quarter.api
