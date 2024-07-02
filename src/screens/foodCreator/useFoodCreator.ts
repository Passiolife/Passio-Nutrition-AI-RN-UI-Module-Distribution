import { useRef } from 'react';
import { useBranding } from '../../contexts';
import type { OtherNutritionFactsRef } from './views/OtherNutritionFacts';

export const useFoodCreator = () => {
  const branding = useBranding();
  const otherNutritionFactsRef = useRef<OtherNutritionFactsRef>(null);

  const onSavePress = () => {
    otherNutritionFactsRef.current?.getValue();
  };

  return {
    branding,
    otherNutritionFactsRef,
    onSavePress,
  };
};
