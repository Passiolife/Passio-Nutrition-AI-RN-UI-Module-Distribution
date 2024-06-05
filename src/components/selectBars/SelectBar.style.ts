import { StyleSheet } from 'react-native';

import { COLORS } from '../../constants';
import type { Branding } from '../../contexts';
import { scaleHeight, scaledSize } from '../../utils';

const selectedBarStyle = ({ primaryColor, gray500, border }: Branding) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderColor: border,
      overflow: 'hidden',
      borderWidth: 1,
      borderRadius: scaledSize(8),
    },
    first: {
      overflow: 'hidden',
    },
    last: {
      marginRight: 0,
      overflow: 'hidden',
      borderRightWidth: 0,
    },
    item: {
      paddingVertical: scaleHeight(14),
      flex: 1,
      borderRightWidth: 1,
      justifyContent: 'center',
      overflow: 'hidden',
      borderColor: border,
      alignItems: 'center',
    },
    itemText: {
      overflow: 'hidden',
      color: gray500,
    },
    itemSelected: {
      backgroundColor: primaryColor,
      overflow: 'hidden',
    },
    itemSelectedText: {
      color: COLORS.white,
      overflow: 'hidden',
    },
  });

export default selectedBarStyle;
