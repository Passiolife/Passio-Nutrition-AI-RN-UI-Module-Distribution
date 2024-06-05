import React from 'react';
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export const DismissKeyboardView: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={style.container}>{children}</View>
  </TouchableWithoutFeedback>
);
