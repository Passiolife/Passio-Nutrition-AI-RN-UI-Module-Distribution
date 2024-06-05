import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../../constants';
import { scaleHeight, scaleWidth, scaledSize } from '../../utils';
import type { Branding } from '../../contexts';

const { width } = Dimensions.get('window');
const homeScreenStyle = ({ backgroundColor }: Branding) =>
  StyleSheet.create({
    bodyContainer: {
      flex: 1,
      backgroundColor: backgroundColor,
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
      backgroundColor: COLORS.white,
      marginBottom: 30,
    },
    touchContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
    },
    mealContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    mealDetail: {
      marginHorizontal: 10,
      flex: 1,
    },
    mealImg: {
      height: 50,
      width: 50,
    },
    mealName: {
      fontWeight: '600',
      fontSize: 15,
      textTransform: 'capitalize',
      color: COLORS.grey7,
    },
    mealSize: {
      color: COLORS.grey7,
      fontSize: 14,
      fontWeight: '400',
    },
    mealDescription: {
      color: COLORS.grey7,
      fontSize: 14,
      fontWeight: '400',
    },
    mealTime: {
      color: '#286CE2',
      marginRight: 10,
      fontWeight: '600',
      fontSize: 13,
    },
    footerContainer: {
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: COLORS.grey3,
      marginHorizontal: 4,
      marginTop: 5,
      padding: 20,
      marginBottom: 120,
    },
    roundView: {
      height: 25,
      width: 25,
      borderWidth: 1,
      borderColor: '#00000029',
      borderRadius: 25 / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    plus: {
      color: COLORS.grey3,
      fontWeight: 'bold',
      fontSize: 19,
      height: 30,
      width: 30,
      borderRadius: 30 / 2,
      borderWidth: 2,
      borderColor: COLORS.grey3,
      textAlign: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    label: {
      fontSize: 18,
      fontWeight: '400',
    },
    mealTimeContainer: {
      width: '100%',
      marginBottom: 20,
      alignSelf: 'center',
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
    mealImgLayout: {
      borderRadius: 50,
      overflow: 'hidden',
      height: 50,
      width: 50,
    },
    headerIconImg: {
      height: 26,
      width: 24,
    },
    headerBodyTitle: {
      color: COLORS.white,
    },
    scrollViewStyle: {
      paddingHorizontal: scaleWidth(12),
      zIndex: 10,
    },
    macroContainer: {},
    macroTitle: {
      flex: 1,
      marginStart: scaleHeight(8),
    },
    macroTitleContainer: {
      marginTop: scaleHeight(16),
      marginHorizontal: scaleHeight(16),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
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
      zIndex: 1000,
    },
    widgetsContainer: {
      flexDirection: 'row',
      gap: 10,
      marginTop: scaleHeight(8),
    },
  });

export default homeScreenStyle;
