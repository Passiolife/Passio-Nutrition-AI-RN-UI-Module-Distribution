import { StyleSheet, Dimensions } from 'react-native';
const { height, width } = Dimensions.get('window');
import { COLORS } from '../../constants/colors';

const styles = StyleSheet.create({
  onboardingScrnContainer: {
    flex: 1,
    backgroundColor: 'rgba(79, 70, 229, 1)',
  },
  nextBtn: {
    alignSelf: 'center',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    width: width / 1.2,
    backgroundColor: COLORS.white,
    borderRadius: 20,
  },
  nextBtnText: {
    color: COLORS.black,
    fontSize: 15,
  },
  // OnboardingScreenView
  onboardingViewContainer: {
    alignItems: 'center',
  },
  videoLayout: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
  },
  contentLayout: {
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: width / 1.2,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.white,
  },
  contentText: {
    fontSize: 16,
    color: COLORS.white,
    textAlign: 'center',
    marginTop: 4,
    height: 60,
  },
  // SLIDER
  slide: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slideImage: { width: width * 0.9, height: '50%' },

  pagination: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    position: 'absolute',
    top: height / 1.6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 2,
  },
  paginationDotActive: { backgroundColor: '#00D795' },
  paginationDotInactive: { backgroundColor: '#BFF5E4' },
  playIconLayout: {
    height: 35,
    width: 30,
    position: 'absolute',
    top: height / 1.8 - 5,
    left: 20,
    padding: 3,
  },
  playIcon: {
    height: '100%',
    width: '100%',
  },
  backIconLayout: {
    height: 30,
    width: 30,
    position: 'absolute',
    top: 30,
    left: 20,
    padding: 3,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    height: '65%',
    width: '65%',
    marginLeft: 2,
  },
  carousel: { flex: 1 },
  // FOR VIDEO
  backgroundVideo: {
    height: height / 1.6,
    width: width,
    backgroundColor: COLORS.black,
  },
});

export default styles;
