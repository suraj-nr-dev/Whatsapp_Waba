// Works out the start and end time of the dashboard date filters.
//
// "Today" must mean today for the business, not for the computer the server
// runs on (a hosted server is often set to UTC). So every day starts at
// midnight in the business timezone, which is set in the .env file.
const BUSINESS_TIMEZONE = process.env.BUSINESS_TIMEZONE || "Asia/Kolkata";

// The filters the dashboard can ask for
const RANGE_NAMES = [
  "today",
  "yesterday",
  "last15days",
  "thisMonth",
  "lastMonth",
];

const ONE_DAY = 24 * 60 * 60 * 1000;

// Reads the calendar date and clock time that "date" has in the business
// timezone. Example: 2026-10-09T20:00Z is 10 Oct, 01:30 in Asia/Kolkata.
const partsFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: BUSINESS_TIMEZONE,
  hourCycle: "h23",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
});

function getBusinessParts(date) {
  const parts = {};
  for (const part of partsFormatter.formatToParts(date)) {
    if (part.type !== "literal") {
      parts[part.type] = Number(part.value);
    }
  }
  return parts;
}

// How far the business timezone is ahead of UTC at that moment, in
// milliseconds. For Asia/Kolkata this is always +5:30.
function getOffset(date) {
  const p = getBusinessParts(date);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  // Drop the milliseconds, because the parts above do not have them
  return asUtc - Math.floor(date.getTime() / 1000) * 1000;
}

// Returns the exact moment a calendar day starts in the business timezone.
// "day" may be 0, negative or past the end of the month: Date.UTC moves it
// into the right month and year, so month ends and leap years just work.
function startOfBusinessDay(year, month, day) {
  const guess = Date.UTC(year, month - 1, day);
  const firstTry = guess - getOffset(new Date(guess));
  // Ask again at the answer, in case the clocks changed that night
  return new Date(guess - getOffset(new Date(firstTry)));
}

// Turns a moment into its business calendar date as text: "2026-10-10"
function toDateKey(date) {
  const p = getBusinessParts(date);
  const month = String(p.month).padStart(2, "0");
  const day = String(p.day).padStart(2, "0");
  return `${p.year}-${month}-${day}`;
}

// Writes a calendar day as text: "2026-10-10". Like startOfBusinessDay,
// "day" may be 0 or negative and still gives the right date.
function makeDateKey(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day)).toISOString().slice(0, 10);
}

// Returns the details of a filter name, or null if the name is unknown:
//   start, end        = the time range. start is included and end is not:
//                       start <= time < end
//   firstDay, lastDay = the first and last calendar day shown in the chart
// A period that is still running (today, this month) ends at "now".
function getDateRange(rangeName, now = new Date()) {
  const { year, month, day } = getBusinessParts(now);
  const todayKey = makeDateKey(year, month, day);

  switch (rangeName) {
    case "today":
      return {
        start: startOfBusinessDay(year, month, day),
        end: now,
        firstDay: todayKey,
        lastDay: todayKey,
      };

    case "yesterday":
      return {
        start: startOfBusinessDay(year, month, day - 1),
        end: startOfBusinessDay(year, month, day),
        firstDay: makeDateKey(year, month, day - 1),
        lastDay: makeDateKey(year, month, day - 1),
      };

    // Today and the 14 days before it = 15 days
    case "last15days":
      return {
        start: startOfBusinessDay(year, month, day - 14),
        end: now,
        firstDay: makeDateKey(year, month, day - 14),
        lastDay: todayKey,
      };

    case "thisMonth":
      return {
        start: startOfBusinessDay(year, month, 1),
        end: now,
        firstDay: makeDateKey(year, month, 1),
        lastDay: todayKey,
      };

    // Month 0 is understood as December of the year before,
    // and day 0 as the last day of the month before.
    case "lastMonth":
      return {
        start: startOfBusinessDay(year, month - 1, 1),
        end: startOfBusinessDay(year, month, 1),
        firstDay: makeDateKey(year, month - 1, 1),
        lastDay: makeDateKey(year, month, 0),
      };

    default:
      return null;
  }
}

// Lists every calendar day from firstDay to lastDay:
// ["2026-10-01", "2026-10-02", ...]
// The chart uses this so that a day without messages still shows as 0.
function listDateKeys(firstDay, lastDay) {
  const keys = [];
  let cursor = new Date(firstDay + "T00:00:00Z").getTime();

  while (true) {
    const key = new Date(cursor).toISOString().slice(0, 10);
    keys.push(key);
    if (key >= lastDay) {
      break;
    }
    cursor = cursor + ONE_DAY;
  }

  return keys;
}

module.exports = {
  BUSINESS_TIMEZONE,
  RANGE_NAMES,
  getDateRange,
  toDateKey,
  listDateKeys,
};
