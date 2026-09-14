const userService = require('./user.service');
const { responseSuccess, responsePage } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const { data, pagination } = await userService.getAllUsers(req.query);

  return responsePage(res, 200, 'Get users successfully', data, pagination);
});

const detail = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.params.id);

  return responseSuccess(res, 200, 'User is found', user);
});

const create = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);

  return responseSuccess(res, 201, 'User created successfully', user);
});

const update = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body);

  return responseSuccess(res, 200, 'User updated successfully', user);
});

module.exports = {
  list,
  detail,
  create,
  update,
};
