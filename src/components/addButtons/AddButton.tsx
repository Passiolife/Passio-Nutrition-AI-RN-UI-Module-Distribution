import React from 'react';
import {
  type StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  type ViewStyle,
} from 'react-native';

import { COLORS } from '../../constants';

interface Props {
  style?: StyleProp<ViewStyle>;
  onPress?: () => unknown;
}

export const AddButton = (props: Props) => (
  <TouchableOpacity
    onPress={props.onPress}
    style={[styles.footerContainer, props.style]}
  >
    <Text style={styles.plus}>+</Text>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  footerContainer: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.grey3,
    marginHorizontal: 4,
    marginTop: 5,
    padding: 20,
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
});
