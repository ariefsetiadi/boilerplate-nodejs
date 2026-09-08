const authService = require('./auth.service');
const { responseSuccess } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const user = await authService.login(req.body, req, res);

  return responseSuccess(res, 200, 'Login successful', user);
});

const refresh = asyncHandler(async (req, res) => {
  await authService.refresh(req, res);

  return responseSuccess(res, 200, 'Token refreshed successfully');
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req, res);

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
  await authService.changePassword(req.user.id, req.body, res);

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
