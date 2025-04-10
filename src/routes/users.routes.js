const express = require("express");
const router = express.Router();

const {
  registerController,
  loginController,
} = require("../controllers/users.controller");
const validateRequest = require("../middleware/validate.middleware");
const {
  loginValidation,
  registerValidation,
} = require("../validations/user.validation");

router.post(
  "/register",
  validateRequest(registerValidation),
  registerController
);
router.post("/login", validateRequest(loginValidation), loginController);

module.exports = router;
