import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ProgressLoadingView } from '../../../components/loader';
import { Card, Text } from '../../../components';
import { scaleHeight, scaleWidth } from '../../../utils';

interface Props {
  text?: string;
}
export const QuickScanningLoadingView = ({
  text = 'Place your food within the frame',
}: Props) => {
  return (
    <Card style={styles.container}>
      <View style={styles.loader}>
        <ProgressLoadingView />
      </View>
      <View style={{ flex: 1 }}>
        <Text weight="600" size="_15px">
          Scanning...
        </Text>
        <Text weight="400" size="_14px">
          {text}
        </Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: scaleHeight(16),
    paddingVertical: 16,
    marginHorizontal: 24,
  },
  loader: {
    marginStart: scaleWidth(24),
    marginEnd: scaleWidth(16),
  },
});
