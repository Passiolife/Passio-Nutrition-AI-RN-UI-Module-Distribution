import { StyleSheet } from 'react-native';
import type { Branding } from '../../contexts';
import { scaleHeight, scaleWidth } from '../../utils';

const menuStyle = ({ white, gray300, border, error }: Branding) =>
  StyleSheet.create({
    main: {
      backgroundColor: white,
      borderColor: gray300,
      flexDirection: 'row',
      borderRadius: 4,
      paddingVertical: 8,
      flex: 1,
      borderWidth: 1,
      alignItems: 'center',
    },
    mainTitle: {
      flex: 1,
      marginStart: 8,
    },
    icon: {
      marginEnd: 12,
      height: scaleHeight(20),
      width: scaleWidth(20),
    },
    error: {
      color: error,
    },

    optionContainer: {
      backgroundColor: white,
      paddingVertical: scaleHeight(16),
    },
    selected: {
      backgroundColor: border,
    },
    optionTitle: {
      marginStart: scaleWidth(12),
    },
    optionIcon: {
      height: scaleHeight(20),
      width: scaleWidth(20),
      marginStart: scaleWidth(12),
    },
  });

export default menuStyle;
