const User = require('./user.model');
const { NotFoundError, ConflictError } = require('../../utils/errors');
const validate = require('../../utils/validate');
const { userSchema } = require('./user.validator');
const { capitalizeWords, lowerCase } = require('../../utils/formatData');
const { getFieldLabel } = require('../../utils/fieldLabels');
const { getPagination, buildPaginationMeta } = require('../../utils/pagination');
const { Op } = require('sequelize');

const ALLOWED_SORT_FIELDS = ['id', 'fullName', 'placeBirth', 'dateBirth', 'gender', 'email', 'status'];

const getAllUsers = async (query) => {
  const { page, limit, offset } = getPagination(query.page, query.limit);
  const { search, defaultPassword, status, sort, order = 'DESC' } = query;

  const sortBy = ALLOWED_SORT_FIELDS.includes(sort) ? sort : 'id';
  const orderBy = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const where = {};

  if (search) {
    where[Op.or] = [
      { fullName: { [Op.like]: `%${search}%` } },
      { placeBirth: { [Op.like]: `%${search}%` } },
      { email: { [Op.like]: `%${search}%` } },
    ];
  }

  if (defaultPassword) {
    where.defaultPassword = defaultPassword;
  }

  if (status) {
    where.status = status;
  }

  const { count: total, rows: data } = await User.findAndCountAll({
    where,
    attributes: ['id', 'fullName', 'placeBirth', 'dateBirth', 'gender', 'email', 'status'],
    order: [[sortBy, orderBy]],
    limit,
    offset,
  });

  const pagination = buildPaginationMeta(total, page, limit);

  return { data, pagination };
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'fullName', 'placeBirth', 'dateBirth', 'gender', 'email', 'status'],
  });

  if (!user) throw new NotFoundError('User not found');

  return user;
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

    return {
      id: user.id,
      fullName: user.fullName,
      placeBirth: user.placeBirth,
      dateBirth: user.dateBirth,
      gender: user.gender,
      email: user.email,
      status: user.status,
    }
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
  const user = await User.findByPk(id, {
    attributes: ['id', 'fullName', 'placeBirth', 'dateBirth', 'gender', 'email', 'status'],
  });

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

    return user;
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
