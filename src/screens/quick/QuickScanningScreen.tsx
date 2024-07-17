import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { DetectionCameraView } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import type { MealLabel } from '../../models';
import { QuickScanningActionView } from './views';

import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import ScanSVG from '../../components/svgs/scan';
import QuickScanInfo from './views/QuickScanInfo';
import { useNavigation } from '@react-navigation/native';
import { BarcodeFoodScan } from './mode/barcode/BarcodeFoodScan';
import { ICONS } from '../../assets';
import { VisualFoodScan } from './mode/visual/VisualFoodScan';
import { useBranding } from '../../contexts';
import { NutritionFactScan } from './mode/nutritionFact/NutritionFactScan';

export interface ScanningScreenProps {
  logToDate: Date | undefined;
  logToMeal: MealLabel | undefined;
}

export type ScanningScreenNavigationProps = StackNavigationProp<
  ParamList,
  'ScanningScreen'
>;

export type ScanningMode = 'Visual' | 'Barcode' | 'NutritionFact';

export const QuickScanningScreen = gestureHandlerRootHOC(() => {
  const [info, setInfo] = useState(false);
  const [mode, setMode] = useState<ScanningMode>('Visual');
  const navigation = useNavigation<ScanningScreenNavigationProps>();
  const branding = useBranding();

  const renderMode = () => {
    return (
      <View
        style={{
          position: 'absolute',
          top: 120,
          right: 0,
          left: 0,
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <TouchableOpacity
          style={[
            styles.iconsContainer,
            mode === 'Visual' && styles.iconsContainerSelected,
          ]}
          onPress={() => {
            setMode('Visual');
          }}
        >
          <Image
            tintColor={mode === 'Visual' ? branding.white : undefined}
            source={ICONS.modeVisual}
            resizeMode="contain"
            style={styles.icons}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconsContainer,
            mode === 'Barcode' && styles.iconsContainerSelected,
          ]}
          onPress={() => {
            setMode('Barcode');
          }}
        >
          <Image
            tintColor={mode === 'Barcode' ? branding.white : undefined}
            resizeMode="contain"
            source={ICONS.modeBarcode}
            style={styles.icons}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setMode('NutritionFact');
          }}
          style={[
            styles.iconsContainer,
            mode === 'NutritionFact' && styles.iconsContainerSelected,
          ]}
        >
          <Image
            tintColor={mode === 'NutritionFact' ? branding.white : undefined}
            resizeMode="contain"
            source={ICONS.modeNutritionFact}
            style={styles.icons}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DetectionCameraView style={styles.camera} />

      {!info && (
        <View style={styles.scanIcon}>
          <ScanSVG />
        </View>
      )}
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
        }}
      >
        {mode === 'Visual' && !info && <VisualFoodScan />}
        {mode === 'Barcode' && !info && <BarcodeFoodScan />}
        {mode === 'NutritionFact' && !info && <NutritionFactScan />}
      </View>
      <QuickScanningActionView
        onClosedPressed={() => navigation.goBack()}
        onInfoPress={() => {
          setInfo((i) => !i);
        }}
      />
      {info && <QuickScanInfo onOkPress={() => setInfo(false)} />}
      {renderMode()}
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
  icons: {
    height: 24,
    width: 24,
  },
  iconsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 8,
    borderRadius: 32,
    padding: 6,
  },
  iconsContainerSelected: {
    backgroundColor: 'rgba(79, 70, 229, 1)',
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
