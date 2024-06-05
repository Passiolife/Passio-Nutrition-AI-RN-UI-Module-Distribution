import React, { useImperativeHandle } from 'react';
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
import { SwitchTabLabelEnum } from '../../types';
import { useCalendarCarousel } from './useCalanderCarosel';
import { SwitchTab } from '../switchTab';

export interface CalendarCarouselRef {
  getStartDate: () => Date;
  getEndDate: () => Date;
  getCalendarType: () => SwitchTabLabelEnum;
}

interface CalendarCarouselProps {
  calendarCarouselContainerStyle?: StyleProp<ViewStyle>;
  calendarIcon?: JSX.Element;
  onDateSelect: (
    startDate: Date,
    endDate: Date,
    type: SwitchTabLabelEnum
  ) => void;
}

export const CalendarCarousel = React.forwardRef(
  (
    {
      calendarCarouselContainerStyle,
      onDateSelect,
      calendarIcon,
    }: CalendarCarouselProps,
    ref: React.Ref<CalendarCarouselRef>
  ) => {
    const {
      onLeftPress,
      onRightPress,
      label,
      selectedSwitch,
      onChangeSwitchTab,
      startDate,
      endDate,
      calendarType,
    } = useCalendarCarousel({ onDateSelect });

    useImperativeHandle(ref, () => {
      return {
        getStartDate: () => {
          return startDate;
        },
        getEndDate: () => {
          return endDate;
        },
        getCalendarType: () => {
          return calendarType;
        },
      };
    });

    const styles = calendarCarouselStyles(useBranding());
    return (
      <>
        <SwitchTab
          label1={SwitchTabLabelEnum.Week}
          label2={SwitchTabLabelEnum.Month}
          containerStyle={styles.switchTabContainer}
          selectedSwitch={selectedSwitch}
          onChangeSwitch={onChangeSwitchTab}
        />
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
            <Text weight="600" size="_14px" color="text">
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
    textView: {
      width: '45%',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    switchTabContainer: {
      marginTop: scaleHeight(12),
    },
  });
