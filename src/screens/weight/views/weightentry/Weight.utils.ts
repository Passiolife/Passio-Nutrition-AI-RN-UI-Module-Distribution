import { DateTime } from 'luxon';
import type { WeightTrendChart } from '../../linechart/lineChart';
import { UnitSystem, type Weight } from '../../../../models';
import { convertKGToPounds } from '../../../../screens/nutritionProfile/unitConversions';

export const averageWeight = (weights: Weight, unit: UnitSystem): number => {
  return unit === UnitSystem.IMPERIAL
    ? convertKGToPounds(Number(weights.weight ?? 0))
    : Number(weights.weight ?? 0);
};

export const prepPareWeightChart = (
  isImperialWeight: boolean,
  weights: Weight[],
  startDate: Date,
  endDate: Date,
  format: string
): WeightTrendChart[] => {
  let dayLabels = getDates(startDate, endDate, format);
  let sumByLabel: Record<string, number> = {};
  // Initialize sumByLabel with empty stacks for each day
  dayLabels.forEach((dayLabel) => {
    sumByLabel[dayLabel] = 0;
  });

  weights.forEach((mealItem) => {
    const dayOfWeek = DateTime.fromISO(mealItem.day).toFormat(format);
    sumByLabel[dayOfWeek] += isImperialWeight
      ? convertKGToPounds(Number(mealItem.weight))
      : Number(mealItem.weight);
  });

  const chartData: WeightTrendChart[] = Object.entries(sumByLabel).map(
    ([dayOfWeek, value]) => ({
      label: dayOfWeek,
      value: value,
    })
  );

  return chartData;
};

function getDates(startDate: Date, endDate: Date, format: string): string[] {
  const dates: string[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(DateTime.fromJSDate(new Date(currentDate)).toFormat(format));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
