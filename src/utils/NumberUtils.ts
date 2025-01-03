export const NumberTwoDigit = (number?: number) => {
  return number?.toFixed(2);
};
export const NumberRound = (number?: number) => {
  return Math.round(number ?? 0);
};

export function formatNumber(num: number | undefined) {
  if (num) {
    if (!isFinite(num)) return num; // Handle non-finite numbers like Infinity, NaN

    if (num > 10) {
      return Math.round(num);
    } else if (num > 1 && num < 10) {
      return Number(num.toFixed(1).replace(/\.0$/, ''));
    } else {
      return parseFloat(num.toFixed(1));
    }
  } else {
    return undefined;
  }
}
