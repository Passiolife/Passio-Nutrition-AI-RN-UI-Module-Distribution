import { StyleSheet, Dimensions } from 'react-native';
import type { Branding } from '../../contexts';

const { height, width } = Dimensions.get('window');

export const voiceLoggingScreenStyle = ({ backgroundColor }: Branding) =>
  StyleSheet.create({
    container: {
      backgroundColor: backgroundColor,
      flex: 1,
    },
    bottomSheetChildrenContainer: {
      shadowColor: '#00000029',
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 10,
      shadowOpacity: 1.0,
      elevation: 1,
    },
    contentView: {
      flex: 1,
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    contentText: {
      textAlign: 'center',
      fontStyle: 'italic',
      marginTop: 16,
    },
    btnView: {
      marginBottom: 40,
    },
    textView: {
      marginTop: 40,
      width: '100%',
    },
    textWrapper: {
      padding: 12,
      backgroundColor: '#EEF2FF',
      borderRadius: 8,
    },
    speekingImg: {
      width: width,
      height: height / 3,
    },
    micIcon: {
      height: 20,
      width: 20,
      tintColor: '#fff',
    },
  });
