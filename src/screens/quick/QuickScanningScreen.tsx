import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

import { DetectionCameraView } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import type { MealLabel } from '../../models';
import { QuickScanningActionView } from './views';

import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import ScanSVG from '../../components/svgs/scan';
import { useNavigation } from '@react-navigation/native';
import { BarcodeFoodScan } from './mode/barcode/BarcodeFoodScan';
import { ICONS } from '../../assets';
import { VisualFoodScan } from './mode/visual/VisualFoodScan';
import { useBranding } from '../../contexts';
import { NutritionFactScan } from './mode/nutritionFact/NutritionFactScan';
import { ShowToast } from '../../utils';
import { ProgressSlider } from '../../components';
import {
  PassioCameraZoomLevel,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3';

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
  const [level, setLevel] = useState<PassioCameraZoomLevel>();

  useEffect(() => {
    function init() {
      setTimeout(() => {
        PassioSDK.getMinMaxCameraZoomLevel().then((passioCameraZoomLevel) => {
          setLevel(passioCameraZoomLevel);
        });
      }, 300);
    }
    init();
  }, []);

  const renderMode = () => {
    return (
      <View
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
          marginTop: 16,
        }}
      >
        <TouchableOpacity
          style={[
            styles.iconsContainer,
            mode === 'Visual' && styles.iconsContainerSelected,
          ]}
          onPress={() => {
            setMode('Visual');
            ShowToast('Whole Food Mode');
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
            ShowToast('Barcode Mode');
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
            ShowToast('Nutrition Facts Mode');
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

  const renderZoomIndicator = () => {
    return (
      <View style={[styles.slider]}>
        <ProgressSlider
          sliderValue={1}
          minimumValue={level?.minZoomLevel ?? 0}
          sliderMaxValue={level?.maxZoomLevel ?? 1}
          step={0.1}
          minimumTrackTintColor={branding.primaryColor}
          maximumTrackTintColor={'white'}
          thumbTintColor={branding.primaryColor}
          onChangeSliderValue={function (val: number): void {
            PassioSDK.setCameraZoomLevel(val);
          }}
        />
      </View>
    );
  };
  const renderFocus = () => {
    return (
      <>
        {!info && (
          <View style={styles.scanIcon}>
            <ScanSVG />
          </View>
        )}
      </>
    );
  };
  return (
    <>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <QuickScanningActionView
            onClosedPressed={() => navigation.goBack()}
            onInfoPress={() => {
              setInfo((i) => !i);
            }}
          />
          <View style={{ flex: 1 }}>
            <DetectionCameraView
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              volumeDetectionMode="none"
            />
            {renderMode()}
            {renderFocus()}
            {level && renderZoomIndicator()}
          </View>
        </View>
      </View>

      {mode === 'Visual' && !info && <VisualFoodScan />}
      {mode === 'Barcode' && !info && (
        <BarcodeFoodScan
          onScanNutritionFacts={() => {
            setMode('NutritionFact');
          }}
        />
      )}
      {mode === 'NutritionFact' && !info && <NutritionFactScan />}
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
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    marginHorizontal: 16,
    justifyContent: 'center',
    bottom: 4,
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
