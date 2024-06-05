import { DateTime } from 'luxon';
import type {
  ChartData,
  StackChartData,
  StackDataType,
} from '../../components';
import type { FoodLog } from '..';
import type { NutrientType } from '../../models';

const getColorForMacro = (macro: NutrientType): string => {
  switch (macro) {
    case 'fat':
      return 'rgba(139, 92, 246, 1)';
    case 'protein':
      return 'rgba(16, 185, 129, 1)';
    case 'carbs':
      return 'rgba(14, 165, 233, 1)';
    default:
      return 'rgba(245, 158, 11, 1)';
  }
};

const getDefaultStacks = (types: NutrientType[]): StackDataType[] => {
  return types.map((item) => {
    return {
      value: 0,
      color: getColorForMacro(item),
    };
  });
};

export const prepareWeekly = (
  mealLogs: FoodLog[],
  type: NutrientType,
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

  mealLogs.forEach((mealItem) => {
    const dayOfWeek = DateTime.fromISO(mealItem.eventTimestamp).toFormat('EEE');
    const caloriesAmount = mealItem.foodItems
      .flatMap((item) =>
        item.nutrients.filter((nutrient) => nutrient.id === type)
      )
      .reduce((sum, nutrient) => sum + nutrient.amount, 0);

    sumByLabel[dayOfWeek] += caloriesAmount;
  });

  const chartData: ChartData[] = Object.entries(sumByLabel).map(
    ([dayOfWeek, value]) => ({
      label: dayOfWeek,
      value: value,
    })
  );

  return chartData;
};

// Monthly

const sumValuesByColor = (data: StackDataType[]): StackDataType[] => {
  const sumsMap: Record<string, number> = {};
  // Calculate sums for each color
  data.forEach(({ value, color }) => {
    sumsMap[color] = (sumsMap[color] || 0) + value;
  });
  // Transform sums back into StackDataType objects
  const result: StackDataType[] = Object.entries(sumsMap).map(
    ([color, value]) => ({
      color,
      value,
    })
  );

  return result;
};

export const prepareMonthlyStackChartData = (
  mealLogs: FoodLog[],
  startDate: Date,
  endDate: Date,
  format: string,
  types: NutrientType[]
): StackChartData[] => {
  const sumByLabel: Record<string, StackDataType[]> = {};

  let dayLabels = getDates(startDate, endDate, format);

  // Initialize sumByLabel with empty stacks for each day
  dayLabels.forEach((dayLabel) => {
    sumByLabel[dayLabel] = [];
  });

  mealLogs.forEach((mealItem) => {
    const dayOfWeek = DateTime.fromISO(mealItem.eventTimestamp).toFormat(
      format
    );
    const nutrients = mealItem.foodItems.flatMap((item) => item.nutrients);

    const macros = types;
    let sums: Record<NutrientType | string, number> = {};
    types.forEach((type) => {
      sums[type] = 0;
    });

    nutrients.forEach((nutrient) => {
      if (macros.includes(nutrient.id)) {
        sums[nutrient.id] = (sums[nutrient.id] ?? 0) + nutrient.amount;
      }
    });

    const previousStack = sumByLabel[dayOfWeek];
    const newStack = macros.map((macro) => ({
      color: getColorForMacro(macro),
      value: Math.round(sums[macro] ?? 0),
    }));

    const combine = [...(previousStack ?? []), ...newStack];

    sumByLabel[dayOfWeek] = sumValuesByColor(combine);
  });

  const chartData: StackChartData[] = dayLabels.map((dayLabel) => {
    const total = sumByLabel[dayLabel]?.length ?? 0;
    let stocks = sumByLabel[dayLabel]?.sort((a, b) => a.value - b.value) ?? [];
    let updatedStock: StackDataType[] = [];
    stocks.forEach((i, index) => {
      if (index === 0) {
        updatedStock.push(i);
      } else {
        updatedStock.push({
          ...i,
          value: i.value + (updatedStock[index - 1]?.value ?? 0),
        });
      }
    });
    return {
      label: dayLabel,
      stacks: total > 0 ? updatedStock : getDefaultStacks(types),
    };
  });

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
