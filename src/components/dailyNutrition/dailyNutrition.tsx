import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import type { FoodLog } from '../../models';
import { Card, MacrosProgressView, Text } from '..';
import styles from './styles';
import { ICONS } from '../../assets';
import { useDailyMacroNutrition } from '../../hooks/useDailyMacroNutrition';

export interface DailyNutritionProps {
  foodLogs?: FoodLog[];
}

export const DailyNutrition = ({ foodLogs }: DailyNutritionProps) => {
  const { dailyMacroNutrientAndCalories, nutritionTarget, onReportPress } =
    useDailyMacroNutrition(foodLogs ?? []);

  return (
    <Card style={styles.macroContainer}>
      <TouchableOpacity onPress={onReportPress}>
        <TouchableOpacity style={styles.macroTitleContainer}>
          <Image source={ICONS.apple} style={styles.headerBodyIcon} />
          <Text weight="600" size="_18px" style={styles.macroTitle}>
            Daily Nutrition
          </Text>
          <TouchableOpacity onPress={onReportPress}>
            <Image source={ICONS.chart} style={styles.headerBodyIcon} />
          </TouchableOpacity>
        </TouchableOpacity>
        <MacrosProgressView
          calories={{
            target: dailyMacroNutrientAndCalories?.amountOfCalories ?? 0,
            consumed: nutritionTarget?.targetCalories ?? 0,
          }}
          carbs={{
            target: dailyMacroNutrientAndCalories?.amountOfCarbs ?? 0,
            consumed: nutritionTarget?.targetCarbs ?? 0,
          }}
          protein={{
            target: dailyMacroNutrientAndCalories?.amountOfProtein ?? 0,
            consumed: nutritionTarget?.targetProtein ?? 0,
          }}
          fat={{
            target: dailyMacroNutrientAndCalories?.amountOfFat ?? 0,
            consumed: nutritionTarget?.targetFat ?? 0,
          }}
        />
      </TouchableOpacity>
    </Card>
  );
};

export default DailyNutrition;
