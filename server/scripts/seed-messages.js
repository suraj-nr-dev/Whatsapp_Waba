// Fills data/messages.json with SAMPLE messages, so the dashboard has
// something to show while the real sending is not connected yet.
//
// FOR DEVELOPMENT ONLY. The messages, statuses and costs made here are
// invented. Never run this on the live server.
//
// How to use (run inside the server folder):
//   node scripts/seed-messages.js <userId>     add sample messages for a user
//   node scripts/seed-messages.js --clear      delete all sample messages
//
// TODO (backend): remove this script when Push Campaign saves real messages.

const { findByUserId } = require("../data/userStore");
const { readMessages, saveMessages } = require("../data/messageStore");

// Sample messages are made for today and this many days before it
const DAYS_BACK = 65;
const ONE_DAY = 24 * 60 * 60 * 1000;

// Made-up cost of one message in rupees. Not a real WhatsApp price.
const SAMPLE_COSTS = [0.13, 0.13, 0.13, 0.35, 0.88];

// Every sample id starts with this, so --clear removes only sample messages
const SAMPLE_ID_PREFIX = "sample-";

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function pickStatus() {
  const chance = Math.random();
  if (chance < 0.45) return "read";
  if (chance < 0.75) return "delivered";
  if (chance < 0.87) return "sent";
  if (chance < 0.95) return "failed";
  return "pending";
}

const [argument] = process.argv.slice(2);

if (!argument) {
  console.error("Usage: node scripts/seed-messages.js <userId>   (or --clear)");
  process.exit(1);
}

// Keep the real messages, drop the old sample ones
const realMessages = readMessages().filter(
  (message) => !String(message.id).startsWith(SAMPLE_ID_PREFIX),
);

if (argument === "--clear") {
  saveMessages(realMessages);
  console.log("All sample messages were deleted.");
  process.exit(0);
}

const user = findByUserId(argument);
if (!user) {
  console.error(`User "${argument}" was not found.`);
  process.exit(1);
}

const now = Date.now();
const sampleMessages = [];

for (let daysAgo = 0; daysAgo <= DAYS_BACK; daysAgo++) {
  // Some days have no messages at all, like in real life
  const count = Math.random() < 0.15 ? 0 : Math.floor(Math.random() * 40) + 1;

  for (let i = 0; i < count; i++) {
    // A random moment in the 24 hours before (now - daysAgo days)
    const createdAt = now - daysAgo * ONE_DAY - Math.random() * ONE_DAY;
    const status = pickStatus();

    // Failed and pending messages are not billed. A few sent messages get
    // no cost, to show how the dashboard handles a missing cost.
    let cost = null;
    if (status === "failed" || status === "pending") {
      cost = 0;
    } else if (Math.random() > 0.02) {
      cost = pickRandom(SAMPLE_COSTS);
    }

    sampleMessages.push({
      id: `${SAMPLE_ID_PREFIX}${user.id}-${sampleMessages.length + 1}`,
      ownerId: user.id,
      status,
      cost,
      createdAt: new Date(createdAt).toISOString(),
    });
  }
}

saveMessages([...realMessages, ...sampleMessages]);
console.log(
  `${sampleMessages.length} sample messages saved for user "${user.userId}".`,
);
