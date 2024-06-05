import { StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { palette } from '../../../../components/palette';

const styles = StyleSheet.create({
  closeIconStyle: {
    height: 24,
    width: 24,
  },
  touchAreaStyle: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  blackBackgroundStyle: {
    flex: 1,
    backgroundColor: 'black',
    width: '100%',
  },
  baseIconStyle: {
    height: 24,
    width: 24,
  },
  cameraStyle: {
    flex: 1,
    width: '100%',
  },
  normalTextStyle: {
    fontSize: 18,
    color: '#4A4A4A',
    fontWeight: '600',
  },
  smallTextStyle: {
    fontSize: 13,
    color: '#4A4A4A',
    fontWeight: '600',
  },
  closeActionContainer: {
    flex: 1,
    top: 52,
    height: 25,
    width: 25,
    position: 'absolute',
    left: 20,
  },
  scanningBaseContainerStyle: {
    flex: 1,
    position: 'absolute',
    width: Dimensions.get('window').width - 24,
    minHeight: 180,
    bottom: 120,
    alignSelf: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    padding: 5,
    backgroundColor: '#00000066',
    borderRadius: 10,
  },
  scanningCardStyle: {
    width: '100%',
    padding: 25,
    flexDirection: 'row',
    height: 120,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  scanningTextStyle: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    paddingHorizontal: 16,
    color: palette.mediumDarkGray,
  },
  scanningTextInfoStyle: {
    fontSize: 13,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 16,
    paddingHorizontal: 24,
    color: palette.white,
    fontWeight: '400',
  },

  // Scanning Result Styles....
  scanningResultBaseContainerStyle: {
    flex: 1,
    position: 'absolute',
    width: Dimensions.get('window').width - 24,
    minHeight: 180,
    bottom: 120,
    alignSelf: 'center',
    elevation: 15,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    padding: 5,
    backgroundColor: palette.white,
    borderRadius: 10,
  },

  foodLogContainerStyle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: 'center',
  },

  foodLogImageContainerStyle: {
    width: 60,
    height: 60,
    marginHorizontal: 8,
    overflow: 'hidden',
    backgroundColor: palette.lightGray,
    marginVertical: 8,
    borderRadius: 60 / 2,
  },

  foodLogImageStyle: {
    width: 60,
    height: 60,
  },

  foodLogNameStyle: {
    fontSize: 18,
    fontWeight: '600',
    alignSelf: 'center',
    color: palette.charcoal,
    textTransform: 'capitalize',
    width: '75%',
  },

  foodLogTitleStyle: {
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 8,
    color: palette.charcoal,
    marginTop: 14,
    marginBottom: 20,
  },

  alternateFoodLogsFlatListStyle: {
    marginBottom: 20,
  },

  alternateFoodContainerStyle: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignContent: 'center',
    backgroundColor: palette.lightGray,
    borderRadius: 24,
    height: 45,
    marginLeft: 5,
  },

  alternateFoodImageContainerStyle: {
    width: 32,
    marginLeft: 4,
    borderRadius: 16,
    overflow: 'hidden',
    alignSelf: 'center',
  },

  alternateFoodImageStyle: {
    width: 32,
    aspectRatio: 1,
  },

  alternateFoodNameStyle: {
    fontSize: 13,
    fontWeight: '600',
    alignSelf: 'center',
    color: palette.charcoal,
    textTransform: 'capitalize',
    marginHorizontal: 5,
    marginRight: 10,
    maxWidth: 150,
  },

  passioSdkBaseContainerStyle: {
    flex: 1,
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },

  passioSdkLoadingTextStyle: {
    fontSize: 18,
    color: '#4A4A4A',
    fontWeight: '600',
    paddingHorizontal: 16,
    alignSelf: 'center',
  },

  alternativeStyle: {
    shadowOpacity: 0,
  },
});

export default styles;
