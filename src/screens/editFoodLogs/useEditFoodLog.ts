import uuid4 from 'react-native-uuid';
import { convertPassioFoodItemToFoodLog } from './../../utils/V3Utils';
import type { CustomFood, FoodItem, FoodLog, MealLabel } from '../../models';
import { convertFoodLogsToFavoriteFoodLog } from './../../utils';
import { useCallback, useEffect, useState, useRef } from 'react';

import type { EditFoodLogScreenNavigationProps } from './editFoodLogsScreen';
import { content } from '../../constants/Content';
import { useBranding, useServices } from '../../contexts';
import { ShowToast } from '../../utils';
import {
  StackActions,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { ParamList } from '../../navigaitons';
import { ROUTES } from '../../navigaitons/Route';
import { useDatePicker } from './useDatePicker';

import { DeleteFoodLogAlert } from './alerts';
import type { PassioFoodItem } from '@passiolife/nutritionai-react-native-sdk-v3';
import { mergeNutrients } from '../../utils/NutritentsUtils';
import type { AlertCustomFoodRef } from './views/AlertCustomFood';
import { combineCustomFoodAndFoodLog } from '../foodCreator/FoodCreator.utils';
import type { FoodNotFoundRef } from './views/FoodNotFound';

export function useEditFoodLog() {
  const services = useServices();
  const { params } = useRoute<RouteProp<ParamList, 'EditFoodLogScreen'>>();
  const branding = useBranding();
  const navigation = useNavigation<EditFoodLogScreenNavigationProps>();

  const [foodLog, setFoodLog] = useState<FoodLog>(params.foodLog);
  const [isOpenFavoriteFoodAlert, setOpenFavoriteAlert] =
    useState<boolean>(false);
  const [isOpenFoodNameAlert, setOpenFoodNameAlert] = useState<boolean>(false);
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

  const recalculateFoodLogServing = useCallback((value: FoodLog) => {
    const updatedFoodLog = { ...value };
    const sum = updatedFoodLog.foodItems.reduce(
      (acc, item) => acc + item.computedWeight.value,
      0
    );
    updatedFoodLog.computedWeight = {
      value: sum,
      unit: 'g',
    };
    updatedFoodLog.selectedUnit = 'serving';
    updatedFoodLog.selectedQuantity = 1;
    updatedFoodLog.servingUnits = [
      {
        unit: 'serving',
        mass: sum,
      },
      {
        unit: 'gram',
        mass: 1,
      },
    ];
    if (updatedFoodLog.foodItems.length === 1) {
      updatedFoodLog.name = `${content.recipeWith} ${updatedFoodLog.name}`;
    }
    return updatedFoodLog;
  }, []);

  // const addIngredient = useCallback(
  //   (foodItem: FoodItem) => {
  //     const updatedFoodLog = { ...foodLog };
  //     updatedFoodLog.foodItems.push(foodItem);
  //     setFoodLog(recalculateFoodLogServing(updatedFoodLog));
  //     ShowToast('Ingredient added successfully');
  //     navigation.goBack();
  //   },
  //   [foodLog, navigation, recalculateFoodLogServing]
  // );

  const deleteIngredient = useCallback(
    (foodItem: FoodItem) => {
      const newFoodLog = {
        ...foodLog,
        foodItems: foodLog.foodItems.filter(
          (value) => value.refCode !== foodItem.refCode
        ),
      };
      setFoodLog(recalculateFoodLogServing(newFoodLog));
    },
    [foodLog, recalculateFoodLogServing]
  );

  const updateIngredient = useCallback(
    (foodLogObj: FoodItem) => {
      let updatedFoodItems = foodLog.foodItems.map((value) =>
        value.refCode === foodLogObj.refCode ? foodLogObj : value
      );
      let foodLogData: FoodLog = { ...foodLog, foodItems: updatedFoodItems };
      setFoodLog(recalculateFoodLogServing(foodLogData));
      navigation.goBack();
    },
    [foodLog, navigation, recalculateFoodLogServing]
  );

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
      setOpenFavoriteAlert(false);
    } else {
      ShowToast('refcode missing');
    }
  };

  const closeFavoriteFoodLogAlert = () => {
    setOpenFavoriteAlert(false);
  };

  const onSaveFoodLogName = async (input: string | undefined) => {
    if (input != null) {
      foodLog.name = input;
      setFoodLog(foodLog);
      await saveFoodLog();
      setOpenFoodNameAlert(false);
    } else {
    }
  };

  const closeSaveFoodNameAlert = () => {
    setOpenFoodNameAlert(false);
  };

  const saveFoodLog = async () => {
    await services.dataService.saveFoodLog({ ...foodLog });
  };

  const onSwitchAlternative = async (attributes: PassioFoodItem) => {
    const newFoodLog = convertPassioFoodItemToFoodLog(
      attributes,
      new Date(foodLog.eventTimestamp),
      foodLog.meal
    );
    setFoodLog({ ...newFoodLog });
  };

  const onCreateCustomFood = (isUpdateUponCreating: boolean) => {
    const uuid: string = uuid4.v4() as string;

    navigateToFoodCreatorScreen(
      {
        ...foodLog,
        uuid: uuid,
        barcode: foodLog?.foodItems?.[0].barcode,
      },
      isUpdateUponCreating
    );
  };

  const onEditCustomFood = async (isUpdateUponCreating: boolean) => {
    if (foodLog.refCustomFoodID) {
      const customFood = await services.dataService?.getCustomFoodLog(
        foodLog.refCustomFoodID
      );
      if (customFood) {
        navigateToFoodCreatorScreen(customFood, isUpdateUponCreating);
      } else {
        setTimeout(() => {
          foodNotFoundRef?.current?.onShow(isUpdateUponCreating);
        }, 200);
      }
    }
  };

  const navigateToFoodCreatorScreen = (
    customFood: CustomFood,
    isUpdateUponCreating: boolean
  ) => {
    navigation.push('FoodCreatorScreen', {
      foodLog: customFood,
      onSave: async (item) => {
        if (item && isUpdateUponCreating) {
          services.dataService.saveFoodLog(
            combineCustomFoodAndFoodLog(item, foodLog)
          );
          navigation.pop();
          navigation.replace('BottomNavigation', {
            screen: 'MealLogScreen',
          });
        } else {
          navigation.pop();
          navigation.replace('MyFoodsScreen', {});
        }
      },
      from: 'Search',
    });
  };

  const onEditCustomFoodPress = async () => {
    if (params.prevRouteName === 'MyFood') {
      params?.onEditCustomFood?.(foodLog);
    } else {
      alertCustomFoodRef.current?.onShow(foodLog.refCustomFoodID);
    }
  };

  const onSwitchAlternativePress = () => {
    navigation.navigate('FoodSearchScreen', {
      from: 'Other',
      onSaveData: (item: PassioFoodItem) => {
        onSwitchAlternative(item);
      },
    });
  };

  const onMoreDetailPress = () => {
    navigation.navigate('NutritionInformationScreen', {
      nutrient: mergeNutrients(foodLog.foodItems.flatMap((i) => i.nutrients)),
    });
  };

  const onDeleteFoodLog = async () => {
    await services.dataService.deleteFoodLog(foodLog.uuid);
  };

  const onDateChangePress = (date: Date) => {
    updateEventTimeStamp(date);
    onConfirmDateSelection(date);
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
      } else {
        navigation.dispatch(StackActions.pop(2));
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

  const onAddIngredientPress = () => {
    if (params.prevRouteName === 'MyFood') {
      params?.onEditRecipeFood?.(foodLog);
    } else {
      // alertCustomFoodRef.current?.onShow(foodLog.refCustomFoodID);
    }
  };

  const onEditIngredientPress = useCallback(
    (foodItem: FoodItem) => {
      navigation.navigate('EditIngredientScreen', {
        foodItem: foodItem,
        deleteIngredient: (item) => {
          deleteIngredient(item);
          navigation.goBack();
        },
        updateIngredient,
      });
    },
    [navigation, updateIngredient, deleteIngredient]
  );

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
    foodNotFoundRef,
    branding,
    eventTimeStamp,
    foodLog,
    from: params.prevRouteName,
    isFavorite,
    isHideFavorite: params.prevRouteName === 'Favorites',
    isHideMealTime: params.prevRouteName === 'Favorites',
    isHideTimeStamp: params.prevRouteName === 'Favorites',
    isOpenDatePicker,
    isOpenFavoriteFoodAlert,
    isOpenFoodNameAlert,
    closeDatePicker,
    closeFavoriteFoodLogAlert,
    closeSaveFoodNameAlert,
    deleteIngredient,
    onAddIngredientPress,
    onCancelPress,
    onDateChangePress,
    onDeleteFoodLogPress,
    onDeleteFavoritePress,
    onEditCustomFoodPress,
    onEditIngredientPress,
    onMealLabelPress,
    onSwitchAlternativePress,
    onSaveFavoriteFoodLog,
    onSaveFoodLogName,
    onSavePress,
    onSwitchAlternative,
    onUpdateFavoritePress,
    onUpdateFoodLog,
    openDatePicker,
    setOpenFoodNameAlert,
    onMoreDetailPress,
    onCreateCustomFood,
    onEditCustomFood,
  };
}
