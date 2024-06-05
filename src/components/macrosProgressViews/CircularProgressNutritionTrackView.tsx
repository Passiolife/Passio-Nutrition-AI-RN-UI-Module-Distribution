import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { palette } from '../palette';
import { Text } from '../texts';
import DoughnutChart from '../doughnutChart/DoughnutChart';
const circleWidth = Dimensions.get('window').width / 4 - 24;

export const CircularProgressNutritionTrackView = ({
  record,
  total,
  stock,
  stock2,
  text,
  unit,
}: {
  record: number;
  total: number;
  stock: string;
  stock2: string;
  text: string;
  unit?: string;
}) => {
  const actualTotal = total;
  const actualRecord = record;
  const actualRemain = total - record;

  if (actualRemain < 0) {
    total = actualTotal * 2;
    record = record;
  }
  const remain = total - record;

  return (
    <>
      <View style={styles.progressContainerStyle}>
        <View style={styles.calorieContainer}>
          {remain <= 0 ? (
            <View
              style={{
                borderColor: actualRemain < 0 ? stock2 : stock,
                borderWidth: 6,
                width: circleWidth,
                height: circleWidth,
                borderRadius: circleWidth / 2,
              }}
            />
          ) : (
            <DoughnutChart
              data={[
                {
                  progress: record > 0 ? record : 1,
                  color: actualRemain < 0 ? stock2 : stock,
                },
                {
                  progress: remain > 0 ? remain : 1,
                  color: actualRemain < 0 ? stock : 'rgba(229, 231, 235, 1)',
                },
              ]}
              size={circleWidth}
              gap={0}
              strokeLinecap="square"
              strokeWidth={6}
            />
          )}
          <View style={styles.calorieItem}>
            <Text
              weight="700"
              color="text"
              testID="testNutrientCalories"
              style={styles.calorieItemValue}
            >
              {Math.round(actualRecord) + (unit ? ` ${unit}` : '')}
            </Text>
            <View style={styles.line} />
            <Text weight="500" color="text" style={styles.calorieItemTitle}>
              {Math.round(actualTotal)}
            </Text>
          </View>
        </View>

        <Text
          weight={'500'}
          size="_14px"
          color={'text'}
          style={styles.progressTextStyle}
        >
          {text}
        </Text>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  calorieContainer: {
    flexDirection: 'column',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  line: {
    height: 1,
    marginVertical: 2,
    width: circleWidth / 2,
    backgroundColor: palette.lightGray,
  },
  calorieItem: {
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'column',
  },
  calorieItemTitle: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  calorieItemValue: {
    fontSize: 12,
  },
  progressTextStyle: {
    marginTop: 5,
    textTransform: 'capitalize',
  },
  progressContainerStyle: {
    alignItems: 'center',
  },
});
