import React from 'react';
import { StyleSheet, View } from 'react-native';
import { withLoading } from '../../../components/withLoading';
import { COLORS } from '../../../constants';

export interface SuggestionScreenProps {
  logToDate: Date | undefined;
}

const SuggestionScreen = () => {
  return (
    <>
      <View style={styles.bodyContainer} testID="myPlan.mealSuggestionView" />
    </>
  );
};
const styles = StyleSheet.create({
  bodyContainer: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  scrollViewStyle: {
    paddingHorizontal: 16,
    zIndex: 10,
  },
});

export default withLoading(SuggestionScreen);
