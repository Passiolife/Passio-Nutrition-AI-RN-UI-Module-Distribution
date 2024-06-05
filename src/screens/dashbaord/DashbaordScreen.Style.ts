import type { TextStyle, ViewStyle } from 'react-native';
import { Dimensions } from 'react-native';
import { palette } from '../../components/palette';
import {
  baseNormalTextStyle,
  baseSmallTextStyle,
  baseTitleNormalTextStyle,
} from '../Screen.Style';

export const baseContainer: ViewStyle = {
  flex: 1,
  backgroundColor: palette.white,
  paddingHorizontal: 24,
};

export const safeAreaContainer: ViewStyle = {
  flex: 1,
  backgroundColor: palette.white,
};

export const dashboardBaseContainer: ViewStyle = {
  flex: 1,
  backgroundColor: palette.white,
  marginTop: 30,
};

// Start Tracking Card View
export const startNutritionTrackingCardContainer: ViewStyle = {
  alignSelf: 'center',
  marginHorizontal: 8,
  elevation: 5,
  shadowColor: 'black',
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 10,
  marginTop: 16,
  paddingVertical: 24,
  justifyContent: 'space-between',
  shadowOpacity: 0.1,
  padding: 5,
  backgroundColor: palette.violetRed,
  borderRadius: 16,
  overflow: 'hidden',
};

export const nutritionCardTitleStyle: TextStyle = {
  ...baseTitleNormalTextStyle,
  paddingStart: 16,
  fontSize: 20,
  minHeight: 100,
  paddingEnd: Dimensions.get('window').width / 3,
  color: palette.white,
};

export const startTrackingStyle: TextStyle = {
  fontSize: 16,
  fontWeight: '600',
  borderWidth: 1.5,
  marginHorizontal: 16,
  marginTop: 24,
  width: 150,
  textAlign: 'center',
  paddingVertical: 8,
  borderColor: palette.white,
  borderRadius: 16,
  color: palette.white,
};

export const nutritionTrackContainer: ViewStyle = {
  width: Dimensions.get('window').width - 34,
  alignSelf: 'center',
  height: 'auto',
  elevation: 15,
  shadowColor: 'black',
  marginTop: 16,
  paddingVertical: 24,
  shadowOffset: { width: 0, height: 2 },
  shadowRadius: 10,
  justifyContent: 'space-between',
  shadowOpacity: 0.1,
  padding: 5,
  backgroundColor: palette.white,
  borderRadius: 18,
};

export const nutritionTrackTextStyle: TextStyle = {
  ...baseTitleNormalTextStyle,
  paddingStart: 16,
  fontSize: 16,
  paddingEnd: Dimensions.get('window').width / 3,
  color: palette.charcoal,
};

export const nutritionTrackInfoTextStyle: TextStyle = {
  ...baseSmallTextStyle,
  paddingStart: 16,
  fontSize: 13,
  paddingTop: 4,
  color: palette.charcoal,
};

export const buttonTrackNutrition: TextStyle = {
  ...baseNormalTextStyle,
  borderWidth: 1,
  marginHorizontal: 8,
  textAlign: 'center',
  paddingVertical: 6,
  alignSelf: 'center',
  fontWeight: '500',
  paddingHorizontal: 16,
  borderRadius: 16,
  fontSize: 15,
  color: palette.black,
};
