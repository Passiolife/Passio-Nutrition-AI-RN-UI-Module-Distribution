import { StyleSheet } from 'react-native';
import type { Branding } from '../../contexts';
import { scaleHeight } from '../../utils';

const progressScreenStyle = ({
  white,
  primaryColor,
  backgroundColor,
  text,
}: Branding) =>
  StyleSheet.create({
    bodyContainer: {
      backgroundColor: backgroundColor,
      flex: 1,
    },
    cardStyle: {
      paddingVertical: 0,
    },
    headerIconImg: {
      height: 26,
      width: 24,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingVertical: scaleHeight(12),
    },
    touchableTab: {
      flex: 1,
    },
    tabTex: {
      fontSize: 18,
      fontWeight: '400',
      textAlign: 'center',
      color: text,
    },
    tabSelectText: {
      fontWeight: '600',
      color: primaryColor,
    },
    toolbarTitle: {
      color: white,
      fontWeight: '400',
      fontSize: 18,
      alignSelf: 'center',
    },
    lineContainer: {
      flexDirection: 'row',
    },
    tabLine: {
      height: 2,
      borderRadius: 24,
      flex: 1,
    },
    tabSelectLine: {
      backgroundColor: primaryColor,
    },
  });

export default progressScreenStyle;
