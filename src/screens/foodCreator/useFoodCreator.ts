import { useRef, useState } from 'react';
import { useBranding, useServices } from '../../contexts';
import type { OtherNutritionFactsRef } from './views/OtherNutritionFacts';
import type { RequireNutritionFactsRef } from './views/RequireNutritionFacts';
import type { FoodCreatorFoodDetailRef } from './views/FoodCreatorFoodDetail';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';
import { createFoodLogUsingFoodCreator } from './FoodCreator.utils';
import type { CustomFood } from '../../models';

export type ScanningScreenNavigationProps = StackNavigationProp<
  ParamList,
  'FoodCreatorScreen'
>;

export const useFoodCreator = () => {
  const branding = useBranding();
  const services = useServices();
  const navigation = useNavigation<ScanningScreenNavigationProps>();
  const { params } = useRoute<RouteProp<ParamList, 'FoodCreatorScreen'>>();
  const [foodLog, _setFoodLog] = useState<CustomFood | undefined>(
    params.foodLog
  );

  const otherNutritionFactsRef = useRef<OtherNutritionFactsRef>(null);
  const requireNutritionFactsRef = useRef<RequireNutritionFactsRef>(null);
  const foodCreatorFoodDetailRef = useRef<FoodCreatorFoodDetailRef>(null);

  const onSavePress = async () => {
    const info = foodCreatorFoodDetailRef.current?.getValue();
    const requireNutritionFact = requireNutritionFactsRef.current?.getValue();
    const otherNutritionFact = otherNutritionFactsRef.current?.getValue();

    if (info?.isNotValid) {
      return;
    }
    if (requireNutritionFact?.isNotValid) {
      return;
    }
    if (otherNutritionFact?.isNotValid) {
      return;
    }

    if (
      info?.records &&
      requireNutritionFact?.records &&
      otherNutritionFact?.records
    ) {
      const modifiedFoodLog = createFoodLogUsingFoodCreator({
        info: info?.records,
        requireNutritionFact: requireNutritionFact?.records,
        otherNutritionFact: otherNutritionFact?.records,
      });

      try {
        await services.dataService.saveCustomFood(modifiedFoodLog);
        navigation.goBack();
      } catch {}
    }
  };

  return {
    branding,
    foodLog,
    otherNutritionFactsRef,
    requireNutritionFactsRef,
    foodCreatorFoodDetailRef,
    onSavePress,
  };
};
