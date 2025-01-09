import React from 'react';
import { StyleSheet, View } from 'react-native';

import { DetectionCameraView } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';

import { useBarcodeScan } from './useBarcodeScan';
import BarcodeDetect from './views/BarcodeDetect';
import CustomFoodBarcodeDetect from './views/CustomFoodBarcodeDetect';
import BarcodeLoading from './views/BarcodeLoading';
import { BackNavigation } from '../../components';

export const BarcodeScanScreen = () => {
  const {
    isLoading,
    quickResult,
    type,
    resetScanning,
    onCreateCustomWithoutBarcodePress,
    params,
    onViewExistingPress,
  } = useBarcodeScan();

  return (
    <View style={styles.container}>
      {type === 'general' ? (
        <BackNavigation
          title="Photo Logging"
          onBackArrowPress={() => {
            params?.onClose?.();
          }}
        />
      ) : (
        <BackNavigation title="Food Creator" />
      )}

      <DetectionCameraView style={styles.camera} />
      {quickResult && quickResult.customFood && (
        <CustomFoodBarcodeDetect
          onCancelPress={resetScanning}
          onCreateCustomWithoutBarcodePress={onCreateCustomWithoutBarcodePress}
          onViewExistingPress={onViewExistingPress}
        />
      )}
      {quickResult &&
        quickResult.customFood == null &&
        quickResult.passioIDAttributes && (
          <BarcodeDetect
            onCancelPress={resetScanning}
            onCreateCustomWithoutBarcodePress={
              onCreateCustomWithoutBarcodePress
            }
            onViewExistingPress={onViewExistingPress}
          />
        )}
      {isLoading && <BarcodeLoading />}
    </View>
  );
};

const styles = StyleSheet.create({
  camera: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
  },
});
