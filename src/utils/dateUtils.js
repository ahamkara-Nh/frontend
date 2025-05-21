export const calculateWeekAndDay = (createdAtUTC) => {
    if (!createdAtUTC) {
        console.warn('Invalid date provided to calculateWeekAndDay');
        return { week: 1, day: 1 };
    }

    // Convert UTC string to Date object
    const startDate = new Date(createdAtUTC);

    // Check if date parsing succeeded
    if (isNaN(startDate.getTime())) {
        console.warn('Invalid date format provided to calculateWeekAndDay');
        return { week: 1, day: 1 };
    }

    // Get current date in user's timezone
    const currentDate = new Date();

    // For production, consider using a DEBUG flag to control logging
    if (process.env.NODE_ENV !== 'production') {
        console.log('Date calculation debug:', {
            createdAtUTC,
            startDate: startDate.toISOString(),
            currentDate: currentDate.toISOString(),
        });
    }

    // Calculate difference in days
    const diffTime = Math.abs(currentDate - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Calculate week (1-based) and day (1-based)
    const week = Math.floor(diffDays / 7) + 1;
    const day = (diffDays % 7) + 1;

    // For production, consider using a DEBUG flag to control logging
    if (process.env.NODE_ENV !== 'production') {
        console.log('Progress calculation debug:', {
            diffTime,
            diffDays,
            week,
            day
        });
    }

    return { week, day };
};