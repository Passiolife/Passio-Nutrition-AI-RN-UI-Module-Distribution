import { convertPoundsToKG } from '../screens/nutritionProfile/unitConversions';
import { UnitSystem } from './UnitSystem';

export enum ActivityLevelType {
  notActive = 'Not Active',
  lightlyActive = 'Lightly Active',
  active = 'Active',
  moderatelyActive = 'Moderately Active',
}

export enum CaloriesDeficit {
  lose0_5 = 'lose0_5',
  lose1_0 = 'lose1_0',
  lose1_5 = 'lose1_5',
  lose2_0 = 'lose2_0',
  gain0_5 = 'gain0_5',
  gain1_0 = 'gain1_0',
  gain1_5 = 'gain1_5tely Active',
  gain2_0 = 'gain2_0',
  maintainWeight = 'maintainWeight',
}
export function getCaloriesDeficits(): Array<CaloriesDeficit> {
  return [
    CaloriesDeficit.lose0_5,
    CaloriesDeficit.lose1_0,
    CaloriesDeficit.lose1_5,
    CaloriesDeficit.lose2_0,
    CaloriesDeficit.gain0_5,
    CaloriesDeficit.gain1_0,
    CaloriesDeficit.gain1_5,
    CaloriesDeficit.gain2_0,
    CaloriesDeficit.maintainWeight,
  ];
}

export const getCaloriesSubtractionForDeficit: Record<CaloriesDeficit, number> =
  {
    [CaloriesDeficit.lose0_5]: -250,
    [CaloriesDeficit.lose1_0]: -500,
    [CaloriesDeficit.lose1_5]: -750,
    [CaloriesDeficit.lose2_0]: -1000,
    [CaloriesDeficit.gain0_5]: 250,
    [CaloriesDeficit.gain1_0]: 500,
    [CaloriesDeficit.gain1_5]: 750,
    [CaloriesDeficit.gain2_0]: 1000,
    [CaloriesDeficit.maintainWeight]: 0,
  };

export const getCaloriesDeficitWeightLabel = (
  unitWeight: UnitSystem,
  type: CaloriesDeficit
) => {
  let unit = 'lbs';
  if (unitWeight === UnitSystem.METRIC) {
    unit = 'kg';
  }
  if (type === CaloriesDeficit.lose0_5) {
    let weight = 0.5; //lbs
    if (unitWeight === UnitSystem.METRIC) {
      weight = Number(convertPoundsToKG(weight).toFixed(2));
    }
    return `Lose ${weight} ${unit}/week`;
  } else if (type === CaloriesDeficit.lose1_0) {
    let weight = 1.0; //lbs
    if (unitWeight === UnitSystem.METRIC) {
      weight = Number(convertPoundsToKG(weight).toFixed(2));
    }
    return `Lose ${weight} ${unit}/week`;
  } else if (type === CaloriesDeficit.lose1_5) {
    let weight = 1.5; //lbs
    if (unitWeight === UnitSystem.METRIC) {
      weight = Number(convertPoundsToKG(weight).toFixed(2));
    }
    return `Lose ${weight} ${unit}/week`;
  } else if (type === CaloriesDeficit.lose2_0) {
    let weight = 2.0; //lbs
    if (unitWeight === UnitSystem.METRIC) {
      weight = Number(convertPoundsToKG(weight).toFixed(2));
    }
    return `Lose ${weight} ${unit}/week`;
  } else if (type === CaloriesDeficit.gain0_5) {
    let weight = 0.5; //lbs
    if (unitWeight === UnitSystem.METRIC) {
      weight = Number(convertPoundsToKG(weight).toFixed(2));
    }
    return `Gain ${weight} ${unit}/week`;
  } else if (type === CaloriesDeficit.gain1_0) {
    let weight = 1.0; //lbs
    if (unitWeight === UnitSystem.METRIC) {
      weight = Number(convertPoundsToKG(weight).toFixed(2));
    }
    return `Gain ${weight} ${unit}/week`;
  } else if (type === CaloriesDeficit.gain1_5) {
    let weight = 2.5; //lbs
    if (unitWeight === UnitSystem.METRIC) {
      weight = Number(convertPoundsToKG(weight).toFixed(2));
    }
    return `Gain ${weight} ${unit}/week`;
  } else if (type === CaloriesDeficit.gain2_0) {
    let weight = 2; //lbs
    if (unitWeight === UnitSystem.METRIC) {
      weight = Number(convertPoundsToKG(weight).toFixed(2));
    }
    return `Gain ${weight} ${unit}/week`;
  } else if (type === CaloriesDeficit.maintainWeight) {
    return `Maintain Weight`;
  } else {
    return '';
  }
};
