import { StyleSheet } from 'react-native';
import { COLORS } from '../../../../constants';

const styles = StyleSheet.create({
  footerContainer: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.monochromeInput,
    marginHorizontal: 4,
    marginTop: 5,
    padding: 20,
    marginBottom: 120,
  },
  flatListContainer: {
    padding: 16,
  },
  footer: {
    height: 100,
  },
  cardContainer: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'space-between',
  },
  sectionContainer: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  mealImgLayout: {
    borderRadius: 40,
    overflow: 'hidden',
    height: 40,
    width: 40,
  },
  mealImg: {
    height: 40,
    width: 40,
  },
  touchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  mealDetail: {
    marginHorizontal: 10,
    flex: 1,
  },
  mealContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealName: {
    fontWeight: '600',
    fontSize: 15,
    textTransform: 'capitalize',
  },
  mealSize: {
    fontSize: 14,
    fontWeight: '400',
  },
  mealDescription: {
    fontSize: 14,
    fontWeight: '400',
  },
  mealTime: {
    marginRight: 10,
    fontWeight: '600',
    fontSize: 13,
  },
  plusIcon: {
    height: 30,
    width: 30,
  },
});

export default styles;
