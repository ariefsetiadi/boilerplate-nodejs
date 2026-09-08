const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!accessToken) {
    return next(new UnauthorizedError('Access token not found'));
  }

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    req.user = { id: payload.sub };
    return next();
  } catch {
    return next(new UnauthorizedError('Invalid or expired access token'));
  }
};

module.exports = { authenticate };
