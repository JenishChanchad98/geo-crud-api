const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { StatusCodes } = require("http-status-codes");

const User = require("../models/users.models");
const { sendErrorResponse } = require("../utils/response.util");

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Token is required",
        null
      );
    }

    const token = authHeader.split(" ")[1];
    if (!process.env.JWT_SECRET_KEY) {
      return sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "JWT secret key is not configured",
        null
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          "Token has expired. Please sign in again.",
          null
        );
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return sendErrorResponse(
          res,
          StatusCodes.UNAUTHORIZED,
          "Invalid token.",
          null
        );
      }
      return sendErrorResponse(
        res,
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Token verification failed.",
        null
      );
    }

    const findUser = await User.findById(decoded.userId);
    if (!findUser) {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Unauthorized user.",
        null
      );
    }

    req.userId = findUser._id.toString();
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Token has expired. Please sign in again!",
        null
      );
    }

    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Internal server error",
      null
    );
  }
};

module.exports = authMiddleware;
