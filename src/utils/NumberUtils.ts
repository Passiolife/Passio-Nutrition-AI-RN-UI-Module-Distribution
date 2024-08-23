export const NumberTwoDigit = (number?: number) => {
  return number?.toFixed(2);
};
export const NumberRound = (number?: number) => {
  return Math.round(number ?? 0);
};
