const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const token = req.headers?.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "You are not login",
    });
  }

  jwt.verify(token, process.env.JWT_KEY, (err, user) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Token not valid or expired",
      });
    }

    req.user = user;
    next();
  });
};

const isAdmin = async (req, res, next) => {
  if (req?.user?.isAdmin === false) {
    return res.status(403).json({
      success: false,
      message: "Access Denied",
    });
  }
  next();
};

module.exports = { authenticate, isAdmin };
