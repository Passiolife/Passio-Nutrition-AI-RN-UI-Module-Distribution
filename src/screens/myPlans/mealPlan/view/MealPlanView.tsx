import React, { useCallback } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

import type { MealPlan } from '../../../../models';
import MealLogItemView from './MealLogItemView';
import { Card, Text } from '../../../../components';
import { scaleHeight, scaleWidth } from '../../../../utils';
import { useBranding, type Branding } from '../../../../contexts';
import styles from './MeaLogView.Style';
import type { PassioMealPlanItem } from '@passiolife/nutritionai-react-native-sdk-v3';

interface Props {
  isAddEnable: boolean | false;
  foodLogs: Array<MealPlan> | [];
  onAddFoodLog: (passioMealPlanItem: PassioMealPlanItem) => void;
  navigateToEditFoodLog: (passioMealPlanItem: PassioMealPlanItem) => void;
  onMultipleLogPress: (passioMealPlanItem: PassioMealPlanItem[]) => void;
}

const RenderItem = ({
  itemMealPlan,
  navigateToEditFoodLog,
  onAddFoodLog,
  onMultipleLogPress,
}: {
  itemMealPlan: MealPlan;
  navigateToEditFoodLog: (foodLog: PassioMealPlanItem) => void;
  onAddFoodLog: (foodLog: PassioMealPlanItem) => void;
  onMultipleLogPress: (foodLog: PassioMealPlanItem[]) => void;
}) => {
  const navigateToEditFootLogScreen = useCallback(
    (food: PassioMealPlanItem) => {
      navigateToEditFoodLog(food);
    },
    [navigateToEditFoodLog]
  );

  const renderFoodItem = ({ item }: { item: PassioMealPlanItem }) => {
    return (
      <MealLogItemView
        passioMealPlanItem={item}
        onPress={navigateToEditFootLogScreen}
        onAddFoodLog={(addFoodLogItem) => onAddFoodLog(addFoodLogItem)}
      />
    );
  };
  const mealLogViewStyles = mealLogViewStyle(useBranding());

  return (
    <Card style={mealLogViewStyles.cardContainer}>
      <View style={mealLogViewStyles.heder}>
        <Text
          weight={'600'}
          size="title"
          color="text"
          style={mealLogViewStyles.title}
        >
          {itemMealPlan.title}
        </Text>

        <TouchableOpacity
          onPress={() => {
            onMultipleLogPress(itemMealPlan.data);
          }}
        >
          <Text
            weight={'500'}
            size="title"
            color="primaryColor"
            style={mealLogViewStyles.logEntire}
          >
            {'Log Entire Meal'}
          </Text>
        </TouchableOpacity>
      </View>
      {itemMealPlan.data.length > 0 && (
        <>
          <View style={mealLogViewStyles.line} />
          <FlatList
            data={itemMealPlan.data}
            renderItem={renderFoodItem}
            keyExtractor={(__: PassioMealPlanItem) => __.meal.iconID.toString()}
          />
        </>
      )}
    </Card>
  );
};

const MealLogsView = (props: Props) => {
  const navigateToEditFootLogScreen = (item: PassioMealPlanItem) => {
    props.navigateToEditFoodLog(item);
  };

  const renderFooter = () => {
    return <View style={styles.footer} />;
  };

  return (
    <FlatList
      data={props.foodLogs}
      ListFooterComponent={renderFooter}
      renderItem={({ item }) => (
        <RenderItem
          itemMealPlan={item}
          onAddFoodLog={props.onAddFoodLog}
          navigateToEditFoodLog={navigateToEditFootLogScreen}
          onMultipleLogPress={props.onMultipleLogPress}
        />
      )}
      keyExtractor={(__: MealPlan) => __.title.toString()}
    />
  );
};
const mealLogViewStyle = ({ border }: Branding) =>
  StyleSheet.create({
    title: {
      textTransform: 'capitalize',
      flex: 1,
    },
    logEntire: {},
    footer: {
      height: scaleHeight(0),
    },
    upDown: {
      height: scaleHeight(24),
      width: scaleWidth(24),
    },
    heder: {
      flexDirection: 'row',
      paddingVertical: scaleHeight(14),
      paddingHorizontal: scaleHeight(14),
    },
    cardContainer: {
      marginHorizontal: scaleWidth(13),
      marginVertical: scaleHeight(8),
    },
    line: {
      height: scaleHeight(1),
      backgroundColor: border,
    },
  });

export default React.memo(MealLogsView);
