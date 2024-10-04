import { StyleSheet } from 'react-native';
import type { Branding } from '../../contexts';
import { scaleHeight, scaleWidth, scaledSize } from '../../utils';

const logOptionsStyle = ({ white, primaryColor }: Branding) =>
  StyleSheet.create({
    optionContainer: {
      backgroundColor: white,
      paddingVertical: scaleHeight(12),
      marginVertical: scaleHeight(8),
      flexDirection: 'row',
      minWidth: scaleWidth(170),
      borderRadius: scaledSize(24),
    },
    optionTitle: {
      marginStart: scaleWidth(12),
    },
    optionIcon: {
      height: scaleHeight(20),
      width: scaleWidth(20),
      marginStart: scaleWidth(12),
    },
    iconColor: {
      tintColor: primaryColor,
    },
    main: {
      alignItems: 'center',
      alignSelf: 'center',
    },
  });

export default logOptionsStyle;
