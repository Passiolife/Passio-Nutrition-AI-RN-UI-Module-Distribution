import type { StackNavigationProp } from '@react-navigation/stack';
import { useMealLogs } from '../meallogss/useMealLogs';
import type { ParamList } from '../../navigaitons';
import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { useNutritionProfile } from '../nutritionProfile/useNutritionProfile';
import { useEffect, useState } from 'react';
import { useServices } from '../../contexts';
import {
  getLatestWeight,
  getWatersForDate,
} from '../../utils/DataServiceHelper';
import { totalWater } from '../water/waterUtils';
import { averageWeight } from '../weight/views/weightentry/Weight.utils';

type ScreenNavigationProps = StackNavigationProp<ParamList, 'HomeScreen'>;

export function useHome() {
  const isFocused = useIsFocused();
  const services = useServices();
  const navigation = useNavigation<ScreenNavigationProps>();
  const { params } = useRoute<RouteProp<ParamList, 'HomeScreen'>>();

  const [remainWater, setRemainWater] = useState(0);
  const [achievedWater, setAchievedWater] = useState(0);

  const [remainWeight, setRemainWeight] = useState(0);
  const [achievedWeight, setAchievedWeight] = useState(0);

  const {
    name,
    targetWater,
    targetWeight,
    unitOfWater,
    unitOfWeight,
    unitsWeight,
  } = useNutritionProfile();

  const { foodLogs, date, openDatePicker, changeDate, isOpenDatePicker } =
    useMealLogs();

  const onWaterPress = () => {
    navigation.navigate('WaterScreen');
  };
  const onWeightPress = () => {
    navigation.navigate('WeightScreen');
  };

  useEffect(() => {
    if (isFocused) {
      getWatersForDate(date, services).then((data) => {
        const total = totalWater(data, unitsWeight);
        const target = Number(targetWater ?? 0) - total;
        setRemainWater(target);
        setAchievedWater(total);
      });
    }
  }, [date, isFocused, services, targetWater, unitsWeight]);

  useEffect(() => {
    if (isFocused) {
      getLatestWeight(services).then((data) => {
        let total = 0;
        if (data) {
          total = averageWeight(data, unitsWeight);
        }
        const target = Number(targetWeight ?? 0) - total;
        setRemainWeight(target);
        setAchievedWeight(total);
      });
    }
  }, [date, isFocused, services, targetWeight, unitsWeight]);
  useEffect(() => {}, [targetWeight]);

  return {
    achievedWater,
    navigation,
    achievedWeight,
    date,
    foodLogs,
    isOpenDatePicker,
    name,
    remainWater,
    params,
    remainWeight,
    targetWeight,
    unitOfWater,
    unitOfWeight,
    changeDate,
    onWaterPress,
    onWeightPress,
    openDatePicker,
  };
}
