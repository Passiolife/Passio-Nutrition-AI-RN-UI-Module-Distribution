import { useCallback, useEffect, useState } from 'react';
import uuid4 from 'react-native-uuid';
import type { FoodLog } from '../../../../models';
import {
  NutritionDetectionEvent,
  PassioSDK,
  type NutritionFacts,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { getLogToDate, getMealLog, ShowToast } from '../../../../utils';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { ScanningScreenNavigationProps } from '../../QuickScanningScreen';
import { createCustomFoodUsingNutritionFact } from '../../../../screens/foodCreator/FoodCreator.utils';
import type { ParamList } from '../../../../navigaitons';
import { convertDateToDBFormat } from '../../../../utils/DateFormatter';

export const useNutritionFactScan = () => {
  const { params } = useRoute<RouteProp<ParamList, 'ScanningScreen'>>();
  const date = getLogToDate(params.logToDate, params.logToMeal);
  const meal = getMealLog(date, params.logToMeal);

  const [isLodgedFood, setLoggedFood] = useState<boolean>(false);

  const [nutritionFacts, setNutritionFacts] = useState<NutritionFacts | null>(
    null
  );
  const navigation = useNavigation<ScanningScreenNavigationProps>();

  const resetScanning = useCallback(() => {
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
          from: 'NutritionFact',
          onSave: (updatedCustomFood) => {
            if (updatedCustomFood) {
              const uuid: string = uuid4.v4() as string;
              const foodLog: FoodLog = {
                ...updatedCustomFood,
                eventTimestamp: convertDateToDBFormat(date),
                meal: meal,
                uuid: uuid,
              };
              navigation.replace('EditFoodLogScreen', {
                foodLog: foodLog,
                prevRouteName: 'QuickScan',
                onCancelPress: () => {},
                onSaveLogPress: () => {
                  setLoggedFood(true);
                },
              });
            }
          },
        });
      }
      setNutritionFacts(null);
    },
    [date, meal, navigation]
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

  const onContinueScanningPress = () => {
    setLoggedFood(false);
    setNutritionFacts(null);
  };
  const onViewDiaryPress = () => {
    navigation.pop(1);
    navigation.navigate('BottomNavigation', {
      screen: 'MealLogScreen',
    });
  };

  return {
    isLodgedFood,
    nutritionFacts,
    onSaveFoodLogUsingNutrientFact,
    onContinueScanningPress,
    onViewDiaryPress,
    onUpdatingNutritionFacFlag,
    resetScanning,
  };
};
