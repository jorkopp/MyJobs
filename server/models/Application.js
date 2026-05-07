const mongoose = require("mongoose");

/**
 * Pipeline stages for a job search — aligned with product requirements.
 */
const applicationStatusEnum = [
  "interested",
  "applied",
  "interviewed",
  "second_round",
  "follow_up",
  "offer",
  "rejected",
  "archived",
];

const applicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    /** Remotive (or other provider) job id for deduplication */
    externalJobId: { type: String, required: true, trim: true },
    source: { type: String, default: "remotive" },
    title: { type: String, required: true, maxlength: 500 },
    company: { type: String, default: "", maxlength: 300 },
    jobUrl: { type: String, default: "", maxlength: 2000 },
    category: { type: String, default: "" },
    notes: { type: String, default: "", maxlength: 10000 },
    status: {
      type: String,
      enum: applicationStatusEnum,
      default: "interested",
      index: true,
    },
  },
  { timestamps: true }
);

applicationSchema.index({ user: 1, externalJobId: 1 }, { unique: true });

module.exports = {
  Application: mongoose.model("Application", applicationSchema),
  applicationStatusEnum,
};
