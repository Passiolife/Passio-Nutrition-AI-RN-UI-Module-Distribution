import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { COLORS } from '../../../../constants';

const RecipeMacroView = ({
  title,
  value,
}: {
  title: string;
  value: number;
}) => {
  return (
    <View style={styles.ingredientStyle}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.valueText}>{value.toFixed(0)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ingredientStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 12,
  },
  titleText: {
    fontWeight: '600',
    fontSize: 15,
    color: COLORS.grey7,
  },
  valueText: {
    fontWeight: '400',
    fontSize: 15,
    color: COLORS.grey7,
  },
});

export default RecipeMacroView;
