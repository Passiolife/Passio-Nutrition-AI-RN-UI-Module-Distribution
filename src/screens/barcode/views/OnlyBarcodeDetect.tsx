import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { BasicButton, Card, Text } from '../../../components';
import { ICONS } from '../../../assets';
import type { QuickResult } from '../../../models';
interface Props {
  onCancelPress?: () => void;
  onBarcodePress?: () => void;
  barcode?: string;
  quickResult: QuickResult;
}

export const OnlyBarcodeDetect = ({
  onCancelPress,
  onBarcodePress,
  barcode,
}: Props) => {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <View style={styles.contentContainer}>
          <Image source={ICONS.barcode} style={styles.icon} />
          <Text weight="700" size="_20px" style={styles.title}>
            {barcode}
          </Text>
          <Text color="gray500" weight="400" style={styles.description}>
            This barcode doesn't matches an in existing database
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
            onPress={onBarcodePress}
            style={styles.button}
            small
            text={'Continue with Barcode'}
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    flex: 1,
    left: 0,
    right: 0,
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

export default OnlyBarcodeDetect;
