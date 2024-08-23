import { View } from 'react-native';

import React from 'react';
import { myFoodScreenStyle } from './MyFoodsScreen.styles';
import {
  MYFoodScreens,
  MYFoodScreensType,
  useMyFoodScreen,
} from './useMyFoodScreen';
import { BackNavigation, TabBar } from '../../components';
import CustomFoods from './views/customFoods/CustomFoods';
import CustomRecipe from './views/customRecipe/CustomRecipe';

export const MyFoodsScreen = () => {
  const { branding, tab, setTab, selectedTab } = useMyFoodScreen();

  const styles = myFoodScreenStyle(branding);

  const renderTab = () => {
    return (
      <TabBar
        list={MYFoodScreens}
        selectedTab={selectedTab}
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
        {tab === 'Custom Foods' ? <CustomFoods /> : <CustomRecipe />}
      </View>
    </View>
  );
};
