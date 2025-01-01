import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';

import {
  type BottomTabNavigationOptions,
  createBottomTabNavigator,
  type BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBranding, type Branding } from '../contexts';
import type { BottomNavTab } from './BottomTabNavigations';
import { TabBar } from './TabBar';
import { ICONS } from '../assets';
import {
  HomeScreenRoute,
  MealLogScreenRoute,
  MyPlanScreenRoute,
  ProgressScreenRoute,
} from './Route';
import MealLogScreen, {
  type MealLogScreenProps,
} from '../screens/meallogss/MealLogScreen';
import MyPlanScreen, {
  type MyPlanScreenProps,
} from '../screens/myPlans/MyPlanScreen';
import type { ProgressScreenProps } from '../screens/progress/ProgressScreen';
import ProgressScreen from '../screens/progress/ProgressScreen';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from './params';
import HomeScreen, {
  type HomeScreenScreenProps,
} from '../screens/home/HomeScreen';
export type HomeBottomStackParams = {
  [HomeScreenRoute]: HomeScreenScreenProps;
  [MealLogScreenRoute]: MealLogScreenProps;
  [MyPlanScreenRoute]: MyPlanScreenProps;
  [ProgressScreenRoute]: ProgressScreenProps;
  ['Blank']: undefined;
};

const BottomTab = createBottomTabNavigator<HomeBottomStackParams>();

const bottomScreenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarShowLabel: false,
};

const defaultMenu: BottomNavTab[] = [
  {
    icon: ICONS.bottomHome,
    selectedIcon: ICONS.bottomHome,
    title: 'Home',
    type: 'Home',
  },
  {
    icon: ICONS.bottomDiary,
    selectedIcon: ICONS.bottomDiary,
    title: 'Diary',
    type: 'Diary',
  },
  {
    icon: ICONS.bottomMealPlan,
    selectedIcon: ICONS.bottomMealPlan,
    title: 'Blank',
    type: 'Blank',
  },
  {
    icon: ICONS.bottomMealPlan,
    selectedIcon: ICONS.bottomMealPlan,
    title: 'Meal Plan',
    type: 'MealPlan',
  },
  {
    icon: ICONS.bottomProgress,
    selectedIcon: ICONS.bottomProgress,
    title: 'Progress',
    type: 'Progress',
  },
];

export type ScreenNavigationProps = StackNavigationProp<
  ParamList,
  'BottomNavigation'
>;

export const HomeBottomNavigation = React.memo(() => {
  const navigation = useNavigation<ScreenNavigationProps>();

  const menu: Array<BottomNavTab> = [...defaultMenu];

  const styles = homeBottomNavigationStyle(useBranding());

  const mealLogDateRef = useRef(new Date());

  const onTakePicture = () => {
    navigation.navigate('TakePictureScreen', {
      logToDate: mealLogDateRef.current,
      logToMeal: undefined,
      type: 'picture',
    });
  };

  const renderTabs = (props: BottomTabBarProps) => {
    return (
      <SafeAreaView edges={['bottom']} style={styles.safeAreaStyle}>
        <TabBar
          onFoodScanner={() => {
            navigation.navigate('ScanningScreen', {
              logToDate: mealLogDateRef.current,
              logToMeal: undefined,
            });
          }}
          onTextSearch={() => {
            navigation.navigate('FoodSearchScreen', {
              logToDate: mealLogDateRef.current,
              logToMeal: undefined,
              from: 'Search',
            });
          }}
          onFavorite={() => {
            navigation.navigate('FavoritesScreen', {
              logToDate: mealLogDateRef.current,
              logToMeal: undefined,
            });
          }}
          onVoiceLogging={() => {
            navigation.navigate('VoiceLoggingScreen', {
              logToDate: mealLogDateRef.current,
              logToMeal: undefined,
            });
          }}
          onTakeCamera={() => {
            navigation.navigate('TakePictureScreen', {
              logToDate: mealLogDateRef.current,
              logToMeal: undefined,
              type: 'camera',
            });
          }}
          onAiAdvisor={() => {
            navigation.navigate('AdvisorScreen', {
              logToDate: mealLogDateRef.current,
              logToMeal: undefined,
            });
          }}
          onMyFoods={() => {
            navigation.navigate('MyFoodsScreen', {
              logToDate: mealLogDateRef.current,
              logToMeal: undefined,
            });
          }}
          onTakePicture={onTakePicture}
          {...props}
          items={menu}
        />
      </SafeAreaView>
    );
  };
  return (
    <>
      <BottomTab.Navigator
        tabBar={renderTabs}
        backBehavior="history"
        screenOptions={{
          ...bottomScreenOptions,
        }}
      >
        <BottomTab.Screen
          name={HomeScreenRoute}
          component={HomeScreen}
          initialParams={{
            defaultDate: mealLogDateRef.current,
            onDateChange: (date) => {
              mealLogDateRef.current = date;
            },
            navigateToMealLog: (date) => {
              mealLogDateRef.current = date;
              navigation.replace('BottomNavigation', {
                screen: 'MealLogScreen',
                params: { defaultDate: date },
              });
            },
          }}
        />
        <BottomTab.Screen
          name={MealLogScreenRoute}
          component={MealLogScreen}
          initialParams={{
            defaultDate: mealLogDateRef.current,
            onDateChange: (date) => {
              mealLogDateRef.current = date;
            },
          }}
        />
        <BottomTab.Screen name={'Blank'} component={MealLogScreen} />
        <BottomTab.Screen
          name={MyPlanScreenRoute}
          component={MyPlanScreen}
          initialParams={{
            logToDate: mealLogDateRef.current,
            logToMeal: 'breakfast',
          }}
        />
        <BottomTab.Screen
          name={ProgressScreenRoute}
          component={ProgressScreen}
        />
      </BottomTab.Navigator>
    </>
  );
});

const homeBottomNavigationStyle = ({ black }: Branding) => {
  const styles = StyleSheet.create({
    safeAreaStyle: { backgroundColor: black },
  });
  return styles;
};
