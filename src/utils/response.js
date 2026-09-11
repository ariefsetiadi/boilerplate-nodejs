const responseSuccess = (res, statusCode = 200, message = 'Operation is success', data = null) => {
  const payload = {
    success: true,
    message,
  };

  if (data !== null) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

const responseError = (res, statusCode = 500, message = 'Something when wrong', error = null) => {
  const payload = {
    success: false,
    message,
  };

  if (error) {
    payload.error = error instanceof Error ? error.message : error;
  }

  return res.status(statusCode).json(payload);
};

const responseAuth = (res, statusCode = 200, message = 'Unauthorized', accessToken = null, user = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: {
      type: 'Bearer',
      accessToken: accessToken,
      user,
    }
  });
}

module.exports = {
  responseSuccess,
  responseError,
  responseAuth,
};
