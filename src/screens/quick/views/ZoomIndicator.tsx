import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressSlider } from '../../../components';
import { useBranding } from '../../../contexts';
import {
  PassioCameraZoomLevel,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3';

interface ZoomIndicatorProps {
  level: PassioCameraZoomLevel;
}

const ZoomIndicator: React.FC<ZoomIndicatorProps> = ({ level }) => {
  const branding = useBranding();

  return (
    <View style={styles.container}>
      <ProgressSlider
        sliderValue={1}
        minimumValue={level?.minZoomLevel ?? 0}
        sliderMaxValue={level?.maxZoomLevel ?? 1}
        step={0.1}
        minimumTrackTintColor={branding.primaryColor}
        maximumTrackTintColor={'white'}
        thumbTintColor={branding.primaryColor}
        onChangeSliderValue={(val) => PassioSDK.setCameraZoomLevel(val)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    justifyContent: 'center',
    bottom: 4,
  },
});

export default ZoomIndicator;
