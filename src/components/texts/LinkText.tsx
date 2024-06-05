import React, { type LegacyRef } from 'react';
import {
  Text as RNText,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import { useBranding, type Branding } from '../../contexts';
import { Text, type TextProps } from './Text';

export interface LinkTextProps extends TextProps {
  onPressLink?: () => void;
}

export const LinkText = React.forwardRef(
  (props: TextProps, ref: LegacyRef<RNText>) => {
    const { onPressLink } = props;

    const branding = useBranding();
    const styles = textStyle(branding);

    return (
      <>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={onPressLink ? onPressLink : undefined}
        >
          <Text weight="400" ref={ref} {...props} />
          <View style={styles.linkUnderline} />
        </TouchableOpacity>
      </>
    );
  }
);

const textStyle = ({ primaryColor }: Branding) =>
  StyleSheet.create({
    linkUnderline: {
      borderBottomWidth: 0.5,
      borderColor: primaryColor,
    },
  });
