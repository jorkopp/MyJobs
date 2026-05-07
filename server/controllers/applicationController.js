const { validationResult } = require("express-validator");
const { Application, applicationStatusEnum } = require("../models/Application");
const { sanitizePlainText } = require("../utils/sanitize");

async function list(req, res, next) {
  try {
    const groupBy = req.query.groupBy === "status";
    const apps = await Application.find({ user: req.userId })
      .sort({ updatedAt: -1 })
      .lean();

    if (!groupBy) {
      return res.json({ applications: apps });
    }

    const grouped = {};
    for (const s of applicationStatusEnum) {
      grouped[s] = [];
    }
    for (const a of apps) {
      const key = applicationStatusEnum.includes(a.status) ? a.status : "interested";
      grouped[key].push(a);
    }
    return res.json({ grouped });
  } catch (e) {
    next(e);
  }
}

async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      externalJobId,
      source,
      title,
      company,
      jobUrl,
      category,
      status,
      notes,
    } = req.body;

    const doc = await Application.create({
      user: req.userId,
      externalJobId: String(externalJobId).slice(0, 120),
      source: source ? String(source).slice(0, 40) : "remotive",
      title: sanitizePlainText(title, 500),
      company: sanitizePlainText(company, 300),
      jobUrl: String(jobUrl || "").slice(0, 2000),
      category: sanitizePlainText(category, 120),
      status: applicationStatusEnum.includes(status) ? status : "interested",
      notes: sanitizePlainText(notes, 10_000),
    });
    res.status(201).json({ application: doc });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({ error: "This job is already in your pipeline" });
    }
    next(e);
  }
}

async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const app = await Application.findOne({ _id: req.params.id, user: req.userId });
    if (!app) return res.status(404).json({ error: "Application not found" });

    const { status, notes, title, company } = req.body;
    if (status !== undefined) {
      if (!applicationStatusEnum.includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      app.status = status;
    }
    if (notes !== undefined) app.notes = sanitizePlainText(notes, 10_000);
    if (title !== undefined) app.title = sanitizePlainText(title, 500);
    if (company !== undefined) app.company = sanitizePlainText(company, 300);

    await app.save();
    res.json({ application: app });
  } catch (e) {
    next(e);
  }
}

async function remove(req, res, next) {
  try {
    const result = await Application.deleteOne({ _id: req.params.id, user: req.userId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.status(204).send();
  } catch (e) {
    next(e);
  }
}

module.exports = { list, create, update, remove };
