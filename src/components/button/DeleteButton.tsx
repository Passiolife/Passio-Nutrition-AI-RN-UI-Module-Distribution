import React, { useState } from 'react';
import {
  type StyleProp,
  StyleSheet,
  Text,
  TouchableHighlight,
  type ViewStyle,
} from 'react-native';

import { COLORS } from '../../constants';
import { scaleHeight } from '../../utils';

interface Props {
  onPress?: () => unknown;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
  testId?: string;
}

export const DeleteButton = (props: Props) => {
  const { onPress, style, small = false, testId } = props;
  const [btnTextColor, setBtnTextColor] = useState(COLORS.darkRed);

  return (
    <TouchableHighlight
      testID={testId}
      style={[
        styles.container,
        small ? styles.smallContainer : styles.normalContainer,
        style,
      ]}
      onPress={onPress}
      onShowUnderlay={() => setBtnTextColor(COLORS.white)}
      onHideUnderlay={() => setBtnTextColor(COLORS.darkRed)}
      underlayColor={COLORS.darkRed}
    >
      <Text
        style={[
          styles.text,
          small ? styles.smallText : styles.normalText,
          {
            color: btnTextColor,
          },
        ]}
      >
        Delete
      </Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    minWidth: 100,
    borderWidth: 1,
    borderColor: COLORS.darkRed,
    backgroundColor: COLORS.transparent,
  },
  text: {
    paddingVertical: scaleHeight(12),
    fontWeight: '400',
  },
  // primary button styles
  primaryContainer: {
    backgroundColor: COLORS.blue,
  },
  // normal sized button styles
  normalContainer: {
    borderRadius: 4,
  },
  normalText: {
    fontSize: 15,
  },

  // small sized button styles
  smallContainer: {
    borderRadius: 4,
  },
  smallText: {
    fontSize: 15,
    lineHeight: 18,
  },
});
