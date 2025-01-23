import { useCallback, useState } from 'react';
import type { ParamList } from '../../navigaitons';
import { useRoute, type RouteProp } from '@react-navigation/native';

export const useNutritionInformation = () => {
  const { params } =
    useRoute<RouteProp<ParamList, 'NutritionInformationScreen'>>();

  const [isInfo, setInfo] = useState<boolean>(true);

  const onInfoPress = useCallback(() => {
    setInfo((i) => !i);
  }, []);

  return {
    nutrients: params.nutrient.filter(
      (i) =>
        i.id !== 'weight' &&
        i.id !== 'calories' &&
        i.id !== 'carbs' &&
        i.id !== 'fat' &&
        i.id !== 'protein'
    ),
    onInfoPress,
    isInfo,
    foodLog: params.foodLog,
  };
};
