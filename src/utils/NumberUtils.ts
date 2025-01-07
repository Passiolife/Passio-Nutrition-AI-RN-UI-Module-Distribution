export const NumberTwoDigit = (number?: number) => {
  return number?.toFixed(2);
};
export const NumberRound = (number?: number) => {
  return Math.round(number ?? 0);
};

export function formatNumber(num: number | undefined) {
  if (num === 0) {
    return 0;
  }
  if (num === undefined) {
    return 0;
  }
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

export function validateQuantityInput(input: string) {
  // Use regex to allow only valid numbers with at most one decimal point
  const validFormat = /^[0-9]*(\.[0-9]*)?$/;

  // If input matches valid format, return it as-is
  if (validFormat.test(input)) {
    return input;
  }

  // If input is invalid, extract the first valid number
  const validNumberMatch = input.match(/[0-9]+(\.[0-9]*)?/);
  return validNumberMatch ? validNumberMatch[0] : ''; // Return valid number or empty string
}
