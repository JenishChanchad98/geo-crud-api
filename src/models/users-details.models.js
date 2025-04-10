const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    about: {
      type: String,
      trim: true,
    },
    birth_date: {
      type: Date,
    },
    job: {
      type: String,
    },
    height: {
      type: String,
    },
    age: {
      type: Number,
      default: false,
    },
    weight: {
      type: String,
    },
    geo: {
      type: { type: String, enum: ["Point"], required: true },
      coordinates: { type: [Number], required: true },
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

userDetailsSchema.index({ geo: "2dsphere" });

module.exports = mongoose.model("User-details", userDetailsSchema);
