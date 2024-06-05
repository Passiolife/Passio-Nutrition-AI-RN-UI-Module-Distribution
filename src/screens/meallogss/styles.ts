import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { scaleHeight, scaleWidth, scaledSize } from '../../utils';
import type { Branding } from '../../contexts';

const { width } = Dimensions.get('window');

const mealLogScreenStyle = ({ backgroundColor }: Branding) =>
  StyleSheet.create({
    bodyContainer: {
      backgroundColor: backgroundColor,
      flex: 1,
    },
    container: {
      width: 200,
      height: 200,
      borderWidth: 20,
      borderRadius: 100,
      borderColor: 'grey',
      justifyContent: 'center',
      alignItems: 'center',
    },
    firstProgressLayer: {
      width: 200,
      height: 200,
      borderWidth: 20,
      borderRadius: 100,
      position: 'absolute',
      borderLeftColor: 'transparent',
      borderBottomColor: 'transparent',
      borderRightColor: COLORS.blue2,
      borderTopColor: COLORS.blue2,
      transform: [{ rotateZ: '-135deg' }],
    },
    secondProgressLayer: {
      width: 200,
      height: 200,
      position: 'absolute',
      borderWidth: 20,
      borderRadius: 100,
      borderLeftColor: 'transparent',
      borderBottomColor: 'transparent',
      borderRightColor: COLORS.blue2,
      borderTopColor: COLORS.blue2,
      transform: [{ rotateZ: '45deg' }],
    },
    offsetLayer: {
      width: 200,
      height: 200,
      position: 'absolute',
      borderWidth: 20,
      borderRadius: 100,
      borderLeftColor: 'transparent',
      borderBottomColor: 'transparent',
      borderRightColor: 'grey',
      borderTopColor: 'grey',
      transform: [{ rotateZ: '-135deg' }],
    },
    progressContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-between',
      marginBottom: 25,
      marginTop: 30,
    },
    circleContainer: {
      alignItems: 'center',
    },
    circleTitle: {
      marginTop: 5,
      textTransform: 'capitalize',
      fontSize: 13,
      fontWeight: '400',
      color: COLORS.grey7,
    },
    // LIST STYLE
    flatListContainer: {
      flex: 1,
      marginBottom: 30,
    },
    touchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },

    scrollViewStyle: {
      flex: 1,
      paddingHorizontal: scaleWidth(12),
    },

    headerDate: {
      textAlign: 'center',
    },
    headerBodyContainer: {
      flexDirection: 'row',
      marginBottom: scaleHeight(8),
      alignItems: 'center',
    },
    bottomStyle: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerBodyIcon: { height: scaledSize(24), width: scaledSize(24) },
    calendarIcon: {
      height: scaledSize(16),
      width: scaledSize(16),
      marginHorizontal: scaleWidth(8),
    },
    datePickerContainer: { flexDirection: 'row', marginHorizontal: 16 },
    headerBodyIconLayout: {
      padding: 5,
    },
    headerRightText: {
      color: COLORS.white,
      fontSize: 15,
      lineHeight: 18,
      padding: 4,
      fontWeight: '400',
    },
    editTouchableStyle: {
      marginLeft: 10,
    },
    mealContainerContent: {
      width: '74%',
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
    bottomFakeView: {
      height: 240,
    },
    timeBtn: {
      height: 30,
      width: width / 5 - 7,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 1,
    },
    timeBtnLayout: {
      flexDirection: 'row',
      borderRadius: 22,
      overflow: 'hidden',
    },
    timeBtnText: {
      fontSize: 13,
      fontWeight: '400',
      textTransform: 'capitalize',
    },
    mealTimeContainer: {
      width: '100%',
      marginBottom: 20,
      alignSelf: 'center',
    },
  });

export default mealLogScreenStyle;
