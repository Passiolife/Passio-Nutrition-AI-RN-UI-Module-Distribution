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
import { EmptyView } from '../../components/empty';

export const MyFoodsScreen = () => {
  const {
    branding,
    tab,
    setTab,
    customFoods,
    onCreateFoodPress,
    onEditorPress,
    onDeletePress,
    onCreateNewRecipe,
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
          <>
            {customFoods && customFoods?.length > 0 && (
              <CustomFoods
                customFoods={customFoods ?? []}
                onPressEditor={onEditorPress}
                onPressLog={onLogPress}
                onPressDelete={onDeletePress}
              />
            )}
            {customFoods === undefined ||
              (customFoods?.length === 0 && (
                <EmptyView title={''} description={'There is no custom food'} />
              ))}
          </>
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
      {tab !== 'Custom Foods' && (
        <BasicButton
          text="Create New Recipe"
          style={styles.button}
          onPress={onCreateNewRecipe}
        />
      )}
    </View>
  );
};
