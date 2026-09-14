const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
}

const generateAccessToken = (userId) => {
  return jwt.sign(
    { sub: userId },
    process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  }
  );
}

const generateRefreshToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET_KEY,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN }
  );
}

const getRefreshTokenExpiry = () => {
  const decoded = jwt.decode(generateRefreshToken(0));

  return new Date(decoded.exp * 1000);
};

module.exports = {
  hashToken,
  generateAccessToken,
  generateRefreshToken,
  getRefreshTokenExpiry,
};
