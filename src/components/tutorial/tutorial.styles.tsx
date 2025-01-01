import { StyleSheet } from 'react-native';
import type { Branding } from '../../contexts';
import { scaleHeight, scaleWidth, scaledSize } from '../../utils';

const tutorialStyle = ({ white, primaryColor }: Branding) =>
  StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    iconColor: {
      tintColor: primaryColor,
    },
    title: {
      fontSize: 20,
      backgroundColor: 'rgba(247, 247, 247, 1)',
      paddingTop: 48,
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    bottomTitle: {
      paddingTop: 16,
    },
    bottomMessage: {
      paddingBottom: 16,
    },
    message: {
      fontSize: 14,
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: 'white',
    },
    topMessageContainer: {
      position: 'absolute',
      right: 0,
      left: 0,
      overflow: 'hidden',
      top: 0,
      borderBottomLeftRadius: 18,
      borderBottomRightRadius: 18,
    },
    bottomMessageContainer: {
      position: 'absolute',
      right: 0,
      left: 0,
      overflow: 'hidden',
      borderTopStartRadius: 18,
      borderTopEndRadius: 18,
      bottom: 0,
    },
    optionMainContainer: {
      backgroundColor: white,
      marginVertical: scaleHeight(16),
      marginHorizontal: scaleHeight(16),
      flexDirection: 'row',
      alignSelf: 'flex-end',
      maxWidth: scaleWidth(180),
      borderRadius: scaledSize(16),
    },
    optionContainer: {
      paddingVertical: scaleHeight(16),
      flexDirection: 'row',
    },
    optionTitle: {
      marginStart: scaleWidth(12),
      textTransform: 'capitalize',
    },
    optionIcon: {
      height: scaleHeight(20),
      width: scaleWidth(20),
      marginStart: scaleWidth(12),
    },
  });

export default tutorialStyle;
