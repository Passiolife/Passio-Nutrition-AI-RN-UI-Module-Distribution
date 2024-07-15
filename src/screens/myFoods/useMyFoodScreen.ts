import { useState, useEffect } from 'react';
import { useBranding, useServices } from '../../contexts';
import type { CustomFood, FoodLog } from '../../models';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import uuid4 from 'react-native-uuid';
import { getMealLog } from '../../utils';
import { convertDateToDBFormat } from '../../utils/DateFormatter';

export type MYFoodScreensType = 'Custom Foods' | 'Recipe';
export const MYFoodScreens: MYFoodScreensType[] = ['Custom Foods', 'Recipe'];
type ScreenNavigationProps = StackNavigationProp<ParamList, 'MyFoodsScreen'>;

export const useMyFoodScreen = () => {
  const branding = useBranding();
  const services = useServices();
  const navigation = useNavigation<ScreenNavigationProps>();
  const [tab, setTab] = useState(MYFoodScreens[0]);

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

  const onEditorPress = (food: CustomFood) => {
    navigation.navigate('FoodCreatorScreen', {
      foodLog: food,
    });
  };

  const onDeletePress = (food: CustomFood) => {
    services.dataService.deleteCustomFood(food.uuid).then(() => {
      setCustomFood((i) => i?.filter((c) => c.uuid !== food.uuid));
    });
  };

  const onLogPress = (food: CustomFood) => {
    const date = new Date();
    const meal = getMealLog(date, undefined);
    const uuid: string = uuid4.v4() as string;

    const foodLog: FoodLog = {
      ...food,
      passioID: '',
      eventTimestamp: convertDateToDBFormat(date),
      meal: meal,
      uuid: uuid,
    };

    navigation.navigate('EditFoodLogScreen', {
      foodLog: foodLog,
      prevRouteName: 'Other',
    });
  };
  return {
    branding,
    customFoods,
    setTab,
    tab,
    onCreateFoodPress,
    onEditorPress,
    onDeletePress,
    onLogPress,
  };
};
