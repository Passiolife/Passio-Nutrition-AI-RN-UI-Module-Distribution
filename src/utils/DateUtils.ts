export function currentTimeStamp(): Date {
  return new Date(Date.now());
}

export const isToday = (data: Date) => {
  const today = currentTimeStamp();
  return (
    data.getDate() === today.getDate() &&
    data.getMonth() === today.getMonth() &&
    data.getFullYear() === today.getFullYear()
  );
};

export function convertToPreviousMidnight(convertDate: Date): Date {
  const startDate = new Date(convertDate.getTime());
  startDate.setUTCHours(0, 0o0, 0o0, 0o0);
  return startDate;
}

export function convertToNextMidnight(convertDate: Date): Date {
  const endDate = new Date(convertDate.getTime());
  endDate.setUTCHours(23, 59, 59, 59);
  return endDate;
}

export const getOneWeek = () => {
  let currentDate = new Date();
  var last = currentDate.getDate(); // First day is the day of the month - the day of the week
  var first = last - 6; // last day is the first day + 6

  return {
    firstday: convertToPreviousMidnight(new Date(currentDate.setDate(first))),
    lastday: convertToNextMidnight(new Date()),
  };
};

export const getTwoWeek = () => {
  let currentDate = new Date();
  var last = currentDate.getDate(); // First day is the day of the month - the day of the week
  var first = last - 12; // last day is the first day + 6

  return {
    firstday: convertToPreviousMidnight(new Date(currentDate.setDate(first))),
    lastday: convertToNextMidnight(new Date()),
  };
};

export const getOneMonth = () => {
  let currentDate = new Date();
  let last = currentDate.setMonth(currentDate.getMonth() - 1);
  return {
    firstday: convertToPreviousMidnight(new Date(last)),
    lastday: convertToNextMidnight(new Date()),
  };
};

export function substrateDate(day: number): Date {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - day);
  return currentDate;
}

export const getDateWeekNumber = (date: Date) => {
  const currentDate = typeof date === 'object' ? date : new Date();
  const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
  const daysToNextMonday =
    januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7;
  const nextMonday = new Date(
    currentDate.getFullYear(),
    0,
    januaryFirst.getDate() + daysToNextMonday
  );

  if (currentDate < nextMonday) {
    return 52; // Still part of the previous year
  } else if (currentDate > nextMonday) {
    const daysDifference =
      ((currentDate as any) - (nextMonday as any)) / (24 * 3600 * 1000);
    return Math.ceil(daysDifference / 7);
  } else {
    return 1; // First week of the year
  }
};

export const getWeekDatesUsingWeekNumber = (
  weekNumber: number,
  year: number
) => {
  // Create a date object for January 1st of the specified year
  const januaryFirst = new Date(year, 0, 1);

  // Calculate the number of days to the next Monday from January 1st
  const daysToNextMonday =
    januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7;

  // Calculate the date of the next Monday following January 1st
  const nextMonday = new Date(
    year,
    0,
    januaryFirst.getDate() + daysToNextMonday
  );

  // Calculate the start date of the specified week
  const startDate = new Date(nextMonday);
  startDate.setDate(nextMonday.getDate() + (weekNumber - 1) * 7);

  // Initialize an array to store the week's dates
  const weekArray = [];

  // Loop through the weekdays (Monday to Friday) and add each date to the array
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    weekArray.push(currentDate.toISOString().split('T')[0]); // Format as 'YYYY-MM-DD'
  }

  return weekArray;
};
