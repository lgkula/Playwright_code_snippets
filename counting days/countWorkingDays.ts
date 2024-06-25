import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { isWeekendOrHoliday } from './checkIfWorkingDay';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Warsaw');

export const countWorkingDays = ({
  numberOfDaysToAdd = 14,
  dateStart = dayjs.tz(),
  dateFormat = "YYYY-MM-DD",
}: {
  numberOfDaysToAdd?: number;
  dateStart?: Dayjs;
  dateFormat?: string;
}): string => {
  if (!Number.isInteger(numberOfDaysToAdd) || numberOfDaysToAdd < 1) {
    throw new Error("Number of days to add must be a positive integer");
  }
  let nextDay: Dayjs = dateStart;

  while (numberOfDaysToAdd > 0) {
    nextDay = nextDay.add(1, "day");
    if (!isWeekendOrHoliday(nextDay)) {
      numberOfDaysToAdd--;
    }
  }
  return nextDay.format(dateFormat);
};


// Template run
console.log(countWorkingDays({}));
