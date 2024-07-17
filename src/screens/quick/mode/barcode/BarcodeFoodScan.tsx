import React, { useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { QuickScanningLoadingView, QuickScanningResultView } from '../../views';

import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { scaleHeight } from '../../../../utils';
import { Text } from '../../../../components';
import { useBranding } from '../../../../contexts';
import AlternateFoodLogView from '../../../../components/alternatives/alternativesItem';
import { QuickScanItemAddedToDiaryView } from '../../views/QuickSacnItemAddedToDiaryView';
import { QuickScanLogButtonView } from '../../views/QuickScanLogButtonView';
import { useBarcodeFoodScan } from './useBarcodeFoodScan';

export const BarcodeFoodScan = gestureHandlerRootHOC(() => {
  const {
    alternatives,
    info,
    isLodgedFood,
    isStopScan,
    passioQuickResults,
    onContinueScanningPress,
    onFoodSearchManuallyPress,
    onLogFoodPress,
    onOpenFoodLogEditor,
    onViewDiaryPress,
    resetScanning,
    setStopScan,
  } = useBarcodeFoodScan();

  const branding = useBranding();

  const snapPoints = useMemo(
    () => [scaleHeight(Platform.OS === 'android' ? 260 : 240)],
    []
  );

  return (
    <>
      {!isLodgedFood && !info && (
        <BottomSheet
          enablePanDownToClose={false}
          onClose={() => {}}
          index={isLodgedFood ? -1 : 0}
          enableDynamicSizing
          onChange={(index) => {
            if (alternatives && alternatives?.length > 0) {
              setStopScan(index === 1);
            }
          }}
          snapPoints={snapPoints}
          handleIndicatorStyle={{
            backgroundColor: branding.border,
          }}
          backgroundStyle={styles.bottomSheetChildrenContainer}
        >
          {passioQuickResults === null ? (
            <BottomSheetView>
              <QuickScanningLoadingView />
              <View style={{ height: 120, width: 100 }} />
            </BottomSheetView>
          ) : null}

          <>
            {passioQuickResults !== undefined && passioQuickResults !== null ? (
              <BottomSheetView>
                <Text weight="400" size="_14px" style={styles.pullTray}>
                  {!isStopScan && alternatives && alternatives?.length > 0
                    ? ' Pull tray up to see more options. '
                    : ''}
                </Text>
                <QuickScanningResultView
                  result={passioQuickResults}
                  onOpenFoodLogEditor={onOpenFoodLogEditor}
                  onClear={resetScanning}
                />
                <FlatList
                  data={alternatives ?? []}
                  style={{ maxHeight: Dimensions.get('window').height - 100 }}
                  bounces={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      testID="testAlternateFoodLogItem"
                      onPress={() => onOpenFoodLogEditor(item)}
                    >
                      <AlternateFoodLogView {...item} />
                    </TouchableOpacity>
                  )}
                />
                <View style={{ height: 140, width: 100 }} />
              </BottomSheetView>
            ) : null}
          </>
        </BottomSheet>
      )}

      {isLodgedFood === false && !info && passioQuickResults ? (
        <QuickScanLogButtonView
          onOpenFoodLogEditor={() => onOpenFoodLogEditor(passioQuickResults)}
          onSaveFoodLog={() => onLogFoodPress(passioQuickResults)}
          onFoodSearchManuallyPress={onFoodSearchManuallyPress}
        />
      ) : null}

      {isLodgedFood && (
        <QuickScanItemAddedToDiaryView
          onContinueScanningPress={onContinueScanningPress}
          onViewDiaryPress={onViewDiaryPress}
        />
      )}
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
  container: {},
});
