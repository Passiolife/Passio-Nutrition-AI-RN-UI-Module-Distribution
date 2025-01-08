import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import type { FoodLog } from '../../models';
import { Card, MacrosProgressView, Text } from '..';
import { ICONS } from '../../assets';
import { useDailyMacroNutrition } from '../../hooks/useDailyMacroNutrition';
import { stylesObj } from './styles';
import { useBranding } from '../../contexts';

export interface DailyNutritionProps {
  foodLogs?: FoodLog[];
}

export const DailyNutrition = ({ foodLogs }: DailyNutritionProps) => {
  const { dailyMacroNutrientAndCalories, nutritionTarget, onReportPress } =
    useDailyMacroNutrition(foodLogs ?? []);
  const branding = useBranding();

  const styles = stylesObj(branding);
  return (
    <Card style={styles.macroContainer}>
      <TouchableOpacity onPress={onReportPress}>
        <TouchableOpacity style={styles.macroTitleContainer}>
          <Image
            source={ICONS.apple}
            style={[styles.headerBodyIcon, styles.iconColor]}
          />
          <Text weight="600" size="title" style={styles.macroTitle}>
            Daily Nutrition
          </Text>
          <TouchableOpacity onPress={onReportPress}>
            <Image source={ICONS.chart} style={styles.headerBodyIcon} />
          </TouchableOpacity>
        </TouchableOpacity>
        <MacrosProgressView
          calories={{
            consumes: dailyMacroNutrientAndCalories?.amountOfCalories ?? 0,
            targeted: nutritionTarget?.targetCalories ?? 0,
          }}
          carbs={{
            consumes: dailyMacroNutrientAndCalories?.amountOfCarbs ?? 0,
            targeted: nutritionTarget?.targetCarbs ?? 0,
          }}
          protein={{
            consumes: dailyMacroNutrientAndCalories?.amountOfProtein ?? 0,
            targeted: nutritionTarget?.targetProtein ?? 0,
          }}
          fat={{
            consumes: dailyMacroNutrientAndCalories?.amountOfFat ?? 0,
            targeted: nutritionTarget?.targetFat ?? 0,
          }}
        />
      </TouchableOpacity>
    </Card>
  );
};

export default DailyNutrition;
