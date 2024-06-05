import React from 'react';
import { Image, View } from 'react-native';
import {
  Card,
  HorizontalCalendar,
  MealPlanMenu,
  ProgressLoadingView,
  Text,
} from '../../../components';
import { withLoading } from '../../../components/withLoading';
import MealPlanView from './view/MealPlanView';
import { useMealPlan } from './useMealPlan';
import { ICONS } from '../../../assets';
import { useBranding } from '../../../contexts';
import mealPlanScreenStyle from './mealPlan.Styles';

const MealPlanScreen = () => {
  const {
    activeMealPlanName,
    day,
    isLoading,
    isLoadingPlan,
    mealPlans,
    passioMealPlans,
    onAddFoodLogPress,
    onChangeMealPlanPress,
    onDayChanged,
    onEditFoodLogPress,
    onMultipleLogPress,
  } = useMealPlan();

  const mealPlanStyle = mealPlanScreenStyle(useBranding());

  return (
    <View style={mealPlanStyle.bodyContainer} testID="myPlan.mealPlanView">
      {activeMealPlanName && (
        <Card style={mealPlanStyle.cardContainer}>
          <View style={mealPlanStyle.cardHeader}>
            <Image
              source={ICONS.mealPlan}
              resizeMethod="resize"
              resizeMode="contain"
              style={mealPlanStyle.icon}
            />
            <Text
              weight="600"
              size="_18px"
              style={[mealPlanStyle.mealPlanText]}
            >
              {activeMealPlanName}
            </Text>
            <MealPlanMenu
              onPress={onChangeMealPlanPress}
              plan={passioMealPlans}
            />
          </View>
          <HorizontalCalendar
            selectedDay={day}
            onSelectDayPress={function (createdDay: number): void {
              onDayChanged(createdDay);
            }}
          />
        </Card>
      )}
      <MealPlanView
        isAddEnable={true}
        foodLogs={mealPlans}
        navigateToEditFoodLog={onEditFoodLogPress}
        onAddFoodLog={onAddFoodLogPress}
        onMultipleLogPress={onMultipleLogPress}
      />
      {(isLoading || isLoadingPlan) && (
        <View
          style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}
        >
          <ProgressLoadingView />
        </View>
      )}
    </View>
  );
};

export default withLoading(MealPlanScreen);
