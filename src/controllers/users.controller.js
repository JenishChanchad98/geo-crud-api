const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../utils/response.util");
const User = require("../models/users.models");

dotenv.config();

const registerController = async (req, res) => {
  try {
    const {
      email,
      username,
      password,
      phone_number,
      is_verify,
      is_online,
      user_status,
    } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return sendSuccessResponse(
        res,
        StatusCodes.CONFLICT,
        "Username already exists.",
        { username }
      );
    }

    const saltRounds = Number(process.env.SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      email,
      username,
      password: hashedPassword,
      phone_number,
      is_verify,
      is_online,
      user_status,
    });
    await user.save();

    return sendSuccessResponse(
      res,
      StatusCodes.CREATED,
      "User registered successfully.",
      user
    );
  } catch (error) {
    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Registration failed",
      error.message
    );
  }
};

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Invalid credentials",
        null
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "Invalid credentials",
        null
      );
    }

    if (!process.env.JWT_SECRET_KEY) {
      return sendErrorResponse(
        res,
        StatusCodes.UNAUTHORIZED,
        "JWT secret is not defined",
        null
      );
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRATION_TIME }
    );

    return sendSuccessResponse(res, StatusCodes.OK, "Login successfully.", {
      username,
      token,
    });
  } catch (error) {
    return sendErrorResponse(
      res,
      StatusCodes.UNAUTHORIZED,
      "Invalid credentials",
      error.message
    );
  }
};

module.exports = { registerController, loginController };
