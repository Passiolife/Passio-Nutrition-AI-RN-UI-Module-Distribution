import React from 'react';
import { Card, LinkText, Text } from '../../../components';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import type { FoodItem, PassioIconType } from '../../../models';
import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';
import type { PassioID } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { content } from '../../../constants/Content';
import { totalAmountOfNutrient } from '../utils';
import { scaleHeight, scaleWidth } from '../../../utils';
import DoughnutChart from '../../../components/doughnutChart/DoughnutChart';
import { useBranding } from '../../../contexts';

interface Props {
  foodItems: FoodItem[];
  passioID: PassioID;
  isOpenFood?: boolean;
  entityType: PassioIconType;
  name: string;
  imageName: string;
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
  qty,
  servingUnit,
  weight,
  entityType,
  onMoreDetailPress,
  imageName,
  rightIconForHeader,
  longName,
}: Props) => {
  const calories = totalAmountOfNutrient(foodItems, 'calories');
  const carbs = totalAmountOfNutrient(foodItems, 'carbs');
  const protein = totalAmountOfNutrient(foodItems, 'protein');
  const fat = totalAmountOfNutrient(foodItems, 'fat');
  const branding = useBranding();
  return (
    <Card style={styles.informationContainer}>
      <View style={styles.informationRow}>
        <View style={styles.imageContainer}>
          <PassioFoodIcon
            imageName={imageName}
            passioID={imageName}
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
          <Text
            weight="400"
            size="_14px"
            color="secondaryText"
            style={styles.logSize}
          >
            {longName ? longName : `${qty} ${servingUnit} (${weight}${'g'})`}
          </Text>
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
                progress: 50,
                color: branding.carbs,
              },
              {
                progress: 25,
                color: branding.proteins,
              },
              {
                progress: 25,
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
              {calories}
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
              {carbs} g
            </Text>
            <Text
              weight="400"
              size="_14px"
              color="secondaryText"
              style={styles.percentage}
            >
              (30%)
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
              {protein} g
            </Text>
            <Text
              weight="400"
              size="_14px"
              color="secondaryText"
              style={styles.percentage}
            >
              (30%)
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
              {fat} g
            </Text>
            <Text
              weight="400"
              size="_14px"
              color="secondaryText"
              style={styles.percentage}
            >
              (30%)
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
