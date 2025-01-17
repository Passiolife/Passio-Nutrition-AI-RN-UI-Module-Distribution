import React, { type LegacyRef } from 'react';
import {
  Text as RNText,
  type ColorValue,
  type TextProps as RNTextProps,
  type StyleProp,
  type TextStyle,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useBranding, type Branding } from '../../contexts';
import { scaledSize } from '../../utils';

export type TextColor =
  | 'text'
  | 'secondaryText'
  | 'primaryColor'
  | 'white'
  | 'gray300'
  | 'carbs'
  | 'proteins'
  | 'fat'
  | 'gray500'
  | 'border'
  | 'error'
  | 'tab'
  | 'calories';
export type TextSize =
  | 'small'
  | 'normal'
  | 'large'
  | 'medium'
  | 'extra'
  | '_15px'
  | '_16px'
  | '_14px'
  | '_32px'
  | '_12px'
  | '_28px'
  | '_18px'
  | '_20px'
  | 'title'
  | 'secondlyTitle'
  | '_24px';

export type TextFontWeight = '400' | '500' | '600' | '700' | '800';

export interface TextProps extends RNTextProps {
  weight?: TextFontWeight;
  size?: TextSize;
  style?: StyleProp<TextStyle>;
  color?: TextColor;
  isLink?: boolean;
  onPressLink?: () => void;
}

const sizeMap = {
  _12px: scaledSize(12),
  _14px: scaledSize(14),
  _15px: scaledSize(15),
  _16px: scaledSize(16),
  _18px: scaledSize(18),
  _20px: scaledSize(20),
  _24px: scaledSize(24),
  _28px: 28,
  _32px: 32,
  extra: 22,
  large: 16,
  medium: 14,
  normal: 12,
  small: 8,
  title: 17,
  secondlyTitle: 14,
};

const weights = {
  '400': '400',
  '500': '500',
  '600': '600',
  '700': '700',
  '800': '800',
};
export const Text = React.forwardRef(
  (props: TextProps, ref: LegacyRef<RNText>) => {
    const {
      text,
      secondaryText,
      primaryColor,
      calories,
      carbs,
      proteins,
      fat,
      gray500,
      gray300,
      border,
      white,
      error,
    } = useBranding();

    const colors: Record<TextColor, ColorValue> = {
      primaryColor: primaryColor,
      text: text,
      secondaryText: secondaryText,
      proteins: proteins,
      calories: calories,
      carbs: carbs,
      fat: fat,
      gray500: gray500,
      border: border,
      gray300: gray300,
      white: white,
      error: error,
      tab: '#6B7280',
    };

    const {
      isLink = false,
      color = isLink ? 'primaryColor' : 'text',
      weight = '500',
      size = 'medium',
      style: styleOverride,
      onPressLink,
      ...rest
    } = props;

    const branding = useBranding();
    const styles = textStyle(branding);

    return (
      <>
        {isLink ? (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onPressLink ? onPressLink : undefined}
          >
            <RNText
              ref={ref}
              {...rest}
              style={[
                {
                  color: primaryColor,
                  fontSize: sizeMap[size],
                  fontWeight: weights[weight] as TextFontWeight,
                },
                styleOverride,
              ]}
            />
            <View style={styles.linkUnderline} />
          </TouchableOpacity>
        ) : (
          <RNText
            ref={ref}
            {...rest}
            style={[
              {
                color: colors[color],
                fontSize: sizeMap[size],
                fontWeight: weights[weight] as TextFontWeight,
              },
              styleOverride,
            ]}
          />
        )}
      </>
    );
  }
);

const textStyle = ({ primaryColor }: Branding) =>
  StyleSheet.create({
    linkUnderline: {
      borderBottomWidth: 1,
      borderColor: primaryColor,
    },
  });
