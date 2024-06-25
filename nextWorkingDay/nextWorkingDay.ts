import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { HolidayDays, holidayDays } from '../test-data/holidayTable';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Warsaw');

const isWeekendOrHoliday = (date: Dayjs): boolean => {
    const dayOfWeek: number = date.day();
    const dateString = date.format('YYYY-MM-DD');

    const isWeekend = (): boolean => dayOfWeek === 0 || dayOfWeek === 6;

    const isHoliday = (): boolean =>
        holidayDays.some(
            (holiday: HolidayDays) =>
                holiday.swi_Data.slice(0, 10) === dateString,
        );
    return isWeekend() || isHoliday();
};

const isLastDayOfMonth = (date: dayjs.Dayjs): boolean => {
    return date.isSame(date.endOf('month'), 'day');
};

// Requirements in procedure: DEL_SP_MassPayments_GetValidDate
export const setPaymentDayAsPermittedDay = (date: Dayjs) => {
    let nextDay = date;
    while (isWeekendOrHoliday(nextDay) || isLastDayOfMonth(nextDay)) {
        nextDay = nextDay.add(1, 'day');
    }
    return nextDay;
};

export const getRandomNumberOfDays = ({
    min,
    max,
}: {
    min: number;
    max: number;
}): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
