import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../../constants';

const RecipeEmptyView = () => {
  return (
    <View style={styles.emptyViewContainer}>
      <Text style={styles.textTitle}>No recipes found</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    color: COLORS.grey7,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 8,
  },
});

export default RecipeEmptyView;
