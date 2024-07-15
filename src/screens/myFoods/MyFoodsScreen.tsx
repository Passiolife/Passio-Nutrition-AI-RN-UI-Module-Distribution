import { View } from 'react-native';

import React from 'react';
import { myFoodScreenStyle } from './MyFoodsScreen.styles';
import {
  MYFoodScreens,
  MYFoodScreensType,
  useMyFoodScreen,
} from './useMyFoodScreen';
import { BackNavigation, BasicButton, TabBar } from '../../components';
import CustomFoods from './views/customFoods/CustomFoods';
import CustomRecipe from './views/customRecipe/CustomRecipe';

export const MyFoodsScreen = () => {
  const {
    branding,
    tab,
    setTab,
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
        list={MYFoodScreens}
        onTabSelect={(value) => {
          setTab(value as MYFoodScreensType);
        }}
      />
    );
  };

  return (
    <View style={styles.body}>
      <BackNavigation title="My Foods" bottomView={renderTab()} />
      <View style={styles.container}>
        {tab === 'Custom Foods' ? (
          <CustomFoods
            customFoods={customFoods ?? []}
            onPressEditor={onEditorPress}
            onPressLog={onLogPress}
            onPressDelete={onDeletePress}
          />
        ) : (
          <CustomRecipe />
        )}
      </View>
      {tab === 'Custom Foods' && (
        <BasicButton
          text="Create New Food"
          style={styles.button}
          onPress={onCreateFoodPress}
        />
      )}
    </View>
  );
};
