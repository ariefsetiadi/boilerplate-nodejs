const moment = require('moment');
const User = require('./user.model');
const { NotFoundError, ConflictError } = require('../../utils/errors');
const validate = require('../../utils/validate');
const { userSchema } = require('./user.validator');
const { capitalizeWords, lowerCase } = require('../../utils/formatText');
const { getFieldLabel } = require('../../utils/fieldLabels');

const formatUser = (row) => ({
  id: row.id,
  fullName: row.fullName,
  placeBirth: row.placeBirth,
  dateBirth: row.dateBirth ? moment(row.dateBirth).format('DD MMM YYYY') : null,
  gender: row.gender === true || row.gender === '1' ? 'Male' : 'Female',
  email: row.email,
  status: row.status === true || row.status === '1' ? 'Active' : 'Inactive',
});

const ALLOWED_SORT_FIELDS = ['id', 'fullName', 'placeBirth', 'dateBirth', 'gender', 'email', 'status'];

const getAllUsers = async (sort = 'id', order = 'DESC') => {
  const sortBy = ALLOWED_SORT_FIELDS.includes(sort) ? sort : 'id';
  const orderBy = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const users = await User.findAll({
    order: [[sortBy, orderBy]],
  });

  return users.map(formatUser);
};

const getUserById = async (id) => {
  const row = await User.findByPk(id);

  if (!row) throw new NotFoundError('User not found');

  return formatUser(row);
};

const createUser = async (payload) => {
  const validateData = await validate(userSchema('create'), payload);

  try {
    const user = new User({
      fullName: capitalizeWords(validateData.fullName),
      placeBirth: capitalizeWords(validateData.placeBirth),
      dateBirth: validateData.dateBirth,
      gender: validateData.gender,
      email: lowerCase(validateData.email),
      password: validateData.password,
      status: validateData.status,
    });
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
}

const updateUser = async (id, payload) => {
  const user = await User.findByPk(id);
  if (!user) throw new NotFoundError('User not found');

  const validateData = await validate(userSchema('update'), payload);

  try {
    user.fullName = capitalizeWords(validateData.fullName);
    user.placeBirth = capitalizeWords(validateData.placeBirth);
    user.dateBirth = validateData.dateBirth;
    user.gender = validateData.gender;
    user.email = lowerCase(validateData.email);
    user.status = validateData.status;
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
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
};
