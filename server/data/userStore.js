const fs = require("fs");
const path = require("path");

// Users are kept in a JSON file for now.
// TODO (database): replace this file with a real database. Only the
// functions in this file need to change, the routes can stay the same.
const USERS_FILE = path.join(__dirname, "users.json");

// users.json is not saved in Git (it holds password hashes), so on a fresh
// copy of the project the file does not exist yet. Create the first user with:
//   node scripts/set-password.js <userId> <password>
function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2) + "\n");
}

// User IDs are not case sensitive: "KSTEWD" and "kstewd" are the same user.
function findByUserId(userId) {
  const wanted = String(userId).trim().toLowerCase();
  return readUsers().find((user) => user.userId.toLowerCase() === wanted);
}

function findById(id) {
  return readUsers().find((user) => user.id === id);
}

// Removes the password hash, so it is never sent to the browser.
function toPublicUser(user) {
  const { passwordHash, ...publicUser } = user;
  return publicUser;
}

module.exports = {
  readUsers,
  saveUsers,
  findByUserId,
  findById,
  toPublicUser,
};
