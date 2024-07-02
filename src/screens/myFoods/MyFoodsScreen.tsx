import { View } from 'react-native';

import React from 'react';
import { myFoodScreenStyle } from './MyFoodsScreen.styles';
import { useMyFoodScreen } from './useMyFoodScreen';
import { BackNavigation, BasicButton } from '../../components';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';

type ScreenNavigationProps = StackNavigationProp<ParamList, 'MyFoodsScreen'>;

export const MyFoodsScreen = () => {
  const { branding } = useMyFoodScreen();
  const navigation = useNavigation<ScreenNavigationProps>();

  const styles = myFoodScreenStyle(branding);

  return (
    <View style={styles.body}>
      <BackNavigation title="My Foods" />
      <BasicButton
        text="Create New Food"
        onPress={() => {
          navigation.navigate('FoodCreatorScreen', {});
        }}
      />
    </View>
  );
};
