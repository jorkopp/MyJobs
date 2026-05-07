const mongoose = require("mongoose");

const ROLE_CATEGORIES = [
  "engineering",
  "product",
  "design",
  "data",
  "marketing",
  "sales",
  "operations",
  "hr",
  "finance",
  "other",
];

const INDUSTRIES = [
  "technology",
  "healthcare",
  "finance",
  "education",
  "retail",
  "manufacturing",
  "media",
  "nonprofit",
  "government",
  "other",
];

const workModeEnum = ["remote", "hybrid", "onsite"];
const notifyChannelEnum = ["email", "sms", "site"];
const notifyFrequencyEnum = ["realtime", "daily", "weekly"];

const profileSchema = new mongoose.Schema(
  {
    resumeText: { type: String, default: "" },
    roleCategories: [{ type: String, enum: ROLE_CATEGORIES }],
    industry: { type: String, enum: INDUSTRIES, default: "technology" },
    workMode: { type: String, enum: workModeEnum, default: "remote" },
    notifyChannel: { type: String, enum: notifyChannelEnum, default: "site" },
    notifyFrequency: { type: String, enum: notifyFrequencyEnum, default: "daily" },
    phoneE164: { type: String, default: "" },
    profileComplete: { type: Boolean, default: false },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 320,
    },
    passwordHash: { type: String, select: false },
    authProvider: {
      type: String,
      enum: ["password", "google"],
      default: "password",
    },
    profile: { type: profileSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.model("User", userSchema),
  ROLE_CATEGORIES,
  INDUSTRIES,
  workModeEnum,
  notifyChannelEnum,
  notifyFrequencyEnum,
};
