const fs = require("fs");
const path = require("path");

// Sent messages are kept in a JSON file for now, the same way as the users.
// TODO (database): replace this file with a real database. Only the
// functions in this file need to change, the routes can stay the same.
const MESSAGES_FILE = path.join(__dirname, "messages.json");

// One message looks like this:
//   {
//     "id": "m-1",                 unique id, one record for one message
//     "ownerId": 1,                id of the user who sent it (users.json)
//     "status": "delivered",       latest status, see MESSAGE_STATUSES
//     "cost": 0.13,                billed amount in rupees, or null if the
//                                  provider has not told us the cost yet
//     "createdAt": "2026-10-10T06:30:00.000Z"   when it was submitted (UTC)
//   }
//
// A status update changes the "status" of the same record. It never adds
// a second record, so one message is always counted once.

// The statuses a message can have. These follow the WhatsApp Business API:
//   pending   = accepted by us, not yet sent to WhatsApp
//   sent      = WhatsApp accepted it
//   delivered = it reached the customer's phone
//   read      = the customer opened it
//   failed    = it could not be sent
const MESSAGE_STATUSES = ["pending", "sent", "delivered", "read", "failed"];

// "Successfully sent" means WhatsApp accepted the message.
// A delivered or read message was also sent, so all three count.
const SENT_STATUSES = ["sent", "delivered", "read"];

// "Delivered" means it reached the phone. A read message was delivered too.
const DELIVERED_STATUSES = ["delivered", "read"];

// messages.json is not saved in Git, so on a fresh copy of the project the
// file does not exist yet. That simply means "no messages".
function readMessages() {
  if (!fs.existsSync(MESSAGES_FILE)) {
    return [];
  }
  return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8"));
}

function saveMessages(messages) {
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2) + "\n");
}

// Returns one user's messages submitted in the given time range.
// start is included, end is not:  start <= createdAt < end
// Each message id is returned once, even if the file has it twice.
function findMessagesInRange(ownerId, start, end) {
  const seenIds = new Set();
  const result = [];

  for (const message of readMessages()) {
    if (message.ownerId !== ownerId) {
      continue;
    }

    // A message without a valid time cannot be placed in any range
    const time = new Date(message.createdAt).getTime();
    if (Number.isNaN(time) || time < start.getTime() || time >= end.getTime()) {
      continue;
    }

    if (seenIds.has(message.id)) {
      continue;
    }
    seenIds.add(message.id);

    result.push(message);
  }

  return result;
}

module.exports = {
  MESSAGE_STATUSES,
  SENT_STATUSES,
  DELIVERED_STATUSES,
  readMessages,
  saveMessages,
  findMessagesInRange,
};
