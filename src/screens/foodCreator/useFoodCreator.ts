import { useRef } from 'react';
import { useBranding } from '../../contexts';
import type { OtherNutritionFactsRef } from './views/OtherNutritionFacts';
import type { RequireNutritionFactsRef } from './views/RequireNutritionFacts';
import type { FoodCreatorFoodDetailRef } from './views/FoodCreatorFoodDetail';

export const useFoodCreator = () => {
  const branding = useBranding();
  const otherNutritionFactsRef = useRef<OtherNutritionFactsRef>(null);
  const requireNutritionFactsRef = useRef<RequireNutritionFactsRef>(null);
  const foodCreatorFoodDetailRef = useRef<FoodCreatorFoodDetailRef>(null);

  const onSavePress = () => {
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
  };

  return {
    branding,
    otherNutritionFactsRef,
    requireNutritionFactsRef,
    foodCreatorFoodDetailRef,
    onSavePress,
  };
};
