// Sets a user's password in data/users.json.
// If the user ID does not exist yet, a new user is created.
//
// How to use (run inside the server folder):
//   node scripts/set-password.js <userId> <password>
//   node scripts/set-password.js <userId> <password> "<Display Name>"
//
// TODO (admin module): the admin screen will replace this script.

const bcrypt = require("bcryptjs");
const { readUsers, saveUsers } = require("../data/userStore");

const MIN_PASSWORD_LENGTH = 6;

const [userIdInput, password, name] = process.argv.slice(2);

if (!userIdInput || !password) {
  console.error(
    'Usage: node scripts/set-password.js <userId> <password> "<Display Name>"',
  );
  process.exit(1);
}

if (password.length < MIN_PASSWORD_LENGTH) {
  console.error(
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`,
  );
  process.exit(1);
}

const userId = userIdInput.trim().toLowerCase();
const users = readUsers();
const user = users.find((item) => item.userId.toLowerCase() === userId);
const passwordHash = bcrypt.hashSync(password, 10);

if (user) {
  user.passwordHash = passwordHash;
  if (name) {
    user.name = name;
  }
  saveUsers(users);
  console.log(`Password updated for user "${user.userId}".`);
} else {
  // New id = biggest id so far + 1
  const newId = users.reduce((max, item) => Math.max(max, item.id), 0) + 1;

  users.push({
    id: newId,
    userId,
    passwordHash,
    name: name || userId,
    role: "user",
    isActive: true,
  });
  saveUsers(users);
  console.log(`New user "${userId}" created.`);
}
