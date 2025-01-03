import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { enableScreens } from 'react-native-screens';
import { NavigationContainer } from '@react-navigation/native';
import {
  DashboardScreen,
  EditFoodLogScreen,
  MyFavoritesScreen,
  NutritionApp,
  NutritionProfileScreen,
  QuickScanningScreen,
  FoodSearchScreen,
  EditIngredientScreen,
  MyRecipesScreen,
  OnboardingScreen,
  RecipeEditorScreen,
  IngredientQuickScanScreen,
  VoiceLoggingScreen,
  TakePictureScreen,
  AdvisorScreen,
  ImagePickerScreen,
  MyFoodsScreen,
  FoodCreatorScreen,
  BarcodeScanScreen,
  EditRecipeScreen,
  PhotoLoggingScreen,
} from '../screens';
import {
  DashboardScreenRoute,
  NutritionAppRoute,
  NutritionProfileScreenRoute,
  ScanningScreenRoute,
  NutritionProfileScreenAppRoute,
  FoodSearchScreenRoute,
  OnboardingScreenRoute,
  ROUTES,
  MyRecipeScreen,
  IngredientQuickScanScreenRoute,
  FavoritesScreenRoute,
  MyPlanScreenRoute,
  MealLogScreenRoute,
  BottomNavigation,
  WaterScreenRoute,
  WaterEntryRout,
  WeightScreenRoute,
  WeightEntryRoute,
  SettingScreenRoute,
  NutritionInformationScreenRoute,
  TakePictureScreenRoute,
  AdvisorScreenRoute,
  ImagePickerScreenRoute,
  BarcodeScanScreenRoute,
  MyFoodsScreenRoute,
  FoodCreatorScreenRoute,
  EditRecipeScreenRoute,
  PhotoLoggingScreenRoute,
} from './Route';
import MyPlanScreen from '../screens/myPlans/MyPlanScreen';
import { HomeBottomNavigation } from './HomeBottomNavigations';
import MealLogScreen from '../screens/meallogss/MealLogScreen';
import Toast, { type ToastConfig } from 'react-native-toast-message';
import { toastConfig } from '../components';
import WaterEntry from '../screens/water/views/waterentry/WaterEntry';
import WeightScreen from '../screens/weight/WeightScreen';
import WeightEntry from '../screens/weight/views/weightentry/WeightEntry';
import WaterScreen from '../screens/water/WaterScreen';
import { SettingScreen } from '../screens/setting/SettingScreen';
import NutritionInformationScreen from '../screens/nutritionInformation/NutritionInformationScreen';
import { AdvisorSessionProvider } from '../contexts/adviosr/AdviosrContext';
const Stack = createNativeStackNavigator();
enableScreens();

export const NutritionNavigator = () => {
  return (
    <>
      <AdvisorSessionProvider>
        <NavigationContainer independent={true}>
          <Stack.Navigator
            screenOptions={{
              animationTypeForReplace: 'push',
              gestureEnabled: true,
              gestureDirection: 'horizontal',
            }}
            initialRouteName={BottomNavigation}
          >
            <Stack.Screen
              options={{ headerShown: false }}
              name={BottomNavigation}
              component={HomeBottomNavigation}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={OnboardingScreenRoute}
              component={OnboardingScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={NutritionAppRoute}
              component={NutritionApp}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={MealLogScreenRoute}
              initialParams={{ defaultDate: new Date() }}
              component={MealLogScreen}
            />

            <Stack.Screen
              options={{ headerShown: false }}
              name={DashboardScreenRoute}
              component={DashboardScreen}
            />

            <Stack.Screen
              options={{ headerShown: false }}
              name={ScanningScreenRoute}
              component={QuickScanningScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={NutritionProfileScreenRoute}
              component={NutritionProfileScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={NutritionProfileScreenAppRoute}
              component={NutritionProfileScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={FoodSearchScreenRoute}
              component={FoodSearchScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={NutritionInformationScreenRoute}
              component={NutritionInformationScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={ROUTES.EditFoodLogScreen}
              component={EditFoodLogScreen}
            />

            <Stack.Screen
              options={{ headerShown: false }}
              name={FavoritesScreenRoute}
              component={MyFavoritesScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={WaterScreenRoute}
              component={WaterScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={WaterEntryRout}
              component={WaterEntry}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={WeightScreenRoute}
              component={WeightScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={WeightEntryRoute}
              component={WeightEntry}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={ROUTES.EditIngredientScreen}
              component={EditIngredientScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={MyRecipeScreen}
              component={MyRecipesScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={ROUTES.RecipeEditorScreen}
              component={RecipeEditorScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={IngredientQuickScanScreenRoute}
              component={IngredientQuickScanScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={MyPlanScreenRoute}
              component={MyPlanScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={SettingScreenRoute}
              component={SettingScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={ROUTES.VoiceLoggingScreen}
              component={VoiceLoggingScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={TakePictureScreenRoute}
              component={TakePictureScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={AdvisorScreenRoute}
              component={AdvisorScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={ImagePickerScreenRoute}
              component={ImagePickerScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={FoodCreatorScreenRoute}
              component={FoodCreatorScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={MyFoodsScreenRoute}
              component={MyFoodsScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={BarcodeScanScreenRoute}
              component={BarcodeScanScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={EditRecipeScreenRoute}
              component={EditRecipeScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name={PhotoLoggingScreenRoute}
              component={PhotoLoggingScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </AdvisorSessionProvider>
      <Toast
        visibilityTime={2500}
        position="bottom"
        config={toastConfig as ToastConfig}
      />
    </>
  );
};
