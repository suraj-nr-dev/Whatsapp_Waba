const express = require("express");
const { requireLogin } = require("../middleware/auth");
const {
  MESSAGE_STATUSES,
  SENT_STATUSES,
  DELIVERED_STATUSES,
  findMessagesInRange,
} = require("../data/messageStore");
const {
  BUSINESS_TIMEZONE,
  RANGE_NAMES,
  getDateRange,
  toDateKey,
  listDateKeys,
} = require("../utils/dateRanges");

const router = express.Router();

// All message costs are billed in rupees
const CURRENCY = "INR";

// Money is added up as whole numbers (1 rupee = 10000 units) and turned
// back into rupees at the end. Adding decimals directly gives answers like
// 0.30000000000000004, and then the daily totals would not match the total.
const MONEY_UNITS = 10000;

function toUnits(rupees) {
  return Math.round(rupees * MONEY_UNITS);
}

function toRupees(units) {
  return units / MONEY_UNITS;
}

// A message has a usable cost only when it is a real number, 0 or more
function hasCost(message) {
  return (
    typeof message.cost === "number" &&
    Number.isFinite(message.cost) &&
    message.cost >= 0
  );
}

// GET /api/analytics/dashboard?range=today
// range = today | yesterday | last15days | thisMonth | lastMonth
// Returns the numbers for the dashboard cards and charts. Only counts and
// totals are sent, never phone numbers or message text.
router.get("/dashboard", requireLogin, (req, res) => {
  const rangeName = req.query.range;

  if (typeof rangeName !== "string" || !RANGE_NAMES.includes(rangeName)) {
    return res.status(400).json({
      error: `Unknown date range. Use one of: ${RANGE_NAMES.join(", ")}.`,
    });
  }

  const { start, end, firstDay, lastDay } = getDateRange(rangeName);

  // A user only ever sees their own messages
  const messages = findMessagesInRange(req.user.id, start, end);

  // One empty box for each day, so a day without messages shows as 0
  const days = new Map();
  for (const dateKey of listDateKeys(firstDay, lastDay)) {
    days.set(dateKey, { date: dateKey, messagesSent: 0, costUnits: 0 });
  }

  // One counter for each status. "other" catches a status we do not know.
  const statusCounts = { other: 0 };
  for (const status of MESSAGE_STATUSES) {
    statusCounts[status] = 0;
  }

  let messagesSent = 0;
  let deliveredMessages = 0;
  let totalCostUnits = 0;
  let messagesMissingCost = 0;

  for (const message of messages) {
    const day = days.get(toDateKey(new Date(message.createdAt)));
    const isSent = SENT_STATUSES.includes(message.status);

    if (MESSAGE_STATUSES.includes(message.status)) {
      statusCounts[message.status] = statusCounts[message.status] + 1;
    } else {
      statusCounts.other = statusCounts.other + 1;
    }

    if (isSent) {
      messagesSent = messagesSent + 1;
      day.messagesSent = day.messagesSent + 1;
    }

    if (DELIVERED_STATUSES.includes(message.status)) {
      deliveredMessages = deliveredMessages + 1;
    }

    if (hasCost(message)) {
      const units = toUnits(message.cost);
      totalCostUnits = totalCostUnits + units;
      day.costUnits = day.costUnits + units;
    } else if (isSent) {
      // A sent message with no cost is not free, its cost is unknown.
      // Count it, so the dashboard can say the total is not complete.
      messagesMissingCost = messagesMissingCost + 1;
    }
  }

  const dailyData = [...days.values()].map((day) => ({
    date: day.date,
    messagesSent: day.messagesSent,
    totalCost: toRupees(day.costUnits),
  }));

  // Leave out "other" when there is nothing in it
  const statusBreakdown = Object.entries(statusCounts)
    .filter(([status, count]) => status !== "other" || count > 0)
    .map(([status, count]) => ({ status, count }));

  res.json({
    range: rangeName,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
    timezone: BUSINESS_TIMEZONE,
    currency: CURRENCY,
    summary: {
      totalAttempts: messages.length,
      messagesSent,
      deliveredMessages,
      failedMessages: statusCounts.failed,
      pendingMessages: statusCounts.pending,
      totalCost: toRupees(totalCostUnits),
      messagesMissingCost,
    },
    dailyData,
    statusBreakdown,
  });
});

module.exports = router;
