import { View } from 'react-native';

import React from 'react';
import { myFoodScreenStyle } from './MyFoodsScreen.styles';
import { useMyFoodScreen } from './useMyFoodScreen';
import { BackNavigation, BasicButton, TabBar } from '../../components';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';
import { useSharedValue } from 'react-native-reanimated';

type ScreenNavigationProps = StackNavigationProp<ParamList, 'MyFoodsScreen'>;

const TabList = ['Custom Foods', 'Recipe'];

export const MyFoodsScreen = () => {
  const { branding } = useMyFoodScreen();
  const navigation = useNavigation<ScreenNavigationProps>();
  const tab = useSharedValue(TabList[0]);

  const styles = myFoodScreenStyle(branding);

  const renderTab = () => {
    return (
      <TabBar
        list={TabList}
        onTabSelect={(value) => {
          tab.value = value;
        }}
      />
    );
  };

  return (
    <View style={styles.body}>
      <BackNavigation title="My Foods" bottomView={renderTab()} />
      <View style={styles.container} />
      <BasicButton
        text="Create New Food"
        style={styles.button}
        onPress={() => {
          navigation.navigate('FoodCreatorScreen', {});
        }}
      />
    </View>
  );
};
