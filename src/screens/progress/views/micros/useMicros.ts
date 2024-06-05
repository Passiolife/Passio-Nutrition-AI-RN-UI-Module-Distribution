import { useCallback, useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import type { Nutrient } from '../../../../models';
import { useServices } from '../../../../contexts';
import { getMealLogsForDate } from '../../../../utils/DataServiceHelper';
import { mergeNutrients } from '../../../../utils/NutritentsUtils';
import { useIsFocused } from '@react-navigation/native';
export const useMicros = () => {
  const services = useServices();

  const [dateTime, setDateTime] = useState<DateTime>(DateTime.now());
  const [nutrients, setNutrients] = useState<Nutrient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMore, setMore] = useState<boolean>(false);
  const [isInfo, setInfo] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const fetchData = useCallback(
    async (time: DateTime) => {
      setLoading(true);
      try {
        const mealLogs = await getMealLogsForDate(time.toJSDate(), services);
        if (mealLogs) {
          const filteredNutrients = mergeNutrients(
            mealLogs.flatMap((item) =>
              item.foodItems.flatMap((s) =>
                s.nutrients.filter(
                  (n) =>
                    !['calories', 'protein', 'carbs', 'fat', 'weight'].includes(
                      n.id
                    )
                )
              )
            )
          );

          setNutrients(filteredNutrients);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    },
    [services]
  );

  useEffect(() => {
    if (isFocused) {
      fetchData(dateTime);
    }
  }, [dateTime, fetchData, isFocused, services]);

  const changeDateTime = useCallback((amount: number) => {
    setDateTime((prevDateTime) => prevDateTime.plus({ day: amount }));
  }, []);

  const onMorePress = useCallback(() => {
    setMore((more) => !more);
  }, []);

  const onLeftArrowPress = useCallback(() => {
    changeDateTime(-1);
  }, [changeDateTime]);

  const onRightArrowPress = useCallback(() => {
    changeDateTime(1);
  }, [changeDateTime]);

  const onInfoPress = useCallback(() => {
    setInfo((i) => !i);
  }, []);

  return {
    dateTime,
    isMore,
    loading,
    nutrients: isMore ? nutrients : nutrients.slice(0, 10),
    isInfo,
    onLeftArrowPress,
    onMorePress,
    onRightArrowPress,
    onInfoPress,
  };
};
