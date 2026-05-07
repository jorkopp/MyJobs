const mongoose = require("mongoose");

/**
 * Connects to MongoDB using MONGODB_URI from environment.
 * Never log the full connection string (it may contain credentials).
 */
async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  return mongoose.connection;
}

module.exports = { connectDatabase };
