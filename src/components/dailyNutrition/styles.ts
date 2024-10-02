import { StyleSheet } from 'react-native';
import { scaleHeight, scaledSize } from '../../utils';

export const stylesObj = () =>
  StyleSheet.create({
    headerBodyIcon: { height: scaledSize(24), width: scaledSize(24) },
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
