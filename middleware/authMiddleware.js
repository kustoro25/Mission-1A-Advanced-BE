const jwt = require("jsonwebtoken");

const authMiddleware = {
  verifyToken: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: "Access denied. No token provided.",
        });
      }

      const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;

      if (!token) {
        return res.status(401).json({
          success: false,
          message: "Access denied. No token provided.",
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error("Token verification error:", error);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired",
        });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }
  },

  optionalAuth: (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader) {
        const token = authHeader.startsWith("Bearer ")
          ? authHeader.slice(7)
          : authHeader;

        if (token) {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;
        }
      }

      next();
    } catch (error) {
      // Continue without authentication
      next();
    }
  },
};

module.exports = authMiddleware;
