import { Platform, StyleSheet } from 'react-native';
import type { Branding } from '../../contexts';
import { scaled } from '../../utils';

export const searchHeaderStyle = ({
  searchBody,
  text,
  primaryColor,
  white,
}: Branding) =>
  StyleSheet.create({
    headerContainer: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: searchBody,
      justifyContent: 'space-between',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchBarLayout: {
      borderRadius: 12,
      marginEnd: 16,
      backgroundColor: white,
      paddingHorizontal: 10,
      flex: 1,
    },
    inputContainer: {
      paddingEnd: 8,
      paddingVertical: Platform.OS === 'ios' ? 12 : 0,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    searchInput: {
      borderWidth: 0,
      borderRadius: 0,
      fontWeight: '500',
      color: text,
      backgroundColor: 'white',
      fontSize: 18,
    },
    searchInputContainer: {
      flex: 1,
      backgroundColor: 'white',
    },
    cancleTxt: {
      paddingVertical: 10,
    },
    searchImg: {
      ...scaled(24),
      tintColor: primaryColor,
      transform: [
        {
          rotate: '-90deg',
        },
      ],
    },
    closeImg: {
      width: 10,
      height: 10,
    },
    headerCloseImgLayout: {
      backgroundColor: primaryColor,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 50,
      padding: 5,
      width: 22,
      height: 22,
    },
  });
