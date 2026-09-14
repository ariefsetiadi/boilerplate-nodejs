const responseSuccess = (res, statusCode = 200, message, data = null) => {
  const payload = {
    success: true,
    message,
  };

  if (data !== null) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

const responseError = (res, statusCode = 500, message, error = null) => {
  const payload = {
    success: false,
    message,
  };

  if (error) {
    payload.error = error instanceof Error ? error.message : error;
  }

  return res.status(statusCode).json(payload);
};

const responseAuth = (res, statusCode = 200, message, accessToken, user) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      type: 'Bearer',
      accessToken,
      user,
    }
  });
}

const responsePage = (res, statusCode = 200, message, data, pagination) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPage: pagination.totalPage,
    },
  });
}

module.exports = {
  responseSuccess,
  responseError,
  responseAuth,
  responsePage,
};
