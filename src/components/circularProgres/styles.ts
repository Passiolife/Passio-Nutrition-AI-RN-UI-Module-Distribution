import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  baselayer: {
    position: 'absolute',
  },
  firstProgressLayer: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  secondProgressLayer: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  offsetLayer: {
    position: 'absolute',
    borderLeftColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  display: {
    position: 'absolute',
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 1)',
    width: 45,
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievedValueStyle: {
    textAlign: 'center',
  },
  totalValueStyle: {
    fontSize: 13,
    fontWeight: '400',
    paddingHorizontal: 8,
    textAlign: 'center',
    color: '#333333',
  },
});

export default styles;
