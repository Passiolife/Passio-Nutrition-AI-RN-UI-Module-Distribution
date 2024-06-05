import React from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { Text, type TextColor } from '../../components';

interface Props {
  label: string;
  valuePercentage: string;
  valueGrams: string;
  unit: string;
  style?: StyleProp<ViewStyle>;
  color: TextColor;
}

export const EditMacroView: React.FC<Props> = ({
  label,
  valuePercentage,
  unit,
  color,
  valueGrams,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text weight="600" size="_14px" style={styles.label}>
        {label + ': '}
      </Text>
      <View style={styles.valueContainer}>
        <Text weight="600" color={color} style={styles.valueGrams}>
          {Math.round(Number(valueGrams)) + ' '}
          {unit + ' '}
        </Text>
        <Text weight="500" color="secondaryText" style={styles.valuePercentage}>
          ({valuePercentage}%)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 4,
  },
  label: {
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valuePercentage: {
    marginRight: 4,
  },
  valueGrams: {},
});
