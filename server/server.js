const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

connectDB();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "home.html"));
});

app.get("/expenses", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "expense.html"));
});

app.get("/investments", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "invest.html"));
});

app.get("/api/test-db", (req, res) => {
  res.json({ message: "MongoDB connection is working" });
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});