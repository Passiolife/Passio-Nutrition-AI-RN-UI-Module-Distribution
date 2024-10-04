import { StyleSheet } from 'react-native';
import type { Branding } from '../../contexts';
import { scaleHeight, scaleWidth } from '../../utils';
import type { EdgeInsets } from 'react-native-safe-area-context';

const headerStyle = ({ header }: Branding, insets: EdgeInsets) => {
  const statusBarHeight = insets.top;

  return StyleSheet.create({
    mainContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: header,
    },
    statusBar: {
      height: statusBarHeight - scaleHeight(10),
      backgroundColor: header,
    },
    rightSide: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    leftSize: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: scaleHeight(16),
      paddingHorizontal: scaleHeight(16),
    },
    body: {
      flex: 1,
      alignContent: 'center',
      textAlign: 'center',
    },
    imgBgStyle: {
      borderRadius: 0,
      shadowColor: '#00000029',
      shadowOpacity: 1,
      shadowOffset: {
        width: 1.5,
        height: 1,
      },
      shadowRadius: 2.85,
      elevation: 8,
    },
    headerBottom: {},
    backIcon: {
      width: scaleWidth(28),
      height: scaleHeight(28),
    },
    rightIcon: {
      width: scaleWidth(24),
      height: scaleHeight(24),
    },
  });
};

export default headerStyle;
