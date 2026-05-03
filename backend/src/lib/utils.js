export function getPermissions(cargo) {
  if (!Array.isArray(cargo?.permissoes)) return [];
  return cargo.permissoes;
}

/**
 * Parse and validate date range for filtering
 * Default: 1st day of current year until now
 * If startDate provided without endDate: startDate until now
 * If both provided: use them (returns null if endDate < startDate)
 * @param {string|undefined} startDate - ISO date string
 * @param {string|undefined} endDate - ISO date string
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
