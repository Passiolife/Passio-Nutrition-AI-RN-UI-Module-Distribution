import { StyleSheet } from 'react-native';
import type { Branding } from '../../contexts';

export const takePictureStyle = ({ backgroundColor }: Branding) =>
  StyleSheet.create({
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
    generatingResultLoading: {
      justifyContent: 'center',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      zIndex: 10,
    },
  });
