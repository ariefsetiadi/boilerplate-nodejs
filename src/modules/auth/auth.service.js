const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');

const User = require('../user/user.model');
const RefreshToken = require('./refreshToken.model');
const db = require('../../../config/database');
const validate = require('../../utils/validate');
const { loginSchema, updateProfileSchema, changePasswordSchema } = require('./auth.validator');
const { UnauthorizedError, NotFoundError } = require('../../utils/errors');
const { capitalizeWords, lowerCase } = require('../../utils/formatText');

// ─── Helpers ────────────────────────────────────────────────────────────────

const hashToken = (rawToken) =>
  crypto.createHash('sha256').update(rawToken).digest('hex');

const generateAccessToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const generateRefreshToken = (userId) =>
  jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  });

const getRefreshTokenExpiry = () => {
  const decoded = jwt.decode(generateRefreshToken(0));
  return new Date(decoded.exp * 1000);
};

const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.AUTH_COOKIE_SECURE === 'true',
  sameSite: process.env.AUTH_COOKIE_SAME_SITE || 'lax',
  maxAge: maxAge !== undefined ? maxAge : parseInt(process.env.AUTH_COOKIE_MAX_AGE, 10),
});

const extractDeviceInfo = (req) => ({
  deviceId: req.headers['x-device-id'] || null,
  deviceName: req.headers['x-device-name'] || null,
  deviceType: req.headers['x-device-type'] || null,
  userAgent: req.headers['user-agent'] || null,
  ipAddress: req.ip || null,
});

const formatUser = (user) => ({
  id: user.id,
  fullName: user.fullName,
  placeBirth: user.placeBirth,
  dateBirth: user.dateBirth ? moment(user.dateBirth).format('DD MMM YYYY') : null,
  gender: user.gender === true || user.gender === '1' ? 'Male' : 'Female',
  email: user.email,
  status: user.status === true || user.status === '1' ? 'Active' : 'Inactive',
});

const login = async (payload, req, res) => {
  const data = await validate(loginSchema, payload);

  const user = await User.findOne({ where: { email: lowerCase(data.email) } });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.status) {
    throw new UnauthorizedError('Your account is inactive');
  }

  const rawAccessToken = generateAccessToken(user.id);
  const rawRefreshToken = generateRefreshToken(user.id);
  const hashedRefreshToken = hashToken(rawRefreshToken);
  const deviceInfo = extractDeviceInfo(req);

  await RefreshToken.create({
    userId: user.id,
    token: hashedRefreshToken,
    expiredAt: getRefreshTokenExpiry(),
    ...deviceInfo,
  });

  const maxAge = parseInt(process.env.AUTH_COOKIE_MAX_AGE, 10);

  res.cookie('refreshToken', rawRefreshToken, {
    ...getCookieOptions(maxAge),
    path: '/api/auth',
  });

  return { accessToken: rawAccessToken, user: formatUser(user) };
};

const refresh = async (req, res) => {
  const rawRefreshToken = req.cookies.refreshToken;

  if (!rawRefreshToken) throw new UnauthorizedError('Refresh token not found');

  let payload;
  try {
    payload = jwt.verify(rawRefreshToken, process.env.JWT_REFRESH_SECRET_KEY);
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const hashedToken = hashToken(rawRefreshToken);
  const tokenRecord = await RefreshToken.findOne({ where: { token: hashedToken } });

  if (!tokenRecord) throw new UnauthorizedError('Refresh token not found');

  // Reuse detection: token sudah di-rotate sebelumnya
  if (tokenRecord.revokedAt && tokenRecord.revokedReason === 'rotated') {
    // Revoke seluruh token chain milik user ini dengan reason security
    await RefreshToken.update(
      { revokedAt: new Date(), revokedReason: 'security' },
      {
        where: {
          userId: tokenRecord.userId,
          revokedAt: null,
        },
      }
    );

    clearAuthCookies(res);
    throw new UnauthorizedError('Token reuse detected. All sessions have been revoked');
  }

  if (tokenRecord.revokedAt) throw new UnauthorizedError('Refresh token has been revoked');

  if (new Date() > new Date(tokenRecord.expiredAt)) {
    throw new UnauthorizedError('Refresh token has expired');
  }

  const user = await User.findByPk(tokenRecord.userId);
  if (!user || !user.status) throw new UnauthorizedError('User is not valid');

  // Rotation: buat token baru dalam transaction
  const t = await db.transaction();
  try {
    const newRawAccessToken = generateAccessToken(user.id);
    const newRawRefreshToken = generateRefreshToken(user.id);
    const newHashedRefreshToken = hashToken(newRawRefreshToken);
    const deviceInfo = extractDeviceInfo(req);

    const newTokenRecord = await RefreshToken.create({
      userId: user.id,
      token: newHashedRefreshToken,
      expiredAt: getRefreshTokenExpiry(),
      ...deviceInfo,
    }, { transaction: t });

    await tokenRecord.update({
      revokedAt: new Date(),
      revokedReason: 'rotated',
      replacedBy: newTokenRecord.id,
    }, { transaction: t });

    await t.commit();

    const maxAge = parseInt(process.env.AUTH_COOKIE_MAX_AGE, 10);

    res.cookie('refreshToken', newRawRefreshToken, {
      ...getCookieOptions(maxAge),
      path: '/api/auth',
    });

    return { accessToken: newRawAccessToken, message: 'Token refreshed successfully' };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const logout = async (req, res) => {
  const rawRefreshToken = req.cookies.refreshToken;

  if (rawRefreshToken) {
    const hashedToken = hashToken(rawRefreshToken);
    const tokenRecord = await RefreshToken.findOne({ where: { token: hashedToken } });

    if (tokenRecord && !tokenRecord.revokedAt) {
      await tokenRecord.update({
        revokedAt: new Date(),
        revokedReason: 'logout',
      });
    }
  }

  clearAuthCookies(res);
};

const getProfile = async (userId) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError('User not found');

  return formatUser(user);
};

const updateProfile = async (userId, payload) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError('User not found');

  const validateData = await validate(updateProfileSchema, payload);

  try {
    user.fullName = capitalizeWords(validateData.fullName);
    user.placeBirth = capitalizeWords(validateData.placeBirth);
    user.dateBirth = validateData.dateBirth;
    user.gender = validateData.gender;
    await user.save();

    return formatUser(user);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0]?.path;
      const fieldName = getFieldLabel(field);

      throw new ConflictError(`${fieldName} already exists`);
    }
    throw error;
  }
};

const changePassword = async (userId, payload, res) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError('User not found');

  const data = await validate(changePasswordSchema, payload);

  const isCurrentPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isCurrentPasswordValid) throw new UnauthorizedError('Current password is incorrect');

  const isSamePassword = await bcrypt.compare(data.newPassword, user.password);
  if (isSamePassword) throw new UnauthorizedError('New password must be different from current password');

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  // Revoke semua refresh token aktif milik user
  await RefreshToken.update(
    { revokedAt: new Date(), revokedReason: 'security' },
    { where: { userId, revokedAt: null } }
  );

  clearAuthCookies(res);
};

const clearAuthCookies = (res) => {
  res.clearCookie('refreshToken', { path: '/api/auth' });
};

module.exports = {
  login,
  refresh,
  logout,
  getProfile,
  updateProfile,
  changePassword,
};
