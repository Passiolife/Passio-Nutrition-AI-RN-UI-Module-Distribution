import { StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import type { Branding } from '../../contexts';

const headerStyle = ({ primaryColor }: Branding) =>
  StyleSheet.create({
    mainContainer: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    statusBar: {
      height: getStatusBarHeight(),
    },
    sideBar: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    imgBgStyle: {
      borderRadius: 0,
      backgroundColor: primaryColor,
    },
    headerBottom: {
      marginBottom: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default headerStyle;
