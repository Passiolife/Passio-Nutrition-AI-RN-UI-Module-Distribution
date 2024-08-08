import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { ICONS } from '../../../../assets';
import styles from './MeaLogView.Style';
import { PassioFoodIcon } from '../../../../components/passio/PassioFoodIcon';
import type { PassioMealPlanItem } from '@passiolife/nutritionai-react-native-sdk-v3';
import { Text } from '../../../../components';

interface Props {
  passioMealPlanItem: PassioMealPlanItem;
  onPress?: (passioMealPlanItem: PassioMealPlanItem) => unknown;
  onAddFoodLog: (passioMealPlanItem: PassioMealPlanItem) => void;
}

const MealLogItemView = (props: Props) => {
  const { passioMealPlanItem, onPress, onAddFoodLog } = props;
  const { meal } = passioMealPlanItem;

  async function onAddFoodLogPress() {
    onAddFoodLog(passioMealPlanItem);
  }

  async function onPressLog() {
    onPress?.(passioMealPlanItem);
  }
  return (
    <View style={styles.cardContainer}>
      <TouchableOpacity onPress={onPressLog} style={styles.touchContainer}>
        <View style={styles.mealImgLayout}>
          <PassioFoodIcon
            imageName={meal.iconID}
            style={styles.mealImg}
            passioID={meal.iconID}
            entityType={'user-recipe'}
          />
        </View>
        <View style={styles.mealDetail}>
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            color="text"
            size="secondlyTitle"
            style={styles.mealName}
          >
            {meal.foodName}
          </Text>
          <Text style={styles.mealSize} color="secondaryText">
            {`${meal.nutritionPreview?.servingQuantity} ${meal.nutritionPreview?.servingUnit}`}
            {' | '}
            {meal?.nutritionPreview?.calories + ' calories'}
          </Text>
        </View>
        <View style={styles.mealContainer}>
          <TouchableOpacity onPress={onAddFoodLogPress}>
            <Image style={styles.plusIcon} source={ICONS.newAddPlus} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default React.memo(MealLogItemView);
