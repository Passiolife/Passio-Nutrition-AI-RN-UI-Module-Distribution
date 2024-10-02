import React from 'react';
import { StyleSheet, View } from 'react-native';
import type { FoodLog } from '../../models';
import { Card, Text } from '../../components';
import { COLORS } from '../../constants';
import { PassioFoodIcon } from '../../components/passio/PassioFoodIcon';

interface Props {
  foodLog: FoodLog;
}

const FoodInfo = (props: Props) => {
  const { foodLog } = props;

  return (
    <Card style={styles.touchContainer}>
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
        {foodLog?.foodItems?.[0].barcode && foodLog?.foodItems.length === 1 && (
          <Text
            weight="400"
            size="secondlyTitle"
            color="secondaryText"
            style={styles.mealSize}
          >
            {'UPC: ' + foodLog.foodItems[0]?.barcode}
          </Text>
        )}
      </View>
    </Card>
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  mealDetail: {
    marginHorizontal: 10,
    alignSelf: 'center',
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

export default React.memo(FoodInfo);
