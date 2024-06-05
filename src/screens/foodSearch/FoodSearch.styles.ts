import { Platform, Dimensions, StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { COLORS } from '../../constants';
import type { Branding } from '../../contexts';

const { height } = Dimensions.get('window');

export const searchStyle = ({ searchBody, backgroundColor }: Branding) =>
  StyleSheet.create({
    statusBarLayout: {
      height: getStatusBarHeight(),
      backgroundColor: searchBody,
    },
    body: {
      backgroundColor: searchBody,
      flex: 1,
    },
    gap: {
      height: 12,
    },
    container: {
      ...Platform.select({
        ios: {
          flex: 1,
        },
        android: {
          flex: 1,
        },
      }),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mainContainer: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    cancelIconStyle: {
      width: 20,
      height: 20,
      tintColor: COLORS.grey6,
    },
    cancelIconLayout: {
      paddingVertical: 6,
    },
    inputContainerStyle: {
      ...Platform.select({
        ios: {
          backgroundColor: COLORS.blue4,
        },
        android: {
          backgroundColor: COLORS.white,
        },
      }),
    },
    card: {
      width: '100%',
      paddingVertical: 15,
      marginBottom: 5,
      backgroundColor: '#ccc',
    },

    // RecentSearchResultView
    recentTextStyle: {
      color: '#003389',
      fontWeight: '400',
      fontSize: 24,
      textAlign: 'center',
      marginVertical: 20,
    },
    emptyListContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      height: height - (getStatusBarHeight() + 70),
    },
    contentContainerStyle: { paddingBottom: 25 },
  });
