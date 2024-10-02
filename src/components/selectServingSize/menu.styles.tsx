import { StyleSheet } from 'react-native';
import type { Branding } from '../../contexts';
import { scaleHeight, scaleWidth } from '../../utils';

const menuStyle = ({ white, border }: Branding) =>
  StyleSheet.create({
    main: {
      backgroundColor: white,
      borderColor: border,
      flexDirection: 'row',
      marginStart: 12,
      borderRadius: 9,
      flex: 1,
      borderWidth: 1,
      alignItems: 'center',
    },
    mainTitle: {
      flex: 1,
      marginStart: 12,
    },
    icon: {
      marginEnd: 12,
      height: scaleHeight(20),
      width: scaleWidth(20),
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
