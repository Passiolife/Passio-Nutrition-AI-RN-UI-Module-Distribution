import { StyleSheet } from 'react-native';
import { scaleHeight, scaleWidth } from '../../utils';

const searchResultAlternativeViewStyle = () =>
  StyleSheet.create({
    text: {
      paddingHorizontal: scaleWidth(16),
      textTransform: 'capitalize',
    },
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    card: {
      borderRadius: scaleWidth(8),
      marginStart: scaleWidth(8),
      marginVertical: scaleWidth(8),
      height: scaleHeight(42),
    },
    contentContainerStyle: {
      paddingHorizontal: scaleWidth(8),
    },
  });

export default searchResultAlternativeViewStyle;
