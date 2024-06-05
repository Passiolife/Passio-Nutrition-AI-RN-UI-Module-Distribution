import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

const styles = StyleSheet.create({
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
  progressContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 25,
    marginTop: 30,
  },
  progressMainContainerStyle: {
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 16,
    justifyContent: 'space-between',
  },
  progressContainerStyle: {
    alignItems: 'center',
  },
  progressTextStyle: {
    marginTop: 5,
    textTransform: 'capitalize',
  },
});

export default styles;
