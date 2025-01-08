import { DateTime } from 'luxon';

var days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const suffixGenerator = (num: number) => {
  var j = num % 10,
    k = num % 100;
  if (j === 1 && k !== 11) {
    return num + 'st';
  }
  if (j === 2 && k !== 12) {
    return num + 'nd';
  }
  if (j === 3 && k !== 13) {
    return num + 'rd';
  }
  return num + 'th';
};

export const dateFormatter = (date: Date) => {
  let dayName = days[date.getDay()];
  let getMonth = monthNames[date.getMonth()]?.substr(0, 3);
  let getDay = suffixGenerator(date.getDate());
  let getYear = date.getFullYear();

  return `${dayName}, ${getMonth} ${getDay} ${getYear}`;
};
export const dayFormatterPhotoLogging = (date: Date) => {
  return DateTime.fromJSDate(date).toFormat('dd/MM/yyyy');
};

//converted date to 'dd'T'HH:mm:ss'Z'' format
/*2021-09-15T12:00:00.000Z*/
export function convertDateToDBFormat(date: Date) {
  return date.toISOString();
}

export const timeFormatter = (date: Date) => {
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
};
