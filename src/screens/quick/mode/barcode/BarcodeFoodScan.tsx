import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { QuickScanningLoadingView, QuickScanningResultView } from '../../views';

import { scaleWidth, screenHeight } from '../../../../utils';
import { ItemAddedToDairyViewModal, Text } from '../../../../components';
import { QuickScanLogButtonView } from '../../views/QuickScanLogButtonView';
import { useBarcodeFoodScan } from './useBarcodeFoodScan';
import { BarcodeNotDetect } from './BarcodeNotDetect';

interface Props {}
export const BarcodeFoodScan = ({}: Props) => {
  const {
    isLodgedFood,
    itemAddedToDairyViewModalRef,
    passioQuickResults,
    onContinueScanningPress,
    onFoodSearchManuallyPress,
    onLogFoodPress,
    onOpenFoodLogEditor,
    onViewDiaryPress,
    resetScanning,
    onTakePhoto,
  } = useBarcodeFoodScan();

  const info = false;

  if (passioQuickResults && passioQuickResults.passioIDAttributes == null) {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          right: 0,
          top: screenHeight / 3.5,
        }}
      >
        <BarcodeNotDetect
          onTakePhoto={onTakePhoto}
          onCancelPress={resetScanning}
        />
      </View>
    );
  }

  return (
    <>
      {!isLodgedFood && !info && (
        <View style={styles.bottomSheetChildrenContainer}>
          {passioQuickResults === null ? (
            <>
              <QuickScanningLoadingView text="Place your barcode within the frame." />
              <TouchableOpacity
                onPress={onTakePhoto}
                style={{ alignItems: 'center', padding: 16, marginTop: 16 }}
              >
                <Text>
                  No barcode? Take a picture of{' '}
                  <Text weight="600" color="primaryColor">
                    Nutrition Facts
                  </Text>
                </Text>
              </TouchableOpacity>
              <View style={{ height: 39, width: 100 }} />
            </>
          ) : null}

          {passioQuickResults !== undefined && passioQuickResults !== null ? (
            <>
              <QuickScanningResultView
                result={passioQuickResults}
                onOpenFoodLogEditor={onOpenFoodLogEditor}
                onFoodLog={onLogFoodPress}
                onClear={resetScanning}
              />
              {isLodgedFood === false && !info && passioQuickResults ? (
                <QuickScanLogButtonView
                  onOpenFoodLogEditor={() =>
                    onOpenFoodLogEditor(passioQuickResults)
                  }
                  onSaveFoodLog={() => onLogFoodPress(passioQuickResults)}
                  onFoodSearchManuallyPress={onFoodSearchManuallyPress}
                  hideSearch
                />
              ) : null}
            </>
          ) : null}
        </View>
      )}

      <ItemAddedToDairyViewModal
        onContinuePress={onContinueScanningPress}
        ref={itemAddedToDairyViewModalRef}
        onViewDiaryPress={onViewDiaryPress}
        action="Add More"
        note="View your diary or add more"
      />
    </>
  );
};

const styles = StyleSheet.create({
  bottomSheetChildrenContainer: {
    backgroundColor: 'white',
    borderTopEndRadius: scaleWidth(16),
    borderTopLeftRadius: scaleWidth(16),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
