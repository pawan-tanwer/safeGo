const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

export const normalizePeriod = (input) => {
  if (input === undefined || input === null || input === "") return "today";
  const s = String(input).toLowerCase().replace(/[^a-z]/g, "");
  if (s === "today" || s === "day") return "today";
  if (s === "week" || s === "thisweek") return "week";
  if (s === "month" || s === "thismonth") return "month";
  return null;
};

export const getPeriodRange = (period, now = new Date()) => {
  // Shift the clock by +5:30, then read it with the UTC getters -> they now return IST fields.
  const ist = new Date(now.getTime() + IST_OFFSET_MS);
  const y = ist.getUTCFullYear();
  const m = ist.getUTCMonth();
  const d = ist.getUTCDate();

  let startAsIst; // midnight IST of the first day, expressed in "shifted" time
  switch (period) {
    case "today":
      startAsIst = Date.UTC(y, m, d);
      break;
    case "week": {
      const daysSinceMonday = (ist.getUTCDay() + 6) % 7; // Mon=0 ... Sun=6
      startAsIst = Date.UTC(y, m, d - daysSinceMonday);
      break;
    }
    case "month":
      startAsIst = Date.UTC(y, m, 1);
      break;
    default:
      return null;
  }

  // Shift back to a real UTC instant
  return { from: new Date(startAsIst - IST_OFFSET_MS), to: now };
};