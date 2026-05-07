const { validationResult } = require("express-validator");
const { searchRemoteJobs } = require("../services/remotiveService");
const { Application } = require("../models/Application");

/**
 * GET search — combines third-party listings with this user's saved pipeline ids.
 */
async function search(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { q, category, limit } = req.query;
    const jobs = await searchRemoteJobs({
      search: q || "",
      category: category || "",
      limit: limit ? Number(limit) : 25,
    });

    const ids = jobs.map((j) => j.externalJobId);
    const existing = await Application.find({
      user: req.userId,
      externalJobId: { $in: ids },
    })
      .select("externalJobId status")
      .lean();

    const byId = new Map(existing.map((a) => [a.externalJobId, a.status]));

    const enriched = jobs.map((j) => ({
      ...j,
      savedStatus: byId.get(j.externalJobId) || null,
    }));

    res.json({ jobs: enriched, source: "remotive" });
  } catch (e) {
    next(e);
  }
}

module.exports = { search };
