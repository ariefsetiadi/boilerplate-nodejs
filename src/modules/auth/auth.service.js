const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../../../config/database');

const User = require('../user/user.model');
const RefreshToken = require('./refreshToken.model');

const { loginSchema, updateProfileSchema, changePasswordSchema } = require('./auth.validator');

const validate = require('../../utils/validate');
const { getFieldLabel } = require('../../utils/fieldLabels');
const { capitalizeWords, lowerCase } = require('../../utils/formatData');
const { UnauthorizedError, NotFoundError, ValidationError, ConflictError } = require('../../utils/errors');
const { hashToken, generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } = require('../../utils/token');
const { extractDeviceInfo } = require('../../utils/device');

const login = async (payload, req) => {
  const data = await validate(loginSchema, payload);
  const user = await User.findOne({
    attributes: ['id', 'fullName', 'placeBirth', 'dateBirth', 'gender', 'email', 'status', 'password', 'defaultPassword'],
    where: { email: lowerCase(data.email) },
  });

  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.status) {
    throw new UnauthorizedError('Your account is inactive');
  }

  try {
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

    const { password: _, ...safeUser } = user.get({ plain: true });

    return { accessToken: rawAccessToken, refreshToken: rawRefreshToken, user: safeUser };
  } catch (error) {
    throw error;
  }
};

const refresh = async (req) => {
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

    throw new UnauthorizedError('Token reuse detected. All sessions have been revoked');
  }

  if (tokenRecord.revokedAt) throw new UnauthorizedError('Refresh token has been revoked');

  if (new Date() > new Date(tokenRecord.expiredAt)) {
    throw new UnauthorizedError('Refresh token has expired');
  }

  const user = await User.findByPk(tokenRecord.userId, {
    attributes: ['id', 'fullName', 'placeBirth', 'dateBirth', 'gender', 'email', 'status', 'defaultPassword'],
  });

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

    return { accessToken: newRawAccessToken, refreshToken: newRawRefreshToken, user };
  } catch (error) {
    await t.rollback();
    throw error;
  }
};

const logout = async (req) => {
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
};

const getProfile = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'fullName', 'placeBirth', 'dateBirth', 'gender', 'email', 'status', 'defaultPassword'],
  });

  if (!user) throw new NotFoundError('User not found');

  return user;
};

const updateProfile = async (userId, payload) => {
  const user = await User.findByPk(userId, {
    attributes: ['id', 'fullName', 'placeBirth', 'dateBirth', 'gender', 'email', 'status'],
  });

  if (!user) throw new NotFoundError('User not found');

  const validateData = await validate(updateProfileSchema, payload);

  try {
    user.fullName = capitalizeWords(validateData.fullName);
    user.placeBirth = capitalizeWords(validateData.placeBirth);
    user.dateBirth = validateData.dateBirth;
    user.gender = validateData.gender;
    await user.save();

    return user;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0]?.path;
      const fieldName = getFieldLabel(field);

      throw new ConflictError(`${fieldName} already exists`);
    }
    throw error;
  }
};

const changePassword = async (userId, payload) => {
  const user = await User.findByPk(userId);
  if (!user) throw new NotFoundError('User not found');

  const data = await validate(changePasswordSchema, payload);

  const isCurrentPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
  if (!isCurrentPasswordValid) throw new UnauthorizedError('Current password is incorrect');

  const isSamePassword = await bcrypt.compare(data.newPassword, user.password);
  if (isSamePassword) throw new ValidationError('New password must be different from current password');

  const hashedPassword = await bcrypt.hash(data.newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  // Revoke semua refresh token aktif milik user
  await RefreshToken.update(
    { revokedAt: new Date(), revokedReason: 'security' },
    { where: { userId, revokedAt: null } }
  );
};

module.exports = {
  login,
  refresh,
  logout,
  getProfile,
  updateProfile,
  changePassword,
};
