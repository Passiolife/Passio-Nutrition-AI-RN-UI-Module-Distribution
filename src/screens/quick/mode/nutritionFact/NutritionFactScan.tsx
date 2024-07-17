import React, { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { QuickScanningLoadingView } from './../../views';

import NutritionFactView from './../../views/NutritionFactView';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { scaleHeight } from '../../../../utils';
import { useBranding } from '../../../../contexts';
import { useNutritionFactScan } from './useNutritionFactScan';

export const NutritionFactScan = gestureHandlerRootHOC(() => {
  const {
    nutritionFacts,
    onSaveFoodLogUsingNutrientFact,
    onUpdatingNutritionFacFlag,
    resetScanning,
  } = useNutritionFactScan();

  const branding = useBranding();

  const snapPoints = useMemo(
    () => [scaleHeight(Platform.OS === 'android' ? 260 : 240)],
    []
  );

  return (
    <>
      <BottomSheet
        enablePanDownToClose={false}
        onClose={() => {}}
        index={0}
        enableDynamicSizing
        snapPoints={snapPoints}
        handleIndicatorStyle={{
          backgroundColor: nutritionFacts ? 'white' : branding.border,
        }}
        backgroundStyle={styles.bottomSheetChildrenContainer}
      >
        {nutritionFacts === null ? (
          <BottomSheetView>
            <QuickScanningLoadingView text="Place the nutrition facts within the frame." />

            <View style={{ height: 120, width: 100 }} />
          </BottomSheetView>
        ) : null}

        {nutritionFacts !== null && (
          <NutritionFactView
            nutritionFact={nutritionFacts}
            onCancel={() => resetScanning()}
            onPreventToUpdatingNutritionFact={onUpdatingNutritionFacFlag}
            onNext={onSaveFoodLogUsingNutrientFact}
          />
        )}
      </BottomSheet>
    </>
  );
});

const styles = StyleSheet.create({
  touchAreaStyle: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  scanIcon: {
    position: 'absolute',
    top: 0,
    bottom: 50,
    right: 0,
    left: 0,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSheetChildrenContainer: {
    flex: 1,
  },
  pullTray: {
    alignSelf: 'center',
  },
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
