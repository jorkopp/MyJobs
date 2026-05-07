/**
 * Central error handler — avoids leaking stack traces in production.
 */
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  const status = err.status || err.statusCode || 500;
  const message =
    status >= 500 && process.env.NODE_ENV === "production"
      ? "Something went wrong"
      : err.message || "Something went wrong";
  if (status >= 500) {
    console.error(err);
  }
  res.status(status).json({ error: message });
}

module.exports = { errorHandler };
