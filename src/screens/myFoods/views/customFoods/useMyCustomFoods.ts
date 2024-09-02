import { useState, useEffect } from 'react';
import { useBranding, useServices } from '../../../../contexts';
import type { CustomFood, FoodLog } from '../../../../models';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { getMealLog, ShowToast } from '../../../../utils';
import type { ScreenNavigationProps } from '../../useMyFoodScreen';
import { createFoodLogByCustomFood } from '../../../../screens/foodCreator/FoodCreator.utils';

export const useMyCustomFoods = () => {
  const branding = useBranding();
  const services = useServices();
  const navigation = useNavigation<ScreenNavigationProps>();

  const [customFoods, setCustomFood] = useState<CustomFood[]>();
  const isFocused = useIsFocused();

  useEffect(() => {
    function init() {
      services.dataService.getCustomFoodLogs().then((data) => {
        setCustomFood(data);
      });
    }
    init();
  }, [services.dataService, isFocused]);

  const onCreateFoodPress = () => {
    navigation.navigate('FoodCreatorScreen', {});
  };

  const onEditFoodCreatorPress = (food: CustomFood) => {
    navigation.navigate('FoodCreatorScreen', {
      foodLog: food,
      onSave: () => {
        navigation.pop();
      },
    });
  };

  const onDeletePress = (food: CustomFood) => {
    services.dataService.deleteCustomFood(food.uuid).then(() => {
      setCustomFood((i) => i?.filter((c) => c.uuid !== food.uuid));
    });
  };

  const getFoodLog = (food: CustomFood) => {
    const date = new Date();
    const meal = getMealLog(date, undefined);
    const foodLog = createFoodLogByCustomFood(food, date, meal);
    foodLog.refCustomFoodID = food.uuid;
    return foodLog;
  };

  const onLogPress = async (food: CustomFood) => {
    const log: FoodLog = getFoodLog(food);
    log.refCustomFoodID = food.uuid;
    await services.dataService.saveFoodLog(log);
    ShowToast('Added your food into ' + log.meal);
  };

  const onFoodDetailPress = (customFood: CustomFood) => {
    navigation.navigate('EditFoodLogScreen', {
      foodLog: getFoodLog(customFood),
      prevRouteName: 'MyFood',
      onEditCustomFood: (_food) => {
        onEditFoodCreatorPress(customFood);
      },
    });
  };

  return {
    branding,
    customFoods,
    onCreateFoodPress,
    onEditFoodCreatorPress,
    onFoodDetailPress,
    onDeletePress,
    onLogPress,
  };
};
