import { View } from 'react-native';

import React from 'react';
import { myFoodScreenStyle } from './MyFoodsScreen.styles';
import { useMyFoodScreen } from './useMyFoodScreen';
import { BackNavigation, BasicButton, TabBar } from '../../components';
import { useSharedValue } from 'react-native-reanimated';
import CustomFoods from './views/customFoods/CustomFoods';

const TabList = ['Custom Foods', 'Recipe'];

export const MyFoodsScreen = () => {
  const {
    branding,
    customFoods,
    onCreateFoodPress,
    onPressEditor,
    onPressLog,
  } = useMyFoodScreen();
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
      <View style={styles.container}>
        <CustomFoods
          customFoods={customFoods ?? []}
          onPressEditor={onPressEditor}
          onPressLog={onPressLog}
        />
      </View>
      <BasicButton
        text="Create New Food"
        style={styles.button}
        onPress={onCreateFoodPress}
      />
    </View>
  );
};
