import type { ParamList } from '../../navigaitons';
import { useCallback, useRef, useState, useEffect } from 'react';
import {
  convertPassioFoodItem,
  createFoodLogUsingFoodDataInfo,
  getMealLog,
} from '../../utils';
import {
  PassioFoodItem,
  PassioNutrients,
  PassioSDK,
  type PassioAdvisorFoodInfo,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useServices } from '../../contexts';
import { MealLabel } from '../../models';
import { StackNavigationProp } from '@react-navigation/stack';
import uuid4 from 'react-native-uuid';
import { EditServingSizeRef } from './modal/EditServingSizeModal';
import { getMealLogsForDate } from '../../utils/DataServiceHelper';
import { calculateDailyMacroNutrition } from '../dashbaord';
import {
  convertPassioFoodItemToFoodLog,
  createRecipeUsingPassioFoodItem,
  sumOfAllPassioNutrients,
} from '../../utils/V3Utils';

export const PHOTO_LIMIT = 7;

export interface PhotoLoggingResults extends PassioAdvisorFoodInfo {
  isSelected?: boolean;
  passioFoodItem?: PassioFoodItem;
  uuID: string;
  nutrients?: PassioNutrients;
}
export interface MacroInfo {
  targetCalories?: number;
  calories?: number;
  targetProtein?: number;
  protein?: number;
  targetFat?: number;
  fat?: number;
  targetCarbs?: number;
  carbs?: number;
}

export type PhotoLoggingScreenProps = StackNavigationProp<
  ParamList,
  'PhotoLoggingScreen'
>;

interface Select {
  label: string;
  value: MealLabel;
}

const mealTimes: Select[] = [
  {
    label: 'Breakfast',
    value: 'breakfast',
  },
  {
    label: 'Lunch',
    value: 'lunch',
  },
  {
    label: 'Dinner',
    value: 'dinner',
  },
  {
    label: 'Snack',
    value: 'snack',
  },
];

