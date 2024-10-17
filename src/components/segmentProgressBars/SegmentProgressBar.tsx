import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ICONS } from '../../assets';
import { COLORS } from '../../constants';
import { Text } from '../texts';

interface Props {
  labels: Array<string>;
  values: Array<number>;
  colors: Array<string>;
  height: number;
  borderRadius: number;
  position: number | null;
  actualBMI: number | null;
}

const SegmentProgressBar = ({
  labels,
  values,
  colors,
  height,
  borderRadius,
  position = 0,
  actualBMI = 0,
}: Props) => {
  const sectionsPercentage: Array<number> = [];
  const finalValue = values[values.length - 1] ?? 0;
  const adjustedFinalValue = finalValue - (values?.at?.(0) ?? 0);

  values.forEach(
    (v, i) =>
      i < values.length - 1 &&
      adjustedFinalValue !== 0 &&
      sectionsPercentage.push(
        (100 * (values[i + 1] ?? 0 - v)) / adjustedFinalValue
      )
  );

  let circleValue = position;
  const paddingWithLabel = 10;

  let bmi = actualBMI ?? 0;
  let progress = 0;
  let color = colors[0];

  //values={[0, 42.5, 62.5, 75, 100]}

  if (bmi <= 0) {
  } else if (bmi < 18.5) {
    progress = (bmi * 32.5) / 18.5;
    color = colors[0];
  } else if (bmi >= 18.5 && bmi < 25) {
    color = colors[1];
    progress = (bmi * 42.5) / 25;
  } else if (bmi >= 25 && bmi < 30) {
    color = colors[2];
    progress = (bmi * 62.5) / 30;
  } else if (bmi >= 30 && bmi < 40) {
    color = colors[3];
    progress = (bmi * 100) / 40;
  } else if (bmi > 40) {
    color = colors[3];
    progress = 100;
  }

  return (
    <>
      <View style={{ paddingVertical: paddingWithLabel }}>
        <View
          style={[
            styles.chartContainer,
            { height, borderRadius: borderRadius || height / 2 },
          ]}
        >
          <LinearGradient
            colors={colors}
            style={styles.linearGradient}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            locations={[0.175, 0.4, 0.8, 1]}
          />
        </View>
        {circleValue === null && (
          <Text style={styles.errorText}>Out of range...</Text>
        )}
        {!!circleValue && (
          <View
            style={[
              styles.pointerContainer,
              styles.markerStyle,
              {
                left: `${progress > 100 ? 100 : progress - 8}%`,
              },
            ]}
          >
            <View style={[styles.pointerTextContainer]}>
              <Text style={styles.pointerTextStyle}>{actualBMI}</Text>
            </View>
            <Image
              source={ICONS.calculatedBMIDown}
              style={[styles.icon, { tintColor: color }]}
            />
          </View>
        )}
      </View>
      {!!labels && (
        <View style={styles.labelTextContainer}>
          {sectionsPercentage.map((_w, i) => (
            <Text
              weight="500"
              size="_12px"
              key={i}
              children={labels[i]}
              style={[
                styles.labelTextStyle,
                {
                  flex: 1,
                },
              ]}
            />
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  chartContainer: { overflow: 'hidden', flexDirection: 'row' },
  linearGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    width: '100%',
  },
  markerStyle: {
    width: 50,
    height: 50,
  },
  errorText: {
    color: COLORS.red,
  },
  pointerContainer: {
    position: 'absolute',
    bottom: 20,
  },
  pointerTextContainer: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: 'rgba(209, 250, 229, 1)',
  },
  pointerTextStyle: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '700',
    color: 'rgba(6, 95, 70, 1)',
  },
  labelTextContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  icon: {
    width: 24,
    height: 18,
    top: 4,
    alignItems: 'center',
    alignSelf: 'center',
  },
  labelTextStyle: {
    textAlign: 'center',
  },
});
export default SegmentProgressBar;
