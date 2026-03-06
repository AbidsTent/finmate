const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

connectDB();

const publicPath = path.join(__dirname, "..", "frontend", "public");

app.use(express.static(publicPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(publicPath, "home.html"));
});

app.get("/expenses", (req, res) => {
  res.sendFile(path.join(publicPath, "expense.html"));
});

app.get("/investments", (req, res) => {
  res.sendFile(path.join(publicPath, "invest.html"));
});

app.get("/api/test-db", (req, res) => {
  res.json({ message: "MongoDB connection is working" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});