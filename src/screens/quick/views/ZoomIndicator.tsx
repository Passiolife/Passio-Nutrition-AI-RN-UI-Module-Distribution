import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ProgressSlider } from '../../../components';
import { useBranding } from '../../../contexts';
import {
  PassioCameraZoomLevel,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { ICONS } from '../../../assets';

interface ZoomIndicatorProps {
  level: PassioCameraZoomLevel;
}

const ZoomIndicator: React.FC<ZoomIndicatorProps> = ({ level }) => {
  const branding = useBranding();

  const [isEnableTorch, setEnableTorch] = useState(false);

  useEffect(() => {
    PassioSDK.enableFlashlight(isEnableTorch);
  }, [isEnableTorch]);

  return (
    <View style={styles.container}>
      <ProgressSlider
        sliderValue={1}
        minimumValue={level?.minZoomLevel ?? 0}
        sliderMaxValue={level?.maxZoomLevel ?? 1}
        step={0.1}
        minimumTrackTintColor={branding.primaryColor}
        sliderStyle={{ flex: 1, marginHorizontal: 16 }}
        maximumTrackTintColor={'white'}
        thumbTintColor={branding.primaryColor}
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
    bottom: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  icon: {
    height: 24,
    width: 24,
  },
});

export default ZoomIndicator;
