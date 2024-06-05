import { StyleSheet } from 'react-native';
import { COLORS } from '../../../constants';
import { scaleWidth, scaleHeight } from '../../../utils';
import type { Branding } from '../../../contexts';

const mealPlanScreenStyle = ({ backgroundColor }: Branding) =>
  StyleSheet.create({
    bodyContainer: {
      backgroundColor: backgroundColor,
      flex: 1,
    },
    cardContainer: {
      paddingVertical: scaleHeight(16),
      marginBottom: scaleHeight(16),
      marginVertical: scaleHeight(16),
      marginHorizontal: scaleHeight(16),
    },
    cardHeader: {
      flexDirection: 'row',
      paddingHorizontal: scaleWidth(16),
      alignSelf: 'center',
    },
    icon: {
      width: scaleWidth(20),
      height: scaleHeight(20),
    },
    scrollViewStyle: {
      zIndex: 10,
    },
    mealPlanText: {
      marginHorizontal: scaleWidth(8),
      textTransform: 'capitalize',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    infoText: {
      fontSize: 12,
      paddingVertical: 4,
      marginBottom: 16,
      textAlign: 'center',
      fontWeight: '600',
      color: COLORS.blue,
    },
  });

export default mealPlanScreenStyle;
