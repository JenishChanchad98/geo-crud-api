const sendSuccessResponse = (res, status, message, data = null) => {
  const response = {
    message,
    data,
  };
  res.status(status).json(response);
};

const sendErrorResponse = (res, status, message, error = null) => {
  const response = {
    message,
    error,
  };
  res.status(status).json(response);
};

module.exports = { sendSuccessResponse, sendErrorResponse };
