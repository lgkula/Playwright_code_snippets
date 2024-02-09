import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { holidaysDays } from '../test-data/holidayTable';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Europe/Warsaw');

const isWeekendOrHoliday = (date: Dayjs) => {
    const dayOfWeek = date.day();
    const dateString = date.format('YYYY-MM-DD');

    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const isHoliday = holidaysDays.some(
        (holiday) => holiday.swi_Data.slice(0, 10) === dateString,
    );
    return isWeekend || isHoliday;
};

export const setPaymentDayInWorkingDay = (date: Dayjs) => {
    // let nextDay = dayjs.tz(date);
    let nextDay = date;
    while (isWeekendOrHoliday(nextDay)) {
        nextDay = nextDay.add(1, 'day');
    }
    return nextDay;
};
