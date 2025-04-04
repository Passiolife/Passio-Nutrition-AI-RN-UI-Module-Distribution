import type { ParamList } from '../../navigaitons';
import { useCallback, useRef, useState, useEffect } from 'react';
import {
  createFoodLogUsingFoodDataInfo,
  getMealLog,
  getNutrientsOfPassioFoodItem,
} from '../../utils';
import {
  PassioFoodItem,
  PassioFoodResultType,
  PassioNutrients,
  PassioSDK,
  type PassioAdvisorFoodInfo,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useServices } from '../../contexts';
import type { CustomFood, FoodLog, MealLabel } from '../../models';
import type { StackNavigationProp } from '@react-navigation/stack';
import uuid4 from 'react-native-uuid';
import type {
  PhotoLoggingBarcodeRef,
  PhotoLoggingType,
} from './modal/PhotoLoggingEditorModal';
import {
  convertPassioFoodItemToFoodLog,
  createBlankPassioFoodITem,
  createPassioFoodItemFromCustomFood,
  createRecipeUsingPassioFoodItem,
  isMissingNutrition,
  sumOfAllPassioNutrients,
} from '../../utils/V3Utils';
import type { ItemAddedToDairyViewModalRef } from '../../components';
import type { EditServingSizeRef } from './modal/servingSize/EditServingSizeModal';
import { getCustomFoodUUID } from '../foodCreator/FoodCreator.utils';
import type { CustomFoodCreatedModalRef } from './modal/CustomFoodCreatedModal';

export const PHOTO_LIMIT = 7;

