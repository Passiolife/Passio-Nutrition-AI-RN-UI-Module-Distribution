import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { DetectionCameraView } from '@passiolife/nutritionai-react-native-sdk-v3';
import { QuickScanningActionView } from './views';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import ScanSVG from '../../components/svgs/scan';
import { BarcodeFoodScan } from './mode/barcode/BarcodeFoodScan';
import { VisualFoodScan } from './mode/visual/VisualFoodScan';
import { NutritionFactScan } from './mode/nutritionFact/NutritionFactScan';
import {
  PassioSDK,
  PassioCameraZoomLevel,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import ZoomIndicator from './views/ZoomIndicator';
import type { MealLabel } from '../../models';
import QuickScanInfo from './views/QuickScanInfo';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';
import type { ScreenNavigationProps } from '../myFoods/useMyFoodScreen';

export interface ScanningScreenProps {
  logToDate: Date | undefined;
  logToMeal: MealLabel | undefined;
}

export type ScanningMode = 'Visual' | 'Barcode' | 'NutritionFact';

export type ScanningScreenNavigationProps = StackNavigationProp<
  ParamList,
  'ScanningScreen'
>;

export const QuickScanningScreen = gestureHandlerRootHOC(() => {
  const [info, setInfo] = useState(false);
  const [mode] = useState<ScanningMode>('Barcode');
  const navigation = useNavigation<ScreenNavigationProps>();
  const [level, setLevel] = useState<PassioCameraZoomLevel>();

  const isFocused = useIsFocused();

  useEffect(() => {
    const init = async () => {
      const passioCameraZoomLevel = await PassioSDK.getMinMaxCameraZoomLevel();
      setLevel(passioCameraZoomLevel);
    };
    setTimeout(init, 300);
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <QuickScanningActionView
          onClosedPressed={() => navigation.goBack()}
          onInfoPress={() => setInfo((i) => !i)}
        />
        <View style={{ flex: 1 }}>
          {isFocused ? (
            <DetectionCameraView
              style={styles.cameraView}
              volumeDetectionMode="none"
            />
          ) : (
            <View style={styles.cameraView} />
          )}
          {/* {!info && <ScanningModeSelector mode={mode} setMode={setMode} />} */}
          {!info && <ScanSVG />}
          {!info && level && <ZoomIndicator mode={mode} level={level} />}
          {info && <QuickScanInfo onOkPress={() => setInfo(false)} />}
        </View>
      </View>
      {mode === 'Visual' && !info && <VisualFoodScan />}
      {mode === 'Barcode' && !info && <BarcodeFoodScan />}
      {mode === 'NutritionFact' && !info && <NutritionFactScan />}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
  },
  scanIcon: {
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
