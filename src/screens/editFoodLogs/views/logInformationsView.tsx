import React from 'react';
import { Card, LinkText, Text } from '../../../components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import type { FoodItem, PassioIconType } from '../../../models';
import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';
import { content } from '../../../constants/Content';
import { totalAmountOfNutrientWithoutRound } from '../utils';
import { scaleHeight, scaleWidth } from '../../../utils';
import DoughnutChart from '../../../components/doughnutChart/DoughnutChart';
import { useBranding } from '../../../contexts';
import { macroNutrientPercentages } from '../../../utils/V3Utils';

interface Props {
  foodItems: FoodItem[];
  isOpenFood?: boolean;
  entityType?: PassioIconType;
  name: string;
  iconID?: string;
  qty: number;
  servingUnit: string;
  longName?: string;
  weight: number;
  rightIconForHeader?: JSX.Element;
  onMoreDetailPress?: () => void;
}

const LogInformationView = ({
  foodItems,
  name,
  isOpenFood,
  iconID,
  entityType,
  onMoreDetailPress,
  rightIconForHeader,
  longName,
}: Props) => {
  const calories = totalAmountOfNutrientWithoutRound(foodItems, 'calories');
  const carbs = totalAmountOfNutrientWithoutRound(foodItems, 'carbs');
  const protein = totalAmountOfNutrientWithoutRound(foodItems, 'protein');
  const fat = totalAmountOfNutrientWithoutRound(foodItems, 'fat');
  const branding = useBranding();
  const { carbsPercentage, fatPercentage, proteinPercentage } =
    macroNutrientPercentages(carbs, fat, protein);
  return (
    <Card style={styles.informationContainer}>
      <View style={styles.informationRow}>
        <View style={styles.imageContainer}>
          <PassioFoodIcon
            iconID={iconID}
            style={styles.image}
            entityType={entityType}
          />
        </View>
        <View style={styles.informationContent}>
          <Text
            weight="600"
            color="text"
            numberOfLines={2}
            ellipsizeMode="tail"
            style={styles.logName}
          >
            {name}
          </Text>
          {longName && (
            <Text
              weight="400"
              size="_14px"
              color="secondaryText"
              style={styles.logSize}
            >
              {longName}
            </Text>
          )}
        </View>
        {rightIconForHeader ? (
          <View style={styles.rightIconView}>
            <TouchableOpacity>{rightIconForHeader}</TouchableOpacity>
          </View>
        ) : null}
      </View>
      <View style={styles.nutrients}>
        <View style={styles.calorieContainer}>
          <DoughnutChart
            data={[
              {
                progress: carbsPercentage,
                color: branding.carbs,
              },
              {
                progress: proteinPercentage,
                color: branding.proteins,
              },
              {
                progress: fatPercentage,
                color: branding.fat,
              },
            ]}
            size={100}
            gap={12}
          />
          <View style={styles.calorieItem}>
            <Text
              weight="700"
              size="_20px"
              color="calories"
              testID="testNutrientCalories"
              style={styles.calorieItemValue}
            >
              {Math.round(calories)}
            </Text>
            <Text
              weight="500"
              size="_14px"
              color="text"
              style={styles.calorieItemTitle}
            >
              {content.calories}
            </Text>
          </View>
        </View>
        <View style={styles.otherNutrientContainer}>
          <View style={styles.otherNutrientItem}>
            <Text
              weight="500"
              size="_14px"
              color="text"
              style={styles.otherNutrientTitle}
            >
              {content.carbs + ': '}
            </Text>
            <Text
              weight="700"
              size="_14px"
              color="carbs"
              testID="testNutrientCarbs"
              style={styles.otherNutrientTValue}
            >
              {carbs.toFixed(1)} g
            </Text>
            <Text
              weight="400"
              size="_14px"
              color="secondaryText"
              style={styles.percentage}
            >
              {`(${carbsPercentage.toFixed(1)}%)`}
            </Text>
          </View>
          <View style={styles.otherNutrientItem}>
            <Text
              weight="500"
              size="_14px"
              color="text"
              style={styles.otherNutrientTitle}
            >
              {content.protein + ': '}
            </Text>
            <Text
              weight="700"
              size="_14px"
              color="proteins"
              testID="testNutrientProtein"
              style={styles.otherNutrientTValue}
            >
              {protein.toFixed(1)} g
            </Text>
            <Text
              weight="400"
              size="_14px"
              color="secondaryText"
              style={styles.percentage}
            >
              {`(${proteinPercentage.toFixed(1)}%)`}
            </Text>
          </View>
          <View style={styles.otherNutrientItem}>
            <Text
              weight="500"
              size="_14px"
              color="text"
              style={styles.otherNutrientTitle}
            >
              {content.fat + ': '}
            </Text>

            <Text
              weight="700"
              size="_14px"
              color="fat"
              testID="testNutrientFat"
              style={styles.otherNutrientTValue}
            >
              {fat.toFixed(1)} g
            </Text>
            <Text
              weight="400"
              size="_14px"
              color="secondaryText"
              style={styles.percentage}
            >
              {`(${fatPercentage.toFixed(1)}%)`}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.cardFooterView}>
        <LinkText isLink>{isOpenFood ? 'Open Food Facts' : ''}</LinkText>
        <LinkText onPress={onMoreDetailPress} isLink>
          More Details
        </LinkText>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  informationContainer: {
    paddingVertical: scaleHeight(12),
    paddingHorizontal: scaleHeight(13),
    marginTop: scaleHeight(16),
    paddingBottom: 20,
  },
  informationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 50,
    borderRadius: 24,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    width: 50,
    height: 50,
  },
  informationContent: {
    flex: 1,
    marginLeft: 10,
  },
  logName: {
    lineHeight: 24,
    textTransform: 'capitalize',
  },
  logSize: {
    lineHeight: 16,
    textTransform: 'capitalize',
    marginTop: 2,
  },
  calorieContainer: {
    flexDirection: 'column',
    marginTop: 15,
    justifyContent: 'center',
  },
  otherNutrientContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginTop: 15,
  },
  nutrients: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  calorieItem: {
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'column',
  },
  otherNutrientItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  calorieItemTitle: {
    lineHeight: 16,
    marginVertical: scaleHeight(4),
    textTransform: 'capitalize',
  },
  otherNutrientTitle: {
    lineHeight: 16,
    textTransform: 'capitalize',
  },
  calorieItemValue: {
    lineHeight: 29,
  },
  otherNutrientTValue: {
    lineHeight: 29,
  },
  percentage: {
    lineHeight: 29,
    marginStart: scaleWidth(4),
  },
  chevDownTouchStyle: {
    width: 22,
    marginHorizontal: 16,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  chevDown: {
    width: 24,
    height: 24,
  },
  rightIconView: {
    justifyContent: 'flex-start',
    height: '100%',
    marginLeft: scaleWidth(2),
  },
  cardFooterView: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: scaleHeight(15),
  },
});

export default React.memo(LogInformationView);
