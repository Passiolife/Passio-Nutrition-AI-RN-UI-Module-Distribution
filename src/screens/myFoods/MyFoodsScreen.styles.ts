import { StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import type { Branding } from '../../contexts';

export const myFoodScreenStyle = ({ searchBody }: Branding) =>
  StyleSheet.create({
    statusBarLayout: {
      height: getStatusBarHeight(),
      backgroundColor: searchBody,
    },
    body: {
      backgroundColor: searchBody,
      flex: 1,
    },
    container: {
      flex: 1,
    },
    button: {
      marginVertical: 24,
      marginHorizontal: 16,
    },
  });
