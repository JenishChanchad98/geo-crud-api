const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    user_detail_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User-details",
      default: null,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone_number: {
      type: String,
      trim: true,
      required: true,
    },
    is_verify: {
      type: Boolean,
      default: false,
    },
    is_online: {
      type: Boolean,
      default: false,
    },
    last_visit_date: {
      type: Date,
      default: Date.now,
    },
    user_status: {
      type: Boolean,
      default: false,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
