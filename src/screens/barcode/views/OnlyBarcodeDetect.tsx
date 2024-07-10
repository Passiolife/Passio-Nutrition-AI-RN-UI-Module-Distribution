import React from 'react';
import { Image, Modal, StyleSheet, View } from 'react-native';

import { BasicButton, Card, Text } from '../../../components';
import { ICONS } from '../../../assets';
interface Props {
  onCreateCustomWithoutBarcodePress?: () => void;
  onCancelPress?: () => void;
  onViewExistingPress?: () => void;
}

export const OnlyBarcodeDetect = ({
  onCreateCustomWithoutBarcodePress,
}: Props) => {
  return (
    <Modal visible={true} transparent>
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.contentContainer}>
            <Image source={ICONS.defaultBarcode} style={styles.icon} />
            <Text weight="700" size="_20px" style={styles.title}>
              Barcode In System
            </Text>
            <Text color="gray500" weight="400" style={styles.description}>
              This barcode doesn't matches an existing item
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <BasicButton
              onPress={onCreateCustomWithoutBarcodePress}
              style={styles.button}
              small
              text={'Create Custom Food Without Barcode'}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    flex: 1,
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
