import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '../../components/texts';
import SegmentProgressBar from '../../components/segmentProgressBars/SegmentProgressBar';

interface Props {
  weight: number;
  height: number;
}

/**
 *
 * @param weight : Accept in metric unit system
 * @param height: Accept in metric unit system
 * @constructor
 */
const CalculateBMI: React.FC<Props> = ({ weight, height }) => {
  const calculateBMI = () => {
    return parseFloat(((weight / Math.pow(height, 2)) * 10000).toFixed(1));
  };

  return (
    <View style={{ flex: 1 }}>
      <Text
        weight={'600'}
        size="_16px"
        color="text"
        style={styles.macroHeading}
      >
        {'Calculated BMI'}
      </Text>
      <View style={styles.containerSegment}>
        <SegmentProgressBar
          borderRadius={15}
          height={10}
          values={[0, 32.5, 42.5, 75, 100]}
          colors={[
            'rgba(39, 177, 255, 1)',
            'rgba(162, 228, 12, 1)',
            'rgba(241, 131, 0, 1)',
            'rgba(231, 34, 26, 1)',
          ]}
          labels={['underweight', 'normal', 'overweight', 'obese']}
          position={(calculateBMI() * 100) / 40}
          actualBMI={calculateBMI()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerSegment: {
    marginTop: 48,
  },
  macroHeading: {
    fontWeight: '700',
    textAlign: 'left',
  },
});

export default React.memo(CalculateBMI);
