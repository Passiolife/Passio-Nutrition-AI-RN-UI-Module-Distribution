import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Text } from '../../../components';
import { screenHeight, screenWidth } from '../../../utils';
interface Props {}

export const BarcodeLoading = ({}: Props) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.contentContainer}>
          <Text weight="500" size="_14px" color="white" style={styles.title}>
            Scanning...
          </Text>
          <Text color="white" weight="400" style={styles.description}>
            Place your barcode within the frame
          </Text>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: screenHeight - 250,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    width: screenWidth - 16,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    alignContent: 'center',
    backgroundColor: 'rgba(107, 114, 128, 0.75)',
    alignSelf: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 32,
    width: 32,
    marginVertical: 8,
  },
  title: {
    marginVertical: 3,
    textAlign: 'center',
  },
  description: {
    marginBottom: 16,
    marginVertical: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonContainers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-around',
    marginVertical: 16,
  },
  iconContainer: {
    alignItems: 'center',
    flex: 1,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default BarcodeLoading;
