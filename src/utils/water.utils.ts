import { DateTime } from 'luxon';
import type { Water } from '../models';
import type { WaterSections } from '../screens/water/useWaters';

// Function to convert water array to WaterSections array
export function convertToWaterSections(water: Water[]): WaterSections[] {
  let data: WaterSections[] = [];

  const record: Record<string, Water[]> = {};

  water.forEach((item) => {
    const displayDate = DateTime.fromISO(item.day)
      .toFormat('EEE, MM dd')
      .toString();
    const previousWater = record[displayDate];
    record[displayDate] = [...(previousWater ?? []), item];
  });

  for (const day in record) {
    if (Object.prototype.hasOwnProperty.call(record, day)) {
      data.push({
        title: day,
        data: record[day] ?? [],
      });
    }
  }

  return data;
}
