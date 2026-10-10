require("dotenv").config();

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const analyticsRoutes = require("./routes/analytics");

// The login tokens are signed with this secret. Without it nobody can log in,
// so stop here with a clear message instead of failing later.
if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET is missing. Add it to the server/.env file.");
  process.exit(1);
}

const app = express();

app.use(cors());
app.use(express.json());

// First API route
app.get("/", (req, res) => {
  res.send("Node.js backend is running!");
});

// API route that returns JSON data
app.get("/api/message", (req, res) => {
  res.json({
    message: "Hello from Node.js backend!",
    technology: "React + Node.js + Express",
  });
});

// Login routes: /api/auth/login and /api/auth/me
app.use("/api/auth", authRoutes);

// Dashboard numbers: /api/analytics/dashboard?range=today
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
