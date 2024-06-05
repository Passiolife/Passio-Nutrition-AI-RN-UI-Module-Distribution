import React from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useBranding, type Branding } from '../../contexts';
import { Text } from '../texts';
import { ICONS } from '../../assets';
import { scaleHeight, scaled } from '../../utils';

export interface CalendarCarouselIndicatorRef {}

interface CalendarCarouselProps {
  calendarCarouselContainerStyle?: StyleProp<ViewStyle>;
  calendarIcon?: JSX.Element;
  onLeftPress: () => void;
  onRightPress: () => void;
  label: string;
}
export const CalendarCarouselIndicator = React.forwardRef(
  (
    {
      calendarCarouselContainerStyle,
      onLeftPress,
      onRightPress,
      calendarIcon,
      label,
    }: CalendarCarouselProps,
    _ref: React.Ref<CalendarCarouselIndicatorRef>
  ) => {
    const styles = calendarCarouselStyles(useBranding());
    return (
      <>
        <View style={[styles.container, calendarCarouselContainerStyle]}>
          <TouchableOpacity onPress={onLeftPress}>
            <Image
              source={ICONS.left}
              resizeMode="contain"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
          <View style={styles.textView}>
            {calendarIcon ? calendarIcon : null}
            <Image
              source={ICONS.calendar}
              resizeMode="contain"
              resizeMethod="resize"
              style={styles.calendar}
            />
            <Text
              weight="600"
              size="_14px"
              color="text"
              style={{ alignItems: 'center' }}
            >
              {label}
            </Text>
          </View>
          <TouchableOpacity onPress={onRightPress}>
            <Image
              source={ICONS.right}
              resizeMode="contain"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        </View>
      </>
    );
  }
);

const calendarCarouselStyles = ({}: Branding) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrowIcon: {
      ...scaled(24),
    },
    calendar: {
      ...scaled(16),
      marginHorizontal: 4,
    },
    textView: {
      minWidth: 150,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    switchTabContainer: {
      marginTop: scaleHeight(12),
    },
  });
