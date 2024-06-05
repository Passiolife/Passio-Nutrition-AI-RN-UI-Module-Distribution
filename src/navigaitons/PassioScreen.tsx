import React from 'react';
import { EntryProvider } from '../contexts/entry/EntryContext';
import { NutritionNavigator } from './Nutrition-Navigator';
import { useNavigation } from '@react-navigation/native';
import { BackHandler } from 'react-native';

export const PassioScreens = () => {
  const navigation = useNavigation();
  return (
    <EntryProvider
      entry={{
        onBackToHost() {
          if (navigation.canGoBack()) {
            return navigation.goBack();
          } else {
            BackHandler.exitApp();
          }
        },
      }}
    >
      <NutritionNavigator />
    </EntryProvider>
  );
};
