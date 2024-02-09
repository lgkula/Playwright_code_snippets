export const convertStringToDate = (dateString: string): Date | null => {
    // Define months mapping
    const months: { [key: string]: number } = {
        stycznia: 0,
        lutego: 1,
        marca: 2,
        kwietnia: 3,
        maja: 4,
        czerwca: 5,
        lipca: 6,
        sierpnia: 7,
        września: 8,
        października: 9,
        listopada: 10,
        grudnia: 11,
    };

    // Split the input string
    const parts = dateString.split(' ');

    // Extract day, month, year, and time
    const day = parseInt(parts[0], 10);
    const month = months[parts[1]];
    const year = parseInt(parts[2], 10);
    const timeParts = parts[3].split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);

    // Check if all parts are valid
    if (
        isNaN(day) ||
        isNaN(month) ||
        isNaN(year) ||
        isNaN(hours) ||
        isNaN(minutes)
    ) {
        console.error('Invalid date format');
        return null;
    }

    // Create a Date object
    const convertedDate = new Date(year, month, day, hours, minutes);

    return convertedDate;
};
