import { StyleSheet, Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const styles = StyleSheet.create({
  mainContainer: {
    height: Platform.OS === 'ios' ? 44 : 48,
    backgroundColor: '#0F387D',
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusBar: {
    height: getStatusBarHeight(),
  },
  sideBar: {
    width: '15%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    width: '70%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
