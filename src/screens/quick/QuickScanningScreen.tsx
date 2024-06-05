import React, { useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import { DetectionCameraView } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import type { MealLabel } from '../../models';
import {
  QuickScanningActionView,
  QuickScanningLoadingView,
  QuickScanningResultView,
} from './views';

import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';
import { useQuickScan } from './useQuickScan';
import NutritionFactView from './views/NutritionFactView';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { scaleHeight } from '../../utils';
import { Text } from '../../components';
import ScanSVG from '../../components/svgs/scan';
import { useBranding } from '../../contexts';
import AlternateFoodLogView from '../../components/alternatives/alternativesItem';
import { QuickScanItemAddedToDiaryView } from './views/QuickSacnItemAddedToDiaryView';
import { QuickScanLogButtonView } from './views/QuickScanLogButtonView';
import QuickScanInfo from './views/QuickScanInfo';

export interface ScanningScreenProps {
  logToDate: Date | undefined;
  logToMeal: MealLabel | undefined;
}

export type ScanningScreenNavigationProps = StackNavigationProp<
  ParamList,
  'ScanningScreen'
>;

export const QuickScanningScreen = gestureHandlerRootHOC(() => {
  const {
    alternatives,
    info,
    isLodgedFood,
    isStopScan,
    nutritionFacts,
    passioQuickResults,
    onClosed,
    onContinueScanningPress,
    onFoodSearchManuallyPress,
    onLogFoodPress,
    onOpenFoodLogEditor,
    onSaveFoodLogUsingNutrientFact,
    onUpdatingNutritionFacFlag,
    onViewDiaryPress,
    resetScanning,
    setInfo,
    setStopScan,
  } = useQuickScan();

  const branding = useBranding();

  const snapPoints = useMemo(
    () => [scaleHeight(Platform.OS === 'android' ? 260 : 240)],
    []
  );

  return (
    <View style={styles.container}>
      <DetectionCameraView style={styles.camera} />
      <TouchableOpacity style={styles.touchAreaStyle} activeOpacity={1} />
      {!info && (
        <View style={styles.scanIcon}>
          <ScanSVG />
        </View>
      )}
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
            backgroundColor: nutritionFacts ? 'white' : branding.border,
          }}
          backgroundStyle={styles.bottomSheetChildrenContainer}
        >
          {passioQuickResults === null && nutritionFacts === null ? (
            <BottomSheetView>
              <QuickScanningLoadingView />
              <View style={{ height: 120, width: 100 }} />
            </BottomSheetView>
          ) : null}

          {nutritionFacts !== null ? (
            <NutritionFactView
              nutritionFact={nutritionFacts}
              onCancel={() => resetScanning()}
              onPreventToUpdatingNutritionFact={onUpdatingNutritionFacFlag}
              onNext={onSaveFoodLogUsingNutrientFact}
            />
          ) : (
            <>
              {passioQuickResults !== undefined &&
              passioQuickResults !== null ? (
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
          )}
        </BottomSheet>
      )}

      {isLodgedFood === false &&
      !info &&
      nutritionFacts === null &&
      passioQuickResults ? (
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
      <QuickScanningActionView
        onClosedPressed={onClosed}
        onInfoPress={() => {
          setInfo((i) => !i);
        }}
      />
      {info && <QuickScanInfo onOkPress={() => setInfo(false)} />}
    </View>
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
