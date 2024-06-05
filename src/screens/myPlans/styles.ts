import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants';

const styles = StyleSheet.create({
  bodyContainer: {
    backgroundColor: COLORS.white,
    flex: 1,
  },
  headerIconImg: {
    height: 26,
    width: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  touchableTab: {
    flex: 1,
  },
  tabTex: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    color: COLORS.monochromeBody,
  },
  tabSelectText: {
    fontWeight: '600',
    color: COLORS.blue,
  },
  toolbarTitle: {
    color: COLORS.white,
    fontWeight: '400',
    fontSize: 18,
    alignSelf: 'flex-start',
  },
  lineContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  tabLine: {
    height: 2,
    marginHorizontal: 18,
    borderRadius: 24,
    flex: 1,
  },
  tabSelectLine: {
    backgroundColor: COLORS.blue,
  },
});

export default styles;
