const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { findByUserId, toPublicUser } = require("../data/userStore");
const { requireLogin } = require("../middleware/auth");

const router = express.Router();

// POST /api/auth/login
// Body: { "userId": "...", "password": "..." }
// Returns the login token and the user's details.
router.post("/login", async (req, res) => {
  const { userId, password } = req.body || {};

  if (typeof userId !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Enter your user ID and password." });
  }

  if (!userId.trim() || !password) {
    return res.status(400).json({ error: "Enter your user ID and password." });
  }

  const user = findByUserId(userId);

  // The same message is used for a wrong user ID and a wrong password,
  // so nobody can find out which user IDs exist.
  const isPasswordCorrect =
    user !== undefined && (await bcrypt.compare(password, user.passwordHash));

  if (!isPasswordCorrect) {
    return res.status(401).json({ error: "Invalid user ID or password." });
  }

  if (!user.isActive) {
    return res
      .status(403)
      .json({ error: "Your account is disabled. Contact your admin." });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "8h",
  });

  res.json({ token, user: toPublicUser(user) });
});

// GET /api/auth/me
// Returns the logged-in user. The client calls this when the page loads
// to check that the saved token still works.
router.get("/me", requireLogin, (req, res) => {
  res.json({ user: toPublicUser(req.user) });
});

module.exports = router;
