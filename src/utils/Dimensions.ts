import { Dimensions, Platform } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const designWidth = Platform.OS === 'web' ? screenWidth : 428; //to be added acc. to design specification
export const designHeight = Platform.OS === 'web' ? screenHeight : 926; //to be added acc. to design specification

const scaleWidth = (val: number) => {
  return (screenWidth * val) / designWidth;
};

const scaleHeight = (val: number) => {
  return (screenHeight * val) / designHeight;
};

const scale = Math.min(screenWidth / designWidth, screenHeight / designHeight);

const moderateScale = (size: number, factor = 1) =>
  size + (scaleWidth(size) - size) * factor;

const scaledSize = (size: number) => Math.ceil(size * scale);

export const scaled = (value: number) => {
  return {
    height: scaledSize(value),
    width: scaledSize(value),
  };
};

export {
  moderateScale,
  scaledSize,
  scaleHeight,
  scaleWidth,
  screenHeight,
  screenWidth,
};
