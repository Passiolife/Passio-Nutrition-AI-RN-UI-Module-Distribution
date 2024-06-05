import { Dimensions, StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

const { width } = Dimensions.get('window');
const margin = 24;
const itemWidth = (width - margin) / 2;
export const actionPlanViewStyle = StyleSheet.create({
  container: { padding: 8, width: itemWidth },
  image: {
    width: itemWidth - margin,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    alignSelf: 'center',
    color: COLORS.white,
    paddingVertical: 4,
  },
  selected: {
    height: 48,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  right: {
    height: 16,
    width: 16,
  },
});
