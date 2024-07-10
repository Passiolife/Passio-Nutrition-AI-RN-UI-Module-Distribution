import { View } from 'react-native';

import React from 'react';
import { myFoodScreenStyle } from './MyFoodsScreen.styles';
import { MY_FOOD_SCREENS, useMyFoodScreen } from './useMyFoodScreen';
import { BackNavigation, BasicButton, TabBar } from '../../components';
import CustomFoods from './views/customFoods/CustomFoods';

export const MyFoodsScreen = () => {
  const {
    branding,
    tabs,
    customFoods,
    onCreateFoodPress,
    onEditorPress,
    onDeletePress,
    onLogPress,
  } = useMyFoodScreen();

  const styles = myFoodScreenStyle(branding);

  const renderTab = () => {
    return (
      <TabBar
        list={MY_FOOD_SCREENS}
        onTabSelect={(value) => {
          tabs.value = value;
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
          onPressEditor={onEditorPress}
          onPressLog={onLogPress}
          onPressDelete={onDeletePress}
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
