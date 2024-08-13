import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ProgressSlider } from '../../../components';
import { useBranding } from '../../../contexts';
import {
  PassioCameraZoomLevel,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { ICONS } from '../../../assets';
import type { ScanningMode } from '../QuickScanningScreen';

interface ZoomIndicatorProps {
  level: PassioCameraZoomLevel;
  mode: ScanningMode;
}

const ZoomIndicator: React.FC<ZoomIndicatorProps> = ({ level, mode }) => {
  const branding = useBranding();

  const [isEnableTorch, setEnableTorch] = useState(false);

  useEffect(() => {
    PassioSDK.enableFlashlight(isEnableTorch);
  }, [isEnableTorch]);

  useEffect(() => {
    setTimeout(() => {
      if (mode === 'Barcode') {
        PassioSDK.setCameraZoomLevel(2);
      } else {
        PassioSDK.setCameraZoomLevel(1);
      }
    }, 400);
  }, [mode]);

  const max =
    level?.maxZoomLevel && level.maxZoomLevel > 10 ? 10 : level.maxZoomLevel;

  return (
    <View style={styles.container}>
      <ProgressSlider
        sliderValue={mode === 'Barcode' ? 2 : 1}
        minimumValue={level?.minZoomLevel ?? 0}
        sliderMaxValue={max ?? 1}
        step={0.5}
        minimumTrackTintColor={branding.primaryColor}
        sliderStyle={{ flex: 1, marginHorizontal: 16 }}
        maximumTrackTintColor={'rgba(255, 255, 255, 0.3)'}
        thumbTintColor={branding.white}
        onChangeSliderValue={(val) => PassioSDK.setCameraZoomLevel(val)}
      />
      <TouchableOpacity
        onPress={() => {
          setEnableTorch(!isEnableTorch);
        }}
        style={[
          { padding: 4 },
          isEnableTorch && {
            backgroundColor: 'rgba(79, 70, 229, 1)',
            borderRadius: 16,
          },
        ]}
      >
        <Image source={ICONS.flash} style={styles.icon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    height: 24,
    width: 24,
  },
});

export default ZoomIndicator;
