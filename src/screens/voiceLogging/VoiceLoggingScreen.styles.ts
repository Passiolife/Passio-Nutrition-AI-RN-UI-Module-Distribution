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
      elevation: 10,
      flex: 1,
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
      position: 'absolute',
      left: 16,
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      minWidth: 160,
      bottom: 60,
      right: 16,
    },
    defaultText: {
      position: 'absolute',
      bottom: 40,
      justifyContent: 'center',
      top: 0,
      left: 24,
      right: 24,
    },
    searchQuery: {
      padding: 12,
      position: 'absolute',
      flex: 1,
      left: 24,
      right: 24,
      top: 16,
      backgroundColor: '#EEF2FF',
      borderRadius: 8,
    },
    speekingImg: {
      height: height / 3,
      width: width,
      transform: [
        {
          scale: 2,
        },
      ],
    },
    micIcon: {
      height: 20,
      width: 20,
      tintColor: '#fff',
    },
    generatingResultLoading: {
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      marginBottom: 100,
    },
    imageContainer: {
      position: 'absolute',
      top: 200,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });
