const jwt = require("jsonwebtoken");
const env = require("../config/environment");
const User = require("../models/User");

/**
 * Protect Middleware
 * Validates JWT in Authorization: Bearer <token>
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      // In case user is in demo mode without MongoDB record
      if (!req.user) {
        req.user = {
          _id: decoded.id,
          role: decoded.role || "user",
          name: "Alex Rivera",
          email: "alex.rivera@parkvolt.io"
        };
      }

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized. Invalid or expired authentication token."
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authorization token missing in request header."
    });
  }
};

/**
 * Role-Based Authorization Guard (RBAC)
 * @param  {...string} roles - Permitted roles (e.g. 'admin', 'operator')
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user ? req.user.role : "anonymous"}' does not have access permission.`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
