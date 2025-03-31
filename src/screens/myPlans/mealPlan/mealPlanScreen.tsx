import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
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
    isInfo,
    onInfoPress,
    onAddFoodLogPress,
    onChangeMealPlanPress,
    onDayChanged,
    onEditFoodLogPress,
    onMultipleLogPress,
  } = useMealPlan();

  const mealPlanStyle = mealPlanScreenStyle(useBranding());

  const renderInfo = () => {
    return (
      <>
        {!isInfo && (
          <TouchableOpacity onPress={onInfoPress}>
            <Image
              source={ICONS.newInfo}
              style={{
                height: 24,
                width: 24,
                marginHorizontal: 16,
                alignSelf: 'flex-end',
                marginTop: 16,
                alignContent: 'flex-end',
              }}
            />
          </TouchableOpacity>
        )}
        {isInfo && (
          <Card style={{ marginVertical: 16, marginHorizontal: 16 }}>
            <View style={{ padding: 16, marginBottom: 16 }}>
              <TouchableOpacity onPress={onInfoPress}>
                <Image
                  source={ICONS.newClose}
                  style={{
                    height: 24,
                    width: 24,
                    marginBottom: 8,
                    alignSelf: 'flex-end',
                    alignContent: 'flex-end',
                  }}
                />
              </TouchableOpacity>

              <Text
                weight="400"
                size="secondlyTitle"
                style={{ textAlign: 'center', paddingHorizontal: 0 }}
              >
                {
                  'These meal plans are general guidelines and not based on personal dietary needs. Always consult with a healthcare provider or nutritionist'
                }
              </Text>
            </View>
          </Card>
        )}
      </>
    );
  };
  return (
    <View style={mealPlanStyle.bodyContainer} testID="myPlan.mealPlanView">
      {renderInfo()}
      {activeMealPlanName && (
        <Card style={mealPlanStyle.cardContainer}>
          <View style={mealPlanStyle.cardHeader}>
            <Image
              source={ICONS.mealPlan}
              resizeMethod="resize"
              resizeMode="contain"
              style={[mealPlanStyle.icon, mealPlanStyle.iconColor]}
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
