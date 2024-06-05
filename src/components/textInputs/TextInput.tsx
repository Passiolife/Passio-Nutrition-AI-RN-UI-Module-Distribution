import React from 'react';
import {
  StyleSheet,
  TextInput as RNTextInput,
  type TextInputProps,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { COLORS } from '../../constants';

interface Props extends TextInputProps {
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const TextInput: React.FC<Props> = ({
  containerStyle,
  style,
  error,
  ...rest
}) => {
  return (
    <View style={containerStyle}>
      <RNTextInput
        style={[styles.container, error ? styles.errorContainer : {}, style]}
        {...rest}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderColor: COLORS.grayscaleLine,
    backgroundColor: COLORS.grayscaleInput,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  errorContainer: {
    borderColor: COLORS.red,
  },
  error: {
    marginTop: 4,
    color: COLORS.red,
    fontSize: 12,
  },
});
