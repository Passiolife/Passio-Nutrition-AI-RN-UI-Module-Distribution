import React from 'react';
import Slider from '@react-native-community/slider';
import type { StyleProp, ViewStyle } from 'react-native';

interface Props {
  sliderValue: number;
  sliderMaxValue: number;
  step: number;
  minimumTrackTintColor: string;
  maximumTrackTintColor: string;
  thumbTintColor: string;
  onChangeSliderValue: (val: number) => void;
  sliderStyle?: StyleProp<ViewStyle>;
  isVertical?: boolean;
}

export const ProgressSlider = (props: Props) => {
  const {
    sliderValue,
    minimumTrackTintColor,
    maximumTrackTintColor,
    thumbTintColor,
    onChangeSliderValue,
    sliderMaxValue,
    step,
    sliderStyle,
    isVertical = false,
  } = props;
  return (
    <Slider
      value={sliderValue}
      onValueChange={(value: any) => onChangeSliderValue(value)}
      minimumTrackTintColor={minimumTrackTintColor}
      maximumTrackTintColor={maximumTrackTintColor}
      thumbTintColor={thumbTintColor}
      vertical={isVertical}
      minimumValue={0}
      step={step}
      maximumValue={sliderMaxValue}
      style={sliderStyle}
    />
  );
};
