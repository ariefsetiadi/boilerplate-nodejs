const userService = require('./user.service');
const { responseSuccess } = require('../../utils/response');
const asyncHandler = require('../../utils/asyncHandler');

const list = asyncHandler(async (req, res) => {
  const { sort, order } = req.query;
  const users = await userService.getAllUsers(sort, order);

  return responseSuccess(res, 200, 'Get users is success', users);
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
})

module.exports = {
  list,
  detail,
  create,
  update,
};
