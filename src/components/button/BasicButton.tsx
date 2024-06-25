import React from 'react';
import {
  type StyleProp,
  StyleSheet,
  TouchableHighlight,
  type ViewStyle,
  ActivityIndicator,
  View,
} from 'react-native';

import { COLORS } from '../../constants';
import { useBranding, type Branding } from '../../contexts';
import { scaleHeight } from '../../utils';
import { Text } from '../texts';

interface Props {
  text: string;
  onPress?: () => unknown;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
  secondary?: boolean;
  isLoading?: boolean;
  enable?: boolean;
  boarderColor?: string;
  textColor?: string;
  backgroundColor?: string;
  testId?: string;
  rightIcon?: JSX.Element;
  disabled?: boolean;
}

export const BasicButton: React.FC<Props> = (props) => {
  const brandingContext = useBranding();
  const {
    text,
    onPress,
    style,
    small = false,
    isLoading = false,
    secondary = false,
    enable = true,
    boarderColor = brandingContext.primaryColor,
    testId,
    rightIcon,
    backgroundColor,
    textColor,
    disabled = false,
  } = props;
  const styles = basicButtonStyle(brandingContext);

  const renderBorder = () => {
    let border;
    if (secondary) {
      border = 2;
    } else {
      border = 2;
    }
    return border;
  };

  const renderBorderColor = () => {
    let bgColor;
    if (!enable) {
      bgColor = COLORS.grey3;
    } else if (secondary) {
      bgColor = boarderColor;
    } else {
      bgColor = brandingContext.primaryColor;
    }
    return bgColor;
  };

  const applyBackgroundColor = () => {
    let colorOfBorder;
    if (!enable) {
      colorOfBorder = COLORS.grey3;
    } else if (secondary) {
      colorOfBorder = COLORS.transparent;
    } else {
      colorOfBorder = backgroundColor ?? brandingContext.primaryColor;
    }
    return colorOfBorder;
  };

  const handleOnPress = () => {
    if (enable) {
      if (onPress) {
        onPress();
      }
    }
  };

  return (
    <TouchableHighlight
      disabled={disabled}
      testID={testId}
      style={[
        styles.container,
        small ? styles.smallContainer : styles.normalContainer,
        {
          borderWidth: renderBorder(),
          borderColor: renderBorderColor(),
          backgroundColor: applyBackgroundColor(),
        },
        style,
      ]}
      onPress={handleOnPress}
      underlayColor={COLORS.blueTranslucent}
    >
      <>
        {rightIcon ? <View style={styles.iconView}>{rightIcon}</View> : null}

        {isLoading ? (
          <ActivityIndicator
            style={[styles.text, small ? styles.smallText : styles.normalText]}
          />
        ) : (
          <Text
            weight="600"
            size="_14px"
            style={[
              styles.text,
              small ? styles.smallText : styles.normalText,
              {
                color: textColor ?? (secondary ? boarderColor : COLORS.white),
              },
            ]}
          >
            {text}
          </Text>
        )}
      </>
    </TouchableHighlight>
  );
};

const basicButtonStyle = ({ primaryColor }: Branding) =>
  StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 16,
      minWidth: 100,
      flexDirection: 'row',
    },
    text: {
      paddingVertical: scaleHeight(12),
    },
    // primary button styles
    primaryContainer: {
      backgroundColor: primaryColor,
    },
    // normal sized button styles
    normalContainer: {
      borderRadius: 4,
    },
    normalText: {
      paddingVertical: scaleHeight(12),
      fontSize: 15,
    },

    // small sized button styles
    smallContainer: {
      borderRadius: 4,
    },
    smallText: {
      paddingVertical: scaleHeight(12),
      lineHeight: 18,
    },
    iconView: {
      marginEnd: 8,
    },
  });
