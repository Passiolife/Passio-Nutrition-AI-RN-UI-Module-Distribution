import { StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import type { Branding } from '../../contexts';

export const foodCreatorStyle = ({ backgroundColor }: Branding) =>
  StyleSheet.create({
    statusBarLayout: {
      height: getStatusBarHeight(),
      backgroundColor: backgroundColor,
    },
    body: {
      backgroundColor: backgroundColor,
      flex: 1,
    },
  });
