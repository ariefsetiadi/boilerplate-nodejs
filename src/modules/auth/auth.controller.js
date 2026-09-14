const authService = require('./auth.service');
const { responseSuccess, responseAuth } = require('../../utils/response');
const { getCookieOptions, clearAuthCookies } = require('../../utils/cookie');
const asyncHandler = require('../../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.login(req.body, req);

  const maxAge = parseInt(process.env.AUTH_COOKIE_MAX_AGE, 10);
  res.cookie('refreshToken', refreshToken, { ...getCookieOptions(maxAge), path: '/api/auth' });

  return responseAuth(res, 200, 'Login successfully', accessToken, user);
});

const refresh = asyncHandler(async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.refresh(req);

  const maxAge = parseInt(process.env.AUTH_COOKIE_MAX_AGE, 10);
  res.cookie('refreshToken', refreshToken, { ...getCookieOptions(maxAge), path: '/api/auth' });

  return responseAuth(res, 200, 'Token refreshed successfully', accessToken, user);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req);

  clearAuthCookies(res);

  return responseSuccess(res, 200, 'Logout successfully');
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  return responseSuccess(res, 200, 'Profile retrieved successfully', user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user.id, req.body);

  return responseSuccess(res, 200, 'Profile updated successfully', user);
});

const changePassword = asyncHandler(async (req, res) => {
  await authService.changePassword(req.user.id, req.body);

  clearAuthCookies(res);

  return responseSuccess(res, 200, 'Password changed successfully. Please login again');
});

module.exports = {
  login,
  refresh,
  logout,
  me,
  updateProfile,
  changePassword
};
