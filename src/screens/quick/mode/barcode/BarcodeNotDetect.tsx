import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { BasicButton, Card, Text } from '../../../../components';
import { ICONS } from '../../../../assets';
import { scaleHeight } from '../../../../utils';

interface Props {
  onTakePhoto?: () => void;
  onCancelPress?: () => void;
}

export const BarcodeNotDetect = ({ onTakePhoto, onCancelPress }: Props) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.contentContainer}>
          <Image source={ICONS.barcodeNotFound} style={styles.icon} />
          <Text weight="700" size="_20px" style={styles.title}>
            Barcode Missing Data
          </Text>
          <Text color="gray500" weight="400" style={styles.description}>
            Try taking photos of the nutrition facts label.
          </Text>
        </View>
        <View style={styles.buttonContainers}>
          <BasicButton
            onPress={onCancelPress}
            style={styles.button}
            small
            text={'Cancel'}
            secondary
          />
          <BasicButton
            onPress={onTakePhoto}
            style={styles.button}
            small
            text={'Take Photos'}
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: scaleHeight(16),
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    alignContent: 'center',

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

export default BarcodeNotDetect;
