import { UnitSystem } from './../../models/UnitSystem';
import { DateTime } from 'luxon';
import type { Water } from '../../models';
import type { ChartData } from '../../components';
import { convertMlToOg } from '../nutritionProfile/unitConversions';

export const totalWater = (waters: Water[], unit: UnitSystem): number => {
  let water = 0;
  waters.forEach((item) => {
    water =
      water +
      (unit === UnitSystem.IMPERIAL
        ? convertMlToOg(Number(item.consumed))
        : Number(item.consumed));
  });
  return water;
};

export const prepareWeekly = (
  isImperialWeight: boolean,
  waters: Water[],
  startDate: Date,
  endDate: Date,
  format: string
): ChartData[] => {
  let dayLabels = getDates(startDate, endDate, format);
  let sumByLabel: Record<string, number> = {};
  // Initialize sumByLabel with empty stacks for each day
  dayLabels.forEach((dayLabel) => {
    sumByLabel[dayLabel] = 0;
  });

  waters.forEach((mealItem) => {
    const dayOfWeek = DateTime.fromISO(mealItem.day).toFormat(format);
    sumByLabel[dayOfWeek] += isImperialWeight
      ? convertMlToOg(Number(mealItem.consumed))
      : Number(mealItem.consumed);
  });

  const chartData: ChartData[] = Object.entries(sumByLabel).map(
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
