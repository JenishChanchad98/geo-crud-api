const { StatusCodes } = require("http-status-codes");
const { sendErrorResponse } = require("../utils/response.util");

const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });

  if (!result.success) {
    const errors = {};
    result.error.errors.forEach((err) => {
      const key = err.path.join(".");
      errors[key.replace(/^(body|params|query)\./, "")] = err.message;
    });

    return sendErrorResponse(
      res,
      StatusCodes.BAD_REQUEST,
      "Validation error",
      errors
    );
  }

  next();
};

module.exports = validateRequest;
