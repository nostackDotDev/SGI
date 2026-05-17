export function getPermissions(cargo) {
  if (!Array.isArray(cargo?.permissoes)) return [];
  return cargo.permissoes;
}

/**
 * Parse and validate date range for filtering
 * startDate is always mapped to the START of that day (00:00:00)
 * endDate is always mapped to the END of that day (23:59:59.999)
 * Default: 1st day of current year until now
 * If startDate provided without endDate: startDate until now
 * If both provided: use them (returns null if endDate < startDate)
 * @param {string|undefined} startDate - ISO date string or date-only string (YYYY-MM-DD)
 * @param {string|undefined} endDate - ISO date string or date-only string (YYYY-MM-DD)
 * @returns {Object} { startDate: Date, endDate: Date, isInvalid: boolean }
 */
export function parseDateRange(startDate, endDate) {
  const now = new Date();
  const currentYear = now.getFullYear();

  let parsedStartDate;
  let parsedEndDate;
  let isInvalid = false;

  try {
    // Default: 1st day of current year
    parsedStartDate = startDate
      ? new Date(startDate)
      : new Date(currentYear, 0, 1);

    // Default: now
    parsedEndDate = endDate ? new Date(endDate) : now;

    // Check if dates are valid
    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      isInvalid = true;
    }

    // Always set startDate to START of day (00:00:00.000)
    parsedStartDate.setHours(0, 0, 0, 0);

    // Always set endDate to END of day (23:59:59.999)
    parsedEndDate.setHours(23, 59, 59, 999);

    // Check if endDate < startDate
    if (parsedEndDate < parsedStartDate) {
      isInvalid = true;
    }

    return {
      startDate: parsedStartDate,
      endDate: parsedEndDate,
      isInvalid,
    };
  } catch (error) {
    return {
      startDate: null,
      endDate: null,
      isInvalid: true,
    };
  }
}
