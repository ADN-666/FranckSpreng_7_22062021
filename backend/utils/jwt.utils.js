const jwt = require("jsonwebtoken");

const JWT_SIGN_SECRET = "doudou21steph29";

// Exported functions
module.exports = {
  parseAuthorization: function (authorization) {
    return authorization != null ? authorization.replace("bearer ", "") : null;
  },
  getUserId: function (authorization) {
    let userId = -1;
    let token = module.exports.parseAuthorization(authorization);
    if (token != null) {
      try {
        let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
        if (jwtToken != null) {
          userId = jwtToken.userId;
        }
      } catch (err) {}
    }
    return userId;
  },
};