export function usePhotoLogging() {
  const navigation = useNavigation<PhotoLoggingScreenProps>();
  const services = useServices();
  const isSubmitting = useRef<boolean>(false);
  const editServingInfoRef = useRef<EditServingSizeRef>(null);

  const routes = useRoute<RouteProp<ParamList, 'PhotoLoggingScreen'>>();
  const [isFetchingResponse, setFetchResponse] = useState<boolean | undefined>(
    undefined
  );
  const [isPreparingLog, setPreparingLog] = useState(false);
  const [passioAdvisorFoodInfo, setPassioAdvisorFoodInfo] = useState<
    PhotoLoggingResults[] | null
  >(null);
  const [isOpenDatePicker, openDatePicker] = useState(false);
  const [date, setDate] = useState(routes.params.logToDate ?? new Date());
  const [meal, setMeal] = useState<MealLabel>(getMealLog(date, undefined));
  const [macroInfo, setMacroInfo] = useState<MacroInfo | undefined>(undefined);
  const [newMacroInfo, setNewMacroInfo] = useState<MacroInfo | undefined>(
    undefined
  );

  const fetTargetMacro = useCallback(async () => {
    const profile = await services.dataService.getNutritionProfile();

    if (profile) {
      let targetCalories = 0;
      let targetCarbs = 0;
      let targetProtein = 0;
      let targetFat = 0;
      targetCalories = profile.caloriesTarget;
      targetCarbs = (targetCalories * profile.carbsPercentage) / 100 / 4;
      targetFat = (targetCalories * profile.fatPercentage) / 100 / 9;
      targetProtein = (targetCalories * profile.proteinPercentage) / 100 / 4;
      setMacroInfo((item) => {
        let prevMacro = item || {};
        let updatedMacro: MacroInfo = {
          ...prevMacro,
          targetCalories: targetCalories,
          targetCarbs: targetCarbs,
          targetFat: targetFat,
          targetProtein: targetProtein,
        };
        return updatedMacro;
      });
    }
  }, [services.dataService]);

  const fetchAchievedGoal = useCallback(async () => {
    const mealLogs = await getMealLogsForDate(date, services);
    const foodLogs = mealLogs.filter((i) => i.meal === meal);

    const data = calculateDailyMacroNutrition(foodLogs);

    setMacroInfo((item) => {
      let prevMacro = item || {};
      let updatedMacro: MacroInfo = {
        ...prevMacro,
        calories: data.amountOfCalories,
        carbs: data.amountOfCarbs,
        fat: data.amountOfFat,
        protein: data.amountOfProtein,
      };
      return updatedMacro;
    });
  }, [date, meal, services]);

  const updateMacroOnSelection = useCallback(
    async (result: PhotoLoggingResults[]) => {
      const nutrients: PassioNutrients[] = result
        ?.filter((i) => i.isSelected && i.nutrients)
        .map((i) => i.nutrients) as unknown as PassioNutrients[];
      const data = sumOfAllPassioNutrients(nutrients);
      setNewMacroInfo((item) => {
        let prevMacro = item || {};
        let updatedMacro: MacroInfo = {
          ...prevMacro,
          calories: data.calories?.value || 0,
          carbs: data.carbs?.value || 0,
          fat: data.fat?.value || 0,
          protein: data.protein?.value || 0,
        };
        return updatedMacro;
      });
    },
    []
  );

  const recognizePictureRemote = useCallback(
    async (imgs: string[]) => {
      if (isFetchingResponse) {
        return;
      }
      setFetchResponse(true);
      try {
        setPassioAdvisorFoodInfo(null);
        let info: PhotoLoggingResults[] = [];
        await Promise.all(
          imgs.map(async (item) => {
            const result = await PassioSDK.recognizeImageRemote(
              item.replace('file://', '') ?? ''
            );
            if (result) {
              await Promise.all(
                result.map(async (advisorFoodInfo) => {
                  let passioFoodItem: PassioFoodItem | undefined | null;
                  if (advisorFoodInfo.packagedFoodItem) {
                    passioFoodItem = advisorFoodInfo.packagedFoodItem;
                  } else if (advisorFoodInfo.foodDataInfo) {
                    passioFoodItem = await PassioSDK.fetchFoodItemForDataInfo(
                      advisorFoodInfo.foodDataInfo,
                      advisorFoodInfo?.foodDataInfo?.nutritionPreview
                        ?.servingQuantity,
                      advisorFoodInfo?.foodDataInfo?.nutritionPreview
                        ?.servingUnit
                    );
                  }
                  info.push({
                    ...advisorFoodInfo,
                    isSelected: true,
                    passioFoodItem: passioFoodItem ?? undefined,
                    uuID: uuid4.v4() as unknown as string,
                    nutrients: passioFoodItem
                      ? PassioSDK.getNutrientsOfPassioFoodItem(
                          passioFoodItem,
                          passioFoodItem?.amount.weight
                        )
                      : undefined,
                  });
                })
              );
            }
          })
        );
        setPassioAdvisorFoodInfo(info);
        setFetchResponse(false);
      } catch (error) {
        setFetchResponse(false);
      } finally {
      }
    },
    [isFetchingResponse]
  );

  const onLogSelectPress = useCallback(
    async (selected: PhotoLoggingResults[]) => {
      if (isSubmitting.current) {
        return;
      }
      isSubmitting.current = true;

      if (isPreparingLog) {
        return;
      }
      setPreparingLog(true);
      const foodLogs = await createFoodLogUsingFoodDataInfo(
        selected.filter((i) => i.isSelected),
        date,
        meal
      );

      for (const item of foodLogs) {
        await services.dataService.saveFoodLog({
          ...item,
        });
      }
      setPreparingLog(false);
      navigation.pop(1);
      navigation.navigate('BottomNavigation', {
        screen: 'MealLogScreen',
      });

      isSubmitting.current = false;
    },

    [isPreparingLog, date, meal, navigation, services.dataService]
  );

  useEffect(() => {
    function init() {
      if (routes.params.images) {
        recognizePictureRemote(routes.params.images);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routes.params.images]);

  const onUpdateFoodItem = (result: PhotoLoggingResults) => {
    setPassioAdvisorFoodInfo((prev) => {
      if (prev === null) return null;
      return prev?.map((i) => {
        if (i.uuID === result.uuID) {
          return result;
        } else {
          return i;
        }
      });
    });
  };

  function onDateChange(updatedDate: Date) {
    setDate(new Date(updatedDate));
  }

  const changeDate = (updateDate: Date) => {
    openDatePicker(false);
    onDateChange(updateDate);
  };

  useEffect(() => {
    console.log('fetTargetMacro ===>');
    fetTargetMacro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('fetchAchievedGoal');

    fetchAchievedGoal();
  }, [fetchAchievedGoal]);

  useEffect(() => {
    updateMacroOnSelection(passioAdvisorFoodInfo ?? []);
  }, [passioAdvisorFoodInfo, updateMacroOnSelection]);

  const onUpdateMacros = (result: PhotoLoggingResults[]) => {
    setPassioAdvisorFoodInfo(result);
  };

  const onCreateRecipePress = (selected: PhotoLoggingResults[]) => {
    const recipe = createRecipeUsingPassioFoodItem(
      selected
        .filter((i) => i.isSelected && i.passioFoodItem)
        .map((i) => i.passioFoodItem) as unknown as PassioFoodItem[]
    );

    const foodLog = convertPassioFoodItemToFoodLog(
      recipe,
      undefined,
      undefined,
      undefined
    );
    navigation.navigate('EditRecipeScreen', {
      recipe: foodLog,
      from: 'Barcode',
    });
  };

  const onCancel = () => {
    navigation.goBack();
  };

  const onTryAgain = () => {
    navigation.replace('TakePictureScreen', {
      type: routes.params.type,
    });
  };

  return {
    changeDate,
    date,
    editServingInfoRef,
    isFetchingResponse,
    isOpenDatePicker,
    isPreparingLog,
    meal,
    mealTimes,
    onLogSelectPress,
    onUpdateMacros,
    onUpdateFoodItem,
    openDatePicker,
    passioAdvisorFoodInfo,
    recognizePictureRemote,
    setDate,
    setMeal,
    macroInfo,
    newMacroInfo,
    onCreateRecipePress,
    onCancel,
    onTryAgain,
  };
}
