require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { connectDatabase } = require("./config/database");
const { apiLimiter } = require("./middleware/rateLimiter");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const jobRoutes = require("./routes/jobRoutes");

const PORT = Number(process.env.PORT) || 3001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
/** Helmet CSP defaults include upgrade-insecure-requests, which forces HTTPS for assets; plain-HTTP IPs then get ERR_SSL_PROTOCOL_ERROR. */
const clientOriginIsHttps = CLIENT_ORIGIN.startsWith("https:");

const cspDirectives = {
  "script-src": [
    "'self'",
    "https://apis.google.com",
    "https://www.gstatic.com",
    "https://www.googleapis.com",
    "https://*.firebaseapp.com",
  ],
  "connect-src": [
    "'self'",
    "https://identitytoolkit.googleapis.com",
    "https://securetoken.googleapis.com",
    "https://www.googleapis.com",
    "https://*.firebaseio.com",
    "https://*.firebaseapp.com",
  ],
  "frame-src": [
    "'self'",
    "https://accounts.google.com",
    "https://*.firebaseapp.com",
  ],
  "img-src": ["'self'", "data:", "https://*.googleusercontent.com", "https://www.gstatic.com"],
};

if (!clientOriginIsHttps) {
  cspDirectives.upgradeInsecureRequests = null;
}

const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    contentSecurityPolicy: {
      useDefaults: true,
      directives: cspDirectives,
    },
  })
);
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "myjobs-api" });
});

app.use("/api", apiLimiter);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/jobs", jobRoutes);

const clientDist = path.join(__dirname, "..", "client", "client", "dist");
if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientDist));
  app.get(/^\/(?!api\/).*/, (_req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

app.use(errorHandler);

async function main() {
  await connectDatabase();
  app.listen(PORT, () => {
    console.log(`MyJobs API listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
