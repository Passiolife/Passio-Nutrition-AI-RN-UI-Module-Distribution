import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ProgressLoadingView } from '../../../components/loader';
import { Text } from '../../../components';
import { scaleHeight, scaleWidth } from '../../../utils';

export const QuickScanningLoadingView = () => {
  return (
    <View style={styles.container}>
      <View style={styles.loader}>
        <ProgressLoadingView />
      </View>
      <View>
        <Text weight="600" size="_15px">
          Scanning...
        </Text>
        <Text weight="400" size="_14px">
          Place your food within the frame
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: scaleHeight(16),
  },
  loader: {
    marginStart: scaleWidth(24),
    marginEnd: scaleWidth(16),
  },
});
