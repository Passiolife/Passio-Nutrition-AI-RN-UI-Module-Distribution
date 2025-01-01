import { StyleSheet } from 'react-native';
import { scaleHeight, scaledSize } from '../../utils';
import type { Branding } from '../../contexts';

export const stylesObj = ({ primaryColor }: Branding) =>
  StyleSheet.create({
    headerBodyIcon: {
      height: scaledSize(24),
      width: scaledSize(24),
    },
    iconColor: {
      tintColor: primaryColor,
    },
    macroContainer: {
      marginVertical: scaleHeight(16),
    },
    macroTitle: {
      flex: 1,
      marginStart: scaleHeight(8),
    },
    macroTitleContainer: {
      marginTop: scaleHeight(12),
      marginHorizontal: scaleHeight(16),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
