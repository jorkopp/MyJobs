const https = require("https");

const REMOTIVE_BASE = "https://remotive.com/api/remote-jobs";

/**
 * Fetches remote job listings from Remotive's public REST API (third-party).
 * Server-side only — keeps the client simple and allows merging with MongoDB.
 */
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      url,
      {
        headers: { Accept: "application/json", "User-Agent": "MyJobs/1.0" },
      },
      (res) => {
        let body = "";
        res.on("data", (c) => {
          body += c;
        });
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 400) {
            return reject(new Error(`Remotive HTTP ${res.statusCode}`));
          }
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error("Invalid JSON from Remotive"));
          }
        });
      }
    );
    req.on("error", reject);
    req.setTimeout(12_000, () => {
      req.destroy();
      reject(new Error("Remotive request timeout"));
    });
  });
}

/**
 * @param {{ search?: string, category?: string, limit?: number }} opts
 */
async function searchRemoteJobs(opts = {}) {
  const limit = Math.min(Math.max(Number(opts.limit) || 25, 1), 50);
  const params = new URLSearchParams();
  if (opts.search) params.set("search", String(opts.search).slice(0, 120));
  if (opts.category) params.set("category", String(opts.category).slice(0, 80));
  params.set("limit", String(limit));

  const url = `${REMOTIVE_BASE}?${params.toString()}`;
  const data = await fetchJson(url);
  const jobs = Array.isArray(data.jobs) ? data.jobs : [];

  return jobs.map((j) => ({
    externalJobId: String(j.id),
    source: "remotive",
    title: j.title || "",
    company: j.company_name || "",
    jobUrl: j.url || "",
    category: j.category || "",
    publicationDate: j.publication_date || null,
    candidateRequiredLocation: j.candidate_required_location || "",
    jobType: j.job_type || "",
  }));
}

module.exports = { searchRemoteJobs, REMOTIVE_BASE };
