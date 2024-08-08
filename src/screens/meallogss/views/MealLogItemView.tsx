import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import type { FoodLog } from '../../../models';
import { DeleteFoodLogAlert } from '../../editFoodLogs';
import { caloriesText } from '../../../utils/StringUtils';
import { SwipeToDelete, Text } from '../../../components';
import { COLORS } from '../../../constants';
import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';

interface Props {
  foodLog: FoodLog;
  onPress?: () => unknown;
  onDeleteFoodLog: (foodLog: FoodLog) => void;
}

const MealLogItemView = (props: Props) => {
  const { foodLog, onPress } = props;

  const onDeleteFoodLog = useCallback(async () => {
    DeleteFoodLogAlert({
      onClose(): void {},
      async onDelete() {
        props.onDeleteFoodLog(foodLog);
      },
    });
  }, [foodLog, props]);

  return (
    <SwipeToDelete
      onPressDelete={onDeleteFoodLog}
      onPressEdit={onPress}
      action1="Details"
    >
      <TouchableOpacity onPress={onPress} style={styles.touchContainer}>
        <View style={styles.mealImgLayout}>
          <PassioFoodIcon
            iconID={foodLog.iconID}
            style={styles.mealImg}
            entityType={foodLog.entityType}
          />
        </View>
        <View style={styles.mealDetail}>
          <Text
            weight="600"
            size="secondlyTitle"
            color="text"
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.mealName}
          >
            {foodLog.name}
          </Text>
          <Text
            weight="400"
            size="_14px"
            color="secondaryText"
            style={styles.mealSize}
          >
            {`${foodLog.selectedQuantity} ${foodLog.selectedUnit}`}
            {' ('}
            {Math.round(foodLog.foodItems.at(0)?.computedWeight.value ?? 0) +
              ' ' +
              foodLog.foodItems.at(0)?.computedWeight.unit}
            {') '}
          </Text>
        </View>
        <View style={styles.mealContainer}>
          <TouchableOpacity>
            <Text weight="400" size="_14px" style={styles.plus}>
              {caloriesText(foodLog.foodItems, 'cal')}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </SwipeToDelete>
  );
};

const styles = StyleSheet.create({
  mealImgLayout: {
    borderRadius: 40,
    overflow: 'hidden',
    height: 40,
    width: 40,
  },
  mealImg: {
    height: 40,
    width: 40,
  },
  touchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealDetail: {
    marginHorizontal: 10,
    flex: 1,
  },
  mealContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealName: {
    textTransform: 'capitalize',
  },
  mealSize: {},
  mealDescription: {
    color: COLORS.monochrome,
    fontSize: 14,
    fontWeight: '400',
  },
  mealTime: {
    color: '#286CE2',
    marginRight: 10,
    fontWeight: '600',
    fontSize: 13,
  },
  plus: {},
});

export default React.memo(MealLogItemView);
