import { useState, useEffect } from 'react';
import { useBranding, useServices } from '../../contexts';
import type { CustomFood } from '../../models';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';
import { useNavigation } from '@react-navigation/native';

type ScreenNavigationProps = StackNavigationProp<ParamList, 'MyFoodsScreen'>;

export const useMyFoodScreen = () => {
  const branding = useBranding();
  const services = useServices();
  const navigation = useNavigation<ScreenNavigationProps>();

  const [customFoods, setCustomFood] = useState<CustomFood[]>();

  useEffect(() => {
    function init() {
      services.dataService.getCustomFoodLogs().then((data) => {
        setCustomFood(data);
      });
    }
    init();
  }, [services.dataService]);

  const onCreateFoodPress = () => {
    navigation.navigate('FoodCreatorScreen', {});
  };

  const onPressEditor = (food: CustomFood) => {
    navigation.navigate('FoodCreatorScreen', {
      foodLog: food,
    });
  };

  const onPressLog = (_food: CustomFood) => {};
  return {
    branding,
    customFoods,
    onCreateFoodPress,
    onPressEditor,
    onPressLog,
  };
};
