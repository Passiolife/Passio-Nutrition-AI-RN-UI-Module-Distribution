import { useEffect, useRef, useState } from 'react';
import { useServices } from '../../../contexts';
import type { MealLabel, MealPlan, NutritionProfile } from '../../../models';
import type { MealPlanScreenNavigationProps } from '../MyPlanScreen';
import {
  useIsFocused,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import {
  PassioSDK,
  type PassioMealPlan,
  type PassioMealPlanItem,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import type { ParamList } from '../../../navigaitons';
import { createFoodLogUsingPortionSize, ShowToast } from '../../../utils';

export function useMealPlan() {
  const services = useServices();
  const navigation = useNavigation<MealPlanScreenNavigationProps>();
  const { params } = useRoute<RouteProp<ParamList, 'MyPlanScreen'>>();
  const isFocus = useIsFocused();
  const isSubmitting = useRef<boolean>(false);

  const nutritionProfileRef = useRef<NutritionProfile | undefined>(undefined);
  const navigateEditFoodLogRef = useRef<boolean>(false);

  const [day, setDay] = useState<number>(1);
  const [isLoading, setLoading] = useState(false);
  const [isLoadingPlan, setLoadingPlan] = useState(false);
  const [selectedPassioMealPlan, setSelectedPassioMealPlan] = useState<
    PassioMealPlan | undefined
  >(undefined);
  const [passioMealPlans, setPassioMealPlans] = useState<
    PassioMealPlan[] | undefined
  >(undefined);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

  function onDayChanged(changedDay: number) {
    setDay(changedDay);
  }

  const convertFoodLog = async (item: PassioMealPlanItem) => {
    let result = await PassioSDK.fetchFoodItemForDataInfo(item.meal);

    let qty = item.meal?.nutritionPreview?.servingQuantity ?? '1';
    let servingUnit = item.meal?.nutritionPreview?.servingUnit ?? '';
    let weightGram = item.meal?.nutritionPreview?.weightQuantity ?? 0;
    const portionSize = `${qty} ${servingUnit}`;

    if (result) {
      let log = createFoodLogUsingPortionSize(
        result,
        params.logToDate ?? new Date(),
        item.mealTime.toLowerCase() as MealLabel,
        weightGram,
        portionSize
      );

      return log;
    } else {
      return null;
    }
  };

  const saveFoodLog = async (item: PassioMealPlanItem) => {
    if (isSubmitting.current) {
      return;
    }
    isSubmitting.current = true;
    const result = await convertFoodLog(item);
    if (result) {
      await services.dataService.saveFoodLog(result);
    }
    isSubmitting.current = false;
  };

  const onAddFoodLogPress = async (item: PassioMealPlanItem) => {
    setLoading(true);
    await saveFoodLog(item);
    setLoading(false);

    ShowToast('Log added successfully');
  };

  const onMultipleLogPress = async (item: PassioMealPlanItem[]) => {
    setLoading(true);
    for await (const log of item) {
      await saveFoodLog(log);
    }
    setLoading(false);
    ShowToast('Log added successfully');
  };

  const onChangeMealPlanPress = async (item: PassioMealPlan) => {
    if (nutritionProfileRef.current) {
      nutritionProfileRef.current.mealPlan = item.mealPlanLabel;
      services.dataService.saveNutritionProfile(nutritionProfileRef.current);
    }

    setSelectedPassioMealPlan(item);
  };

  const onEditFoodLogPress = async (item: PassioMealPlanItem) => {
    let result = await convertFoodLog(item);
    if (result) {
      navigateEditFoodLogRef.current = true;
      navigation.navigate('EditFoodLogScreen', {
        foodLog: result,
        prevRouteName: 'Other',
      });
    }
  };

  useEffect(() => {
    function init() {
      if (isFocus) {
        setLoadingPlan(true);
        PassioSDK.fetchMealPlans()
          .then((item) => {
            if (item) {
              services.dataService.getNutritionProfile().then((profile) => {
                nutritionProfileRef.current = profile;
                const profilePlan = item.find(
                  (o) => o.mealPlanLabel === profile?.mealPlan
                );
                setPassioMealPlans(item);
                if (profilePlan) {
                  setSelectedPassioMealPlan(profilePlan);
                } else {
                  setSelectedPassioMealPlan(item[0]);
                }
              });
            }
          })
          .finally(() => {
            setLoadingPlan(false);
          });
      } else {
        // navigateEditFoodLogRef.current = false;
      }
    }
    init();
  }, [isFocus, services.dataService, navigateEditFoodLogRef]);

  useEffect(() => {
    function init() {
      if (selectedPassioMealPlan) {
        setLoading(true);
        PassioSDK.fetchMealPlanForDay(selectedPassioMealPlan.mealPlanLabel, day)
          .then((item) => {
            if (item) {
              const result = item.reduce(
                (previousMealLogs: MealPlan[], foodLog) => {
                  let mealLogs = previousMealLogs.find(
                    (mealLog) => mealLog.title === foodLog.mealTime
                  );
                  if (mealLogs === undefined) {
                    mealLogs = {
                      title: foodLog.mealTime.toString(),
                      data: [],
                    } as MealPlan;
                    previousMealLogs.push(mealLogs);
                  }
                  mealLogs.data.push(foodLog);
                  return previousMealLogs;
                },
                []
              );
              setMealPlans(
                ['breakfast', 'lunch', 'dinner', 'snack'].map((meal) => {
                  const plan = [...result].find(
                    (resultItem) => resultItem.title.toLowerCase() === meal
                  );
                  const mealPlan: MealPlan = {
                    title: plan?.title ?? '',
                    data: plan?.data ?? [],
                  };
                  return mealPlan;
                })
              );
            }
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
    init();
  }, [day, selectedPassioMealPlan]);

  return {
    activeMealPlanName: selectedPassioMealPlan?.mealPlanTitle,
    day,
    isLoading,
    isLoadingPlan,
    mealPlans,
    passioMealPlans,
    onAddFoodLogPress,
    onChangeMealPlanPress,
    onDayChanged,
    onEditFoodLogPress,
    onMultipleLogPress,
  };
}
