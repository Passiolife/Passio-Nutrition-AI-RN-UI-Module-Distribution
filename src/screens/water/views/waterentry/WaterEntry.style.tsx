import { StyleSheet } from 'react-native';
import type { Branding } from '../../../../contexts';
import { scaleHeight, scaleWidth } from '../../../../utils';

const waterEntryStyle = ({ white, backgroundColor }: Branding) =>
  StyleSheet.create({
    bodyContainer: {
      backgroundColor: backgroundColor,
      flex: 1,
      justifyContent: 'space-between',
    },
    content: {},
    cardStyle: {
      paddingVertical: 0,
    },
    containerTextInput: {},
    textInput: {
      padding: scaleHeight(12),
      marginVertical: scaleHeight(4),
      fontSize: 16,
      paddingStart: scaleWidth(16),
      backgroundColor: white,
    },

    formView: {
      margin: scaleHeight(16),
    },
    label: {
      flex: 1,
    },
    labelMargin: {
      marginTop: 10,
    },
    inputTitle: {
      marginTop: scaleHeight(8),
    },

    actionContainer: {
      flexDirection: 'row',
      marginBottom: scaleWidth(24),
      alignSelf: 'flex-end',
      marginHorizontal: scaleWidth(16),
    },
    buttonSeparator: {
      width: scaleWidth(8),
    },
    bottomActionButton: {
      flex: 1,
    },
  });

export default waterEntryStyle;