export type PhotoLoggingResultsType = PassioFoodResultType | 'no-result';
export interface PhotoLoggingResults
  extends Omit<PassioAdvisorFoodInfo, 'resultType'> {
  isSelected?: boolean;
  passioFoodItem?: PassioFoodItem;
  uuID: string;
  nutrients?: PassioNutrients;
  assets?: string;
  customFood?: CustomFood;
  isCustomFoodCreated?: boolean;
  resultType?: PhotoLoggingResultsType;
  productCode?: string;
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
  const customFoodCreatedModalRef = useRef<CustomFoodCreatedModalRef>(null);
  const itemAddedToDairyViewModalRef =
    useRef<ItemAddedToDairyViewModalRef>(null);
  const photoLoggingBarcodeRef = useRef<PhotoLoggingBarcodeRef>(null);

  const routes = useRoute<RouteProp<ParamList, 'PhotoLoggingScreen'>>();
  const [isFetchingResponse, setFetchResponse] = useState<boolean | undefined>(
    undefined
  );
  const [isPreparingLog, setPreparingLog] = useState(false);
  const [passioAdvisorFoodInfo, setPassioAdvisorFoodInfo] = useState<
    PhotoLoggingResults[] | null
  >(null);
  const [isOpenDatePicker, openDatePicker] = useState(false);
  const defaultDate = routes.params.logToDate ?? new Date();
  const [date, setDate] = useState(defaultDate);
  const [meal, setMeal] = useState<MealLabel>(
    getMealLog(defaultDate, undefined)
  );
  const [macroInfo, setMacroInfo] = useState<MacroInfo | undefined>(undefined);
  const [newMacroInfo, setNewMacroInfo] = useState<MacroInfo | undefined>(
    undefined
  );
  const [newCustomFoodCount, setNewCustomFoodCount] = useState<number>(0);

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
            if (result && result.length) {
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

                  const barcode =
                    passioFoodItem?.ingredients?.[0]?.metadata?.barcode ??
                    advisorFoodInfo?.productCode;

                  // Note add productCode Here

                  let customFood: CustomFood | undefined;

                  if (barcode) {
                    const customFoods =
                      await services.dataService.getCustomFoodLogs();
                    customFood = customFoods?.find(
                      (i) => i.barcode === barcode
                    );

                    // changed replace passio food item with founded custom food
                    if (customFood) {
                      passioFoodItem =
                        createPassioFoodItemFromCustomFood(customFood);
                    }
                  }

                  const isCustomFoodAlreadyExist =
                    info.find(
                      (i) =>
                        i.customFood &&
                        customFood?.uuid &&
                        i.customFood?.uuid === customFood?.uuid
                    ) !== undefined;

                  const isBarcode =
                    info.find(
                      (i) =>
                        i.resultType === 'barcode' &&
                        barcode &&
                        i.passioFoodItem?.ingredients?.[0]?.metadata?.barcode &&
                        i.passioFoodItem?.ingredients?.[0]?.metadata?.barcode &&
                        i.passioFoodItem?.ingredients?.[0]?.metadata
                          ?.barcode === barcode
                    ) !== undefined;

                  if (!passioFoodItem) {
                    passioFoodItem = createBlankPassioFoodITem(barcode);
                  }

                  if (!isCustomFoodAlreadyExist && !isBarcode) {
                    info.push({
                      ...advisorFoodInfo,
                      isSelected: !isMissingNutrition(passioFoodItem),
                      passioFoodItem: {
                        ...passioFoodItem,
                        name: passioFoodItem?.name
                          ? passioFoodItem.name
                          : advisorFoodInfo.resultType === 'nutritionFacts'
                            ? 'Scanned Nutrition Label'
                            : '',
                      }, // if passio food item
                      uuID: uuid4.v4() as unknown as string,
                      assets: item,
                      customFood: customFood,
                      isCustomFoodCreated: customFood !== undefined,
                      nutrients: getNutrientsOfPassioFoodItem(
                        passioFoodItem,
                        passioFoodItem?.amount.weight
                      ),
                    });
                  }
                })
              );
            } else {
              const blankPassio = createBlankPassioFoodITem();
              info.push({
                isSelected: false,
                passioFoodItem: blankPassio,
                uuID: uuid4.v4() as unknown as string,
                assets: item,
                nutrients: getNutrientsOfPassioFoodItem(
                  blankPassio,
                  blankPassio?.amount.weight
                ),
                portionSize: '',
                weightGrams: 0,
                recognisedName: '',
                resultType: 'no-result',
              });
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
    [isFetchingResponse, services.dataService]
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
        services,
        date,
        meal
      );

      for (const item of foodLogs) {
        await services.dataService.saveFoodLog({
          ...item,
        });
      }
      setPreparingLog(false);

      isSubmitting.current = false;

      const unCreatedCustomFoods = selected.filter(
        (i) =>
          i.resultType === 'nutritionFacts' &&
          !i.customFood &&
          !i.isCustomFoodCreated &&
          i.isSelected
      );

      const customFoods = await createFoodLogUsingFoodDataInfo(
        unCreatedCustomFoods,
        services,
        date,
        meal
      );

      for (const item of customFoods) {
        await services.dataService.saveCustomFood({
          ...item,
        });
      }
      setNewCustomFoodCount(customFoods.length);
      itemAddedToDairyViewModalRef.current?.open();
    },

    [isPreparingLog, date, meal, services]
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

  const onUpdateFoodItem = async (
    result: PhotoLoggingResults,
    type: PhotoLoggingType,
    isSamePreviousValue?: boolean
  ) => {
    let customFood = result.customFood;
    let isCustomFoodCreated = result.isCustomFoodCreated ?? false;

    if (type === 'nutritionFact') {
      // Editing nutrition facts of a barcode result creates a new user food.
      // If the user changes any of the original data, and clicks “Save”,
      // a new user food is created and the “A Custom Food Has Been Created” message is shown. Then,
      // the user is returned to the “Your Results” screen with the user food being shown in the list of results

      if (isSamePreviousValue && result.resultType === 'barcode') {
      } else {
        const uuid: string = customFood?.uuid ?? getCustomFoodUUID();
        const foodRecords = await createFoodLogUsingFoodDataInfo(
          [result],
          services,
          undefined,
          undefined
        );
        let foodRecord = foodRecords?.[0];
        customFood = {
          ...foodRecord,
          uuid: uuid,
          refCustomFoodID: uuid,
          barcode: result.passioFoodItem?.ingredients?.[0]?.metadata?.barcode,
        };
        await services.dataService.saveCustomFood(customFood);
        isCustomFoodCreated = true;
        if (!result.isCustomFoodCreated) {
          customFoodCreatedModalRef?.current?.open();
        }
      }
    }

    setPassioAdvisorFoodInfo((prev) => {
      if (prev === null) return null;
      return prev?.map((i) => {
        if (i.uuID === result.uuID) {
          return {
            ...result,
            customFood: customFood,
            isSelected: true, // obv user intend to update means they want to add in meal.
            isCustomFoodCreated: isCustomFoodCreated,
          };
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
    fetTargetMacro();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    itemAddedToDairyViewModalRef?.current?.close();
    setTimeout(() => {
      navigation.replace('TakePictureScreen', {
        type: 'camera',
      });
    }, 300);
  };
  const handleOnMorePress = () => {
    itemAddedToDairyViewModalRef?.current?.close();
    setTimeout(() => {
      navigation.replace('TakePictureScreen', {
        type: 'camera',
      });
    }, 300);
  };
  const handleOnDiaryPress = () => {
    navigation.navigate('BottomNavigation', {
      screen: 'MealLogScreen',
    });
  };

  const overrideFoodLog = (foodLog: FoodLog, result: PhotoLoggingResults) => {
    setPassioAdvisorFoodInfo((s) => {
      return (
        s?.map((o) => {
          if (o.uuID === result.uuID) {
            const passioItem = createPassioFoodItemFromCustomFood(foodLog);
            return {
              ...o,
              passioFoodItem: passioItem,
              resultType: 'barcode',
              nutrients: getNutrientsOfPassioFoodItem(
                passioItem,
                passioItem.amount.weight
              ),
            };
          } else {
            return o;
          }
        }) ?? []
      );
    });
  };

  const onSearchManually = (item: PhotoLoggingResults) => {
    navigation.navigate('FoodSearchScreen', {
      from: 'Ingredient',
      onSaveData(foodLog) {
        overrideFoodLog(foodLog, item);
        navigation.goBack();
      },

      onEditFoodData(searchFoodLog) {
        overrideFoodLog(searchFoodLog, item);
        navigation.goBack();
        // navigation.push('EditFoodLogScreen', {
        //   foodLog: searchFoodLog,
        //   prevRouteName: 'Ingredient',
        //   onSaveLogPress: (foodLog) => {
        //     overrideFoodLog(foodLog, item);
        //     navigation.goBack();
        //   },
        // });
      },
    });
  };

  const resultStatus = () => {
    const countOfSelectedFood =
      passioAdvisorFoodInfo?.filter((i) => i.isSelected).length ?? 0;

    if (newCustomFoodCount > 0) {
      return `${countOfSelectedFood} Items Added To Diary\n${newCustomFoodCount} Custom Food Created`;
    } else {
      return `${countOfSelectedFood} Items Added To Diary`;
    }
  };

  return {
    changeDate,
    date,
    editServingInfoRef,
    customFoodCreatedModalRef,
    itemAddedToDairyViewModalRef,
    isFetchingResponse,
    isOpenDatePicker,
    isPreparingLog,
    macroInfo,
    meal,
    mealTimes,
    newMacroInfo,
    onCancel,
    onCreateRecipePress,
    handleOnMorePress,
    handleOnDiaryPress,
    onLogSelectPress,
    onTryAgain,
    onUpdateFoodItem,
    onSearchManually,
    onUpdateMacros,
    openDatePicker,
    passioAdvisorFoodInfo,
    photoLoggingBarcodeRef,
    recognizePictureRemote,
    setDate,
    defaultDate,
    setMeal,
    resultStatus,
  };
}
