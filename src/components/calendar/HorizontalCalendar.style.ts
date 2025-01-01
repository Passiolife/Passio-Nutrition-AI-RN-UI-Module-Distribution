import { StyleSheet } from 'react-native';
import { scaleHeight } from '../../utils';
import type { Branding } from '../../contexts';

const horizontalCalendarStyle = ({ border, white, secondaryText }: Branding) =>
  StyleSheet.create({
    listContainer: {
      padding: 16,
    },
    dayText: {
      fontSize: 14,
      color: secondaryText,
      paddingVertical: scaleHeight(6),
    },
    dayStyle: {},
    activeText: {
      color: white,
    },
    item: {
      borderRadius: 24,
      justifyContent: 'center',
      marginTop: 16,
      alignItems: 'center',
      flexDirection: 'row',
      marginHorizontal: 8,
      paddingHorizontal: 14,
      borderColor: border,
    },
  });

export default horizontalCalendarStyle;
