import { differenceInDays, differenceInHours, isBefore } from "date-fns";

export const EXPRIATION_THRESHOLD_DAYS = 30;

export function getLicenseExpirationStatus(expiresAt: string) {
  const expiryDate = new Date(expiresAt);
  const now = new Date();

  if (isBefore(expiryDate, now)) {
    return { isExpired: true, isExpiringSoon: false, daysLeft: 0, hoursLeft: 0 };
  }

  const daysLeft = differenceInDays(expiryDate, now);
  const totalHoursLeft = differenceInHours(expiryDate, now);
  const hoursLeft = totalHoursLeft % 24;
  
  const isExpiringSoon = daysLeft <= EXPRIATION_THRESHOLD_DAYS;

  return { isExpired: false, isExpiringSoon, daysLeft, hoursLeft };
}
