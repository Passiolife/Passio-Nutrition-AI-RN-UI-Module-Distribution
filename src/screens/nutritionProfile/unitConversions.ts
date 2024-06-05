export const convertInchesToCM = (inches: number) => inches * 2.54;

export const convertCMToInches = (cm: number) => cm / 2.54;

export const convertPoundsToKG = (lbs: number) => lbs / 2.204622622;

export const convertKGToPounds = (kgs: number) => kgs * 2.204622622;

export const convertOgToMl = (og: number) => og / 0.0338;
export const convertMlToOg = (ml: number) => ml * 0.0338;

export const convertCMToFeet = (cm: number) => {
  const totalInches = convertCMToInches(cm);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return { feet, inches };
};

export const convertCMToMeters = (totalCm: number) => {
  const meters = Math.floor(totalCm / 100);
  const centimeters = totalCm % 100;
  return { meters, centimeters };
};
