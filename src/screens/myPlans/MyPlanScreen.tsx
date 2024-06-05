import React from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';
import { View } from 'react-native';
import { BackNavigation, DashboardMenu } from '../../components';
import { withLoading } from '../../components/withLoading';
import type { ParamList } from '../../navigaitons';
import MealPlanScreen from './mealPlan/mealPlanScreen';
import styles from './styles';
import { useMyPlan } from './useMyPlan';
import type { MealLabel } from '../../models';
export type MealPlanScreenNavigationProps = StackNavigationProp<
  ParamList,
  'MyPlanScreen'
>;

export interface MyPlanScreenProps {
  logToDate: Date | undefined;
  logToMeal: MealLabel | undefined;
}

const MyPlanScreen = () => {
  const { tab } = useMyPlan();

  return (
    <View style={styles.bodyContainer} testID="testView">
      <BackNavigation title={'Meal Plan'} rightSide={<DashboardMenu />} />
      {tab === 'MealPlan' && <MealPlanScreen />}
    </View>
  );
};

export default withLoading(MyPlanScreen);
