const { StatusCodes } = require("http-status-codes");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/users.models");
const UserDetails = require("../models/users-details.models");
const {
  sendSuccessResponse,
  sendErrorResponse,
} = require("../utils/response.util");

const updateUserDetailsController = async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      gender,
      about,
      birth_date,
      job,
      height,
      age,
      weight,
      latitude,
      longitude,
      location,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return sendErrorResponse(
        res,
        StatusCodes.NOT_FOUND,
        "User not found",
        null
      );
    }

    let userDetails = await UserDetails.findOne({ user_id: userId });

    if (userDetails) {
      userDetails.gender = gender || userDetails.gender;
      userDetails.about = about || userDetails.about;
      userDetails.birth_date = birth_date || userDetails.birth_date;
      userDetails.job = job || userDetails.job;
      userDetails.height = height || userDetails.height;
      userDetails.age = age || userDetails.age;
      userDetails.weight = weight || userDetails.weight;
      userDetails.location = location || userDetails.location;

      if (latitude && longitude) {
        userDetails.geo = {
          type: "Point",
          coordinates: [longitude, latitude],
        };
      }

      await userDetails.save();

      return sendSuccessResponse(
        res,
        StatusCodes.OK,
        "User details updated successfully",
        userDetails
      );
    } else {
      userDetails = new UserDetails({
        user_id: userId,
        gender,
        about,
        birth_date,
        job,
        height,
        age,
        weight,
        location,
        geo: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
      });

      await userDetails.save();

      return sendSuccessResponse(
        res,
        StatusCodes.CREATED,
        "User details created successfully",
        userDetails
      );
    }
  } catch (error) {
    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to add or update user details",
      error.message
    );
  }
};

const userListController = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const numberOfRecord = parseInt(req.body.numberOfRecord) || 10;
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);

    if (!latitude || !longitude) {
      return sendErrorResponse(
        res,
        StatusCodes.BAD_REQUEST,
        "Latitude and Longitude are required",
        null
      );
    }

    const geoQuery = {
      near: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      distanceField: "dist.calculated",
      maxDistance: 2000,
      spherical: true,
    };

    const skip = (page - 1) * numberOfRecord;

    const users = await UserDetails.aggregate([
      { $geoNear: geoQuery },
      { $skip: skip },
      { $limit: numberOfRecord },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "user_details",
        },
      },
      { $unwind: "$user_details" },
      {
        $project: {
          "user_details.username": 1,
          "user_details.email": 1,
          "dist.calculated": 1,
        },
      },
    ]);

    const totalUsers = await UserDetails.aggregate([
      { $geoNear: geoQuery },
      { $count: "totalCount" },
    ]);

    const totalCount = totalUsers[0] ? totalUsers[0].totalCount : 0;
    const totalPages = Math.ceil(totalCount / numberOfRecord);

    return sendSuccessResponse(
      res,
      StatusCodes.OK,
      "User list fetched successfully",
      {
        users,
        totalCount,
        totalPages,
        currentPage: page,
        perPage: numberOfRecord,
      }
    );
  } catch (error) {
    console.log(error, ": << error");
    return sendErrorResponse(
      res,
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to fetch user list",
      error.message
    );
  }
};

module.exports = { updateUserDetailsController, userListController };
