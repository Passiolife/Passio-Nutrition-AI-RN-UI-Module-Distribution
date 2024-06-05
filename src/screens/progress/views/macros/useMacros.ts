import { SwitchTabLabelEnum } from './../../../../types/myProgress';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getMealLogsFormDateToDate } from '../../../../utils/DataServiceHelper';
import { useServices } from '../../../../contexts';
import type {
  CalendarCarouselRef,
  StackChartData as StackChartData,
} from '../../../../components';
import { prepareMonthlyStackChartData as prepareMacroChartData } from '../../progress.utils';
import { useTargetMacros } from '../../../.../../../hooks';
import { useIsFocused } from '@react-navigation/native';

interface Data {
  calories: StackChartData[];
  macroChartData: StackChartData[];
}

export const useMacros = () => {
  const services = useServices();
  const calendarCarouselRef = useRef<CalendarCarouselRef>(null);
  const { targetCarbs, targetFat, targetProtein, targetCalories } =
    useTargetMacros();
  const [loading, setLoading] = useState<boolean>(false);
  const [chartData, setChartData] = useState<Data | null>(null);

  const fetchData = useCallback(
    async (start: Date, end: Date, type: SwitchTabLabelEnum) => {
      setLoading(true);
      try {
        const mealLogs = await getMealLogsFormDateToDate(start, end, services);
        const format = type === SwitchTabLabelEnum.Month ? 'MMM dd' : 'EEE';
        const caloriesData = prepareMacroChartData(
          mealLogs,
          start,
          end,
          format,
          ['calories']
        );
        const macrosData = prepareMacroChartData(mealLogs, start, end, format, [
          'carbs',
          'fat',
          'protein',
        ]);
        setChartData({
          calories: [],
          macroChartData: [],
        });
        setChartData({
          calories: caloriesData,
          macroChartData: macrosData,
        });
      } catch (error) {
      } finally {
        setLoading(false);
      }
    },
    [services]
  );

  const isFocus = useIsFocused();

  useEffect(() => {
    if (isFocus) {
      const startDate = calendarCarouselRef?.current?.getStartDate();
      const endDate = calendarCarouselRef?.current?.getEndDate();
      const type = calendarCarouselRef?.current?.getCalendarType();

      if (startDate && endDate && type) {
        fetchData(startDate, endDate, type);
      }
    }
  }, [fetchData, isFocus]);

  return {
    macroChartData: chartData?.macroChartData ?? [],
    calendarCarouselRef,
    loading,
    calories: chartData?.calories ?? [],
    targetCalories,
    targetCarbs,
    targetFat,
    targetProtein,
    fetchData,
  };
};
