import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useBranding } from '../../contexts/branding/BrandingContext';
import { COLORS } from '../../constants';

interface Props {
  style?: StyleProp<ViewStyle>;
  isSelected: boolean;
}

export const Radio = ({ style, isSelected }: Props) => {
  const { primaryColor } = useBranding();
  return (
    <>
      {isSelected ? (
        <View
          style={[
            style,
            styles.circle,
            styles.selected,
            { borderColor: primaryColor },
          ]}
        >
          <View
            style={[styles.innerCircle, { backgroundColor: primaryColor }]}
          />
        </View>
      ) : (
        <View
          style={[
            style,
            styles.circle,
            styles.unSelectedCircle,
            { borderColor: primaryColor },
          ]}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 24,
  },
  unSelectedCircle: {
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  selected: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    alignSelf: 'center',
    padding: 8,
    borderRadius: 16,
  },
  innerCircle: {
    padding: 8.5,
    alignSelf: 'center',
    borderRadius: 16,
  },
});
