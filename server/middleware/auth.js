const jwt = require("jsonwebtoken");
const { findById } = require("../data/userStore");

// Put this in front of any route that only a logged-in user may open.
// The browser must send the header:  Authorization: Bearer <token>
// When the token is valid, the logged-in user is available as req.user.
function requireLogin(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({ error: "Please log in." });
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Your session has expired. Please log in again." });
  }

  // Read the user again on every request, so a user who was removed or
  // disabled by the admin loses access immediately.
  const user = findById(payload.id);
  if (!user || !user.isActive) {
    return res.status(401).json({ error: "Please log in." });
  }

  req.user = user;
  next();
}

module.exports = { requireLogin };
