import { useCallback, useEffect, useRef, useState } from 'react';

import type { QuickResult } from '../../../../models';
import {
  NutritionDetectionEvent,
  PassioSDK,
  type NutritionFacts,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { ShowToast } from '../../../../utils';
import { useNavigation } from '@react-navigation/native';
import type { ScanningScreenNavigationProps } from '../../QuickScanningScreen';
import { createCustomFoodUsingNutritionFact } from '../../../../screens/foodCreator/FoodCreator.utils';

export const useNutritionFactScan = () => {
  const passioQuickResultRef = useRef<QuickResult | null>(null);

  const [nutritionFacts, setNutritionFacts] = useState<NutritionFacts | null>(
    null
  );
  const navigation = useNavigation<ScanningScreenNavigationProps>();

  const resetScanning = useCallback(() => {
    passioQuickResultRef.current = null;
    setNutritionFacts(null);
  }, []);

  const onUpdatingNutritionFacFlag = useCallback(() => {
    ShowToast('Coming soon');
  }, []);

  // Convert NutritionFacts to foodLog
  const onSaveFoodLogUsingNutrientFact = useCallback(
    (nutrientFact: NutritionFacts, _name: string) => {
      if (nutrientFact) {
        const customFood = createCustomFoodUsingNutritionFact(nutrientFact);
        navigation.navigate('FoodCreatorScreen', {
          foodLog: customFood,
          from: 'QuickScan',
        });
      }
      setNutritionFacts(null);
    },
    [navigation]
  );

  useEffect(() => {
    let subscription = PassioSDK.startNutritionFactsDetection(
      (detection: NutritionDetectionEvent) => {
        if (detection && detection.nutritionFacts) {
          setNutritionFacts(detection.nutritionFacts);
        }
      }
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return {
    nutritionFacts,
    onSaveFoodLogUsingNutrientFact,
    onUpdatingNutritionFacFlag,
    resetScanning,
  };
};
