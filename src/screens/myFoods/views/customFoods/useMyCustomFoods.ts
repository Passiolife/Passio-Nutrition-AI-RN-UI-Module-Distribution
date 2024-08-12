import { useState, useEffect } from 'react';
import { useBranding, useServices } from '../../../../contexts';
import type { CustomFood, FoodLog } from '../../../../models';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import uuid4 from 'react-native-uuid';
import { getMealLog, ShowToast } from '../../../../utils';
import { convertDateToDBFormat } from '../../../../utils/DateFormatter';
import type { ScreenNavigationProps } from '../../useMyFoodScreen';
import { Alert } from 'react-native';

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
    Alert.alert('Are you sure want to delete this from my food?', undefined, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          services.dataService.deleteCustomFood(food.uuid).then(() => {
            setCustomFood((i) => i?.filter((c) => c.uuid !== food.uuid));
          });
        },
        style: 'destructive',
      },
    ]);
  };

  const getFoodLog = (food: CustomFood) => {
    const date = new Date();
    const meal = getMealLog(date, undefined);
    const uuid: string = uuid4.v4() as string;

    const foodLog: FoodLog = {
      ...food,
      eventTimestamp: convertDateToDBFormat(date),
      meal: meal,
      uuid: uuid,
    };
    return foodLog;
  };

  const onLogPress = async (food: CustomFood) => {
    const log: FoodLog = getFoodLog(food);
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
