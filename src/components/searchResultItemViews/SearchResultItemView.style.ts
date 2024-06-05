import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants';
import { scaled } from '../../utils/';

const styles = StyleSheet.create({
  shadowContainer: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: COLORS.white,
    // SHADOW
    flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 3.2,
    elevation: 4,
  },
  mealContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 8,
  },
  mealDetail: {
    marginHorizontal: 10,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
  },
  brand: {
    textTransform: 'capitalize',
  },
  mealImg: {
    height: 40,
    width: 40,
  },
  mealName: {
    textTransform: 'capitalize',
  },
  mealImgLayout: {
    borderRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
    height: 40,
    width: 40,
  },
  addFoodIcon: {
    ...scaled(24),
  },
  addFoodIconView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
