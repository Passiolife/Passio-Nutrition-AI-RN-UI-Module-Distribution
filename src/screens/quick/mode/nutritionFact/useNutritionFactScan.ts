import { useCallback, useEffect, useRef, useState } from 'react';

import type { QuickResult } from '../../../../models';
import {
  NutritionDetectionEvent,
  PassioSDK,
  type NutritionFacts,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { ShowToast } from '../../../../utils';

export const useNutritionFactScan = () => {
  const passioQuickResultRef = useRef<QuickResult | null>(null);

  const [nutritionFacts, setNutritionFacts] = useState<NutritionFacts | null>(
    null
  );

  const resetScanning = useCallback(() => {
    passioQuickResultRef.current = null;
    setNutritionFacts(null);
  }, []);

  const onUpdatingNutritionFacFlag = useCallback(() => {
    ShowToast('Coming soon');
  }, []);

  // Convert NutritionFacts to foodLog
  const onSaveFoodLogUsingNutrientFact = useCallback(
    (_nutrientFact: NutritionFacts, _name: string) => {
      setNutritionFacts(null);
    },
    []
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
