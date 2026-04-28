const express = require("express");
const app = express();

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.send("OK");
});

app.listen(3000, () => console.log("Server running"));