const { responseError } = require('../utils/response');
const { AppError } = require('../utils/errors');

const errorHandler = (error, req, res, next) => {
  if (error instanceof AppError) {
    return responseError(res, error.statusCode, error.message, error.errors ?? null);
  }

  console.error(error);
  return responseError(res, 500, 'Internal server error');
};

module.exports = errorHandler;
