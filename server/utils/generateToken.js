const jwt = require("jsonwebtoken");
const env = require("../config/environment");

/**
 * Generate JSON Web Token (JWT)
 * Signs payload with HMAC-SHA256 using JWT_SECRET
 *
 * @param {string} id - MongoDB User ObjectId
 * @param {string} role - User authorization role
 * @returns {string} - Bearer token
 */
const generateToken = (id, role = "user") => {
  return jwt.sign({ id, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN
  });
};

module.exports = generateToken;
