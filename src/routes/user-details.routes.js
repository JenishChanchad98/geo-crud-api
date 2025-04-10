const express = require("express");
const router = express.Router();

const {
  updateUserDetailsController,
  userListController,
} = require("../controllers/users-details.controller");
const validateRequest = require("../middleware/validate.middleware");
const authMiddleware = require("../middleware/auth.middleware");
const {
  updateUserDetailsValidation,
  usersListValidation,
} = require("../validations/users-details.validation");

router.patch(
  "/update/:userId",
  authMiddleware,
  validateRequest(updateUserDetailsValidation),
  updateUserDetailsController
);

router.post(
  "/users/list",
  authMiddleware,
  validateRequest(usersListValidation),
  userListController
);

module.exports = router;
