import React from 'react';
import { Image, Modal, StyleSheet, View } from 'react-native';

import { BasicButton, Card, Text } from '../../../components';
import { ICONS } from '../../../assets';
interface Props {
  onOkPress?: () => void;
}

export const QuickScanInfo = ({ onOkPress }: Props) => {
  const renderIcon = (title: string, icon: number) => {
    return (
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} />
        <Text size={'_12px'} style={styles.description}>
          {title}
        </Text>
      </View>
    );
  };

  return (
    <Modal visible={true} transparent>
      <View style={styles.container}>
        <Card style={styles.card}>
          <View style={styles.contentContainer}>
            <Text weight="700" size="_20px" style={styles.title}>
              What you can scan
            </Text>
            <Text style={styles.description}>
              You can scan your foods using a variety of ways:
            </Text>
          </View>
          <View style={styles.iconInfoContainer}>
            {renderIcon('Foods', ICONS.foodScannerFoods)}
            {renderIcon('Beverages', ICONS.foodScannerBeverage)}
            {renderIcon('Packaging', ICONS.foodScannerPackaging)}
            {renderIcon('Nutrition Facts', ICONS.foodScannerFacts)}
            {renderIcon('Barcodes', ICONS.foodScannerBarcode)}
          </View>
          <View style={styles.buttonContainer}>
            <BasicButton
              onPress={onOkPress}
              style={styles.button}
              text={'Ok'}
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
    fontSize: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  iconInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-around',
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

export default QuickScanInfo;
