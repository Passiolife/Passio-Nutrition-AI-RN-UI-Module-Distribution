import {
  CUSTOM_USER_FOOD_PREFIX,
  CUSTOM_USER_RECIPE__PREFIX,
} from './../foodCreator/FoodCreator.utils';
import type {
  CustomFood,
  CustomRecipe,
  FoodLog,
  MealLabel,
} from '../../models';
import { convertFoodLogsToFavoriteFoodLog } from './../../utils';
import { useCallback, useEffect, useState, useRef } from 'react';

import type { EditFoodLogScreenNavigationProps } from './editFoodLogsScreen';
import { useBranding, useServices } from '../../contexts';
import { ShowToast } from '../../utils';
import {
  CommonActions,
  StackActions,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { ParamList } from '../../navigaitons';
import { ROUTES } from '../../navigaitons/Route';
import { useDatePicker } from './useDatePicker';

import { DeleteFoodLogAlert } from './alerts';
import { mergeNutrients } from '../../utils/NutritentsUtils';
import type { AlertCustomFoodRef } from './views/AlertCustomFood';
import {
  combineCustomFoodAndFoodLog,
  getCustomFoodUUID,
  getCustomRecipeUUID,
} from '../foodCreator/FoodCreator.utils';
import type { FoodNotFoundRef } from './views/FoodNotFound';

export function useEditFoodLog() {
  const services = useServices();
  const { params } = useRoute<RouteProp<ParamList, 'EditFoodLogScreen'>>();
  const branding = useBranding();
  const navigation = useNavigation<EditFoodLogScreenNavigationProps>();

  const [foodLog, setFoodLog] = useState<FoodLog>(params.foodLog);
  const [isFavorite, setFavorite] = useState<boolean>(false);

  const {
    eventTimeStamp,
    isOpenDatePicker,
    closeDatePicker,
    openDatePicker,
    updateEventTimeStamp,
  } = useDatePicker(params.foodLog.eventTimestamp);

  const alertCustomFoodRef = useRef<AlertCustomFoodRef>(null);
  const foodNotFoundRef = useRef<FoodNotFoundRef>(null);

  const onUpdateFoodLog = useCallback((item: FoodLog) => {
    setFoodLog({ ...item });
  }, []);

  const onConfirmDateSelection = (updatedDate: Date) => {
    foodLog.eventTimestamp = new Date(updatedDate).toISOString();
    setFoodLog({ ...foodLog });
  };

  const onSaveFavoriteFoodLog = async () => {
    if (foodLog.refCode) {
      if (isFavorite) {
        await services.dataService.deleteFavoriteFoodItem(foodLog.refCode);
      } else {
        await services.dataService.saveFavoriteFoodItem(
          convertFoodLogsToFavoriteFoodLog(foodLog)
        );
      }

      ShowToast(isFavorite ? 'Removed from favorite' : 'Added to favorite');
      setFavorite(!isFavorite);
    } else {
      ShowToast('ref code missing');
    }
  };

  const saveFoodLog = async () => {
    await services.dataService.saveFoodLog({ ...foodLog });
  };

  const onCreateCustomFood = async (
    isUpdateUponCreating: boolean,
    isRecipe?: boolean
  ) => {
    const uuid: string = isRecipe ? getCustomRecipeUUID() : getCustomFoodUUID();

    let barcode = foodLog?.foodItems?.[0].barcode;

    try {
      if (
        (barcode && barcode.length > 0) ||
        params.prevRouteName !== 'ExistedBarcode'
      ) {
        const storedCustomFood = await services.dataService.getCustomFoodLogs();
        const existingCustomFood = storedCustomFood?.find(
          (i) => i.barcode === barcode
        );
        if (existingCustomFood) {
          barcode = undefined;
        }
      }
    } catch (error) {}

    if (isRecipe) {
      navigateToCustomRecipeScreen(
        {
          ...foodLog,
          uuid: uuid,
          barcode: barcode,
          iconID: CUSTOM_USER_RECIPE__PREFIX,
        },
        isUpdateUponCreating
      );
    } else {
      navigateToFoodCreatorScreen(
        {
          ...foodLog,
          uuid: uuid,
          barcode: barcode,
          brandName: foodLog.longName,
        },
        isUpdateUponCreating
      );
    }
  };

  const onEditCustomFood = async (
    isUpdateUponCreating: boolean,
    isRecipe?: boolean
  ) => {
    if (foodLog.refCustomFoodID) {
      if (isRecipe) {
        const customFood = await services.dataService?.getCustomRecipe(
          foodLog.refCustomFoodID
        );
        if (customFood) {
          navigateToCustomRecipeScreen(customFood, isUpdateUponCreating);
        } else {
          setTimeout(() => {
            foodNotFoundRef?.current?.onShow(isUpdateUponCreating, isRecipe);
          }, 200);
        }
      } else {
        const customFood = await services.dataService?.getCustomFoodLog(
          foodLog.refCustomFoodID
        );
        if (customFood) {
          navigateToFoodCreatorScreen(customFood, isUpdateUponCreating);
        } else {
          setTimeout(() => {
            foodNotFoundRef?.current?.onShow(isUpdateUponCreating, isRecipe);
          }, 200);
        }
      }
    }
  };

  // Navigate To Custom Food Editor
  const navigateToFoodCreatorScreen = (
    customFood: CustomFood,
    isUpdateUponCreating: boolean
  ) => {
    navigation.push('FoodCreatorScreen', {
      foodLog: customFood,
      onSave: async (item) => {
        if (item && isUpdateUponCreating) {
          await services.dataService.saveFoodLog(
            combineCustomFoodAndFoodLog(item, foodLog)
          );
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'BottomNavigation',
                  params: {
                    screen: 'MealLogScreen',
                  },
                },
              ],
            })
          );
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'BottomNavigation',
                  params: {
                    screen: 'MealLogScreen',
                  },
                },
              ],
            })
          );
          navigation.navigate('MyFoodsScreen', {
            logToDate: new Date(),
            logToMeal: undefined,
          });
        }
      },
      from: 'FoodDetail',
    });
  };

  // Navigate To Custom Recipe Editor
  const navigateToCustomRecipeScreen = (
    customFood: CustomRecipe,
    isUpdateUponCreating: boolean
  ) => {
    navigation.push('EditRecipeScreen', {
      recipe: customFood,
      onSaveLogPress: async (item) => {
        if (item && isUpdateUponCreating) {
          const updatedFoodLog = combineCustomFoodAndFoodLog(item, foodLog);
          //  For recipe long name should be empty
          updatedFoodLog.longName = '';
          await services.dataService.saveFoodLog(updatedFoodLog);
          navigation.dispatch(
            CommonActions.reset({
              index: 0,

              routes: [
                {
                  name: 'BottomNavigation',
                  params: {
                    screen: 'MealLogScreen',
                  },
                },
              ],
            })
          );
        } else {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: 'BottomNavigation',
                  params: {
                    screen: 'MealLogScreen',
                  },
                },
              ],
            })
          );
          setTimeout(() => {
            navigation.navigate('MyFoodsScreen', {
              logToDate: new Date(),
              logToMeal: undefined,
              tab: 'Recipe',
            });
          }, 50);
        }
      },
      from: 'FoodDetail',
    });
  };

  const onEditCustomFoodPress = async () => {
    if (params.prevRouteName === 'MyFood') {
      params?.onEditCustomFood?.(foodLog);
    } else if (params.prevRouteName === 'MealLog') {
      alertCustomFoodRef.current?.onShow(
        foodLog.refCustomFoodID?.startsWith(CUSTOM_USER_FOOD_PREFIX)
          ? foodLog.refCustomFoodID
          : undefined,
        false,
        false
      );
    } else if (params.prevRouteName === 'ExistedBarcode' && params.customFood) {
      navigateToFoodCreatorScreen(params.customFood, false);
    } else {
      alertCustomFoodRef.current?.onShow(undefined, false, true);
    }
  };
  const onEditCustomRecipePress = async () => {
    if (params.prevRouteName === 'MyFood') {
      params?.onEditRecipeFood?.(foodLog);
    } else if (params.prevRouteName === 'MealLog') {
      alertCustomFoodRef.current?.onShow(
        foodLog.refCustomFoodID?.startsWith(CUSTOM_USER_RECIPE__PREFIX)
          ? foodLog.refCustomFoodID
          : undefined,
        true,
        false
      );
    } else {
      // Other
      alertCustomFoodRef.current?.onShow(undefined, true, true);
    }
  };

  const onMoreDetailPress = () => {
    navigation.navigate('NutritionInformationScreen', {
      nutrient: mergeNutrients(foodLog.foodItems.flatMap((i) => i.nutrients)),
      foodLog: foodLog,
    });
  };

  const onDeleteFoodLog = async () => {
    await services.dataService.deleteFoodLog(foodLog.uuid);
  };

  const onDateChangePress = (date: Date) => {
    updateEventTimeStamp(date);
    onConfirmDateSelection(date);
  };

  const jumpToDiary = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: 'BottomNavigation',
            params: {
              screen: 'MealLogScreen',
            },
          },
        ],
      })
    );
  };

  const onSavePress = async () => {
    try {
      await saveFoodLog();
      ShowToast('Added food into meal log');
      if (params.prevRouteName === 'MealLog') {
        navigation.dispatch(StackActions.pop(1));
      } else if (params.prevRouteName === ROUTES.RecipeEditorScreen) {
        navigation.dispatch(StackActions.pop(3));
      } else if (params.prevRouteName === 'QuickScan') {
        navigation.dispatch(StackActions.pop(1));
      } else if (
        params.prevRouteName === 'Barcode' ||
        params.prevRouteName === 'ExistedBarcode'
      ) {
        jumpToDiary();
      } else {
        jumpToDiary();
      }
      params?.onSaveLogPress?.({ ...foodLog });
    } catch (e) {}
  };

  const onCancelPress = async () => {
    if (params.prevRouteName === 'MealLog') {
      navigation.dispatch(StackActions.pop(1));
    } else if (params.prevRouteName === ROUTES.RecipeEditorScreen) {
      navigation.dispatch(StackActions.pop(3));
    } else if (params.prevRouteName === 'QuickScan') {
      navigation.dispatch(StackActions.pop(1));
    } else {
      navigation.dispatch(StackActions.pop(2));
    }
    params?.onCancelPress?.();
  };

  const onDeleteFoodLogPress = async () => {
    DeleteFoodLogAlert({
      onClose(): void {},
      async onDelete() {
        await onDeleteFoodLog();
        navigation.dispatch(StackActions.pop(1));
      },
    });
  };

  const onUpdateFavoritePress = async () => {
    params.onSaveLogPress?.(foodLog);
    navigation.dispatch(StackActions.pop(1));
  };

  const onDeleteFavoritePress = async () => {
    params.onDeleteLogPress?.(foodLog);
    navigation.dispatch(StackActions.pop(1));
  };

  const onMealLabelPress = (label: MealLabel) => {
    foodLog.meal = label;
    setFoodLog({ ...foodLog });
  };

  useEffect(() => {
    async function init() {
      const favoriteFoodItems =
        await services.dataService.getFavoriteFoodItems();
      setTimeout(() => {
        setFavorite(
          favoriteFoodItems.filter((item) => item.refCode === foodLog.refCode)
            .length >= 1
        );
      }, 100);
    }
    init();
  }, [foodLog, foodLog.refCode, services.dataService]);

  return {
    alertCustomFoodRef,
    branding,
    closeDatePicker,
    eventTimeStamp,
    foodLog,
    foodNotFoundRef,
    from: params.prevRouteName,
    isFavorite,
    isHideFavorite: params.prevRouteName === 'Favorites',
    isHideMealTime: params.prevRouteName === 'Favorites',
    isHideTimeStamp: params.prevRouteName === 'Favorites',
    isOpenDatePicker,
    onEditCustomRecipePress,
    onCancelPress,
    onCreateCustomFood,
    onDateChangePress,
    onDeleteFavoritePress,
    onDeleteFoodLogPress,
    onEditCustomFood,
    onEditCustomFoodPress,
    onMealLabelPress,
    onMoreDetailPress,
    onSaveFavoriteFoodLog,
    onSavePress,
    onUpdateFavoritePress,
    onUpdateFoodLog,
    openDatePicker,
  };
}
