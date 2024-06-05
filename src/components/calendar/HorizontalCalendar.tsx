import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { content } from '../../constants/Content';
import { useHorizontalCalendar } from './useHorizontalCalendar';
import { useBranding } from '../../contexts';
import horizontalCalendarStyle from './HorizontalCalendar.style';
import { Text } from '../texts';

export interface HorizontalCalendarProps {
  selectedDay?: number;
  onSelectDayPress: (day: number) => void;
}

export const HorizontalCalendar = (props: HorizontalCalendarProps) => {
  const { days, onDayPress, isSelected } = useHorizontalCalendar(props);
  const branding = useBranding();
  const { primaryColor, searchBody } = branding;
  const styles = horizontalCalendarStyle(branding);

  const renderItem = ({ item }: { item: number }) => {
    return (
      <TouchableOpacity
        onPress={() => onDayPress(item)}
        style={[
          styles.item,
          isSelected(item)
            ? {
                backgroundColor: primaryColor,
              }
            : {
                backgroundColor: searchBody,
              },
        ]}
      >
        <Text
          size="_12px"
          style={[
            styles.dayText,
            styles.dayStyle,
            isSelected(item) && styles.activeText,
          ]}
        >
          {content.day}
        </Text>
        <Text
          size="_12px"
          style={[
            styles.dayText,
            styles.dayStyle,
            isSelected(item) && styles.activeText,
          ]}
        >
          {` ${item}`}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={days}
      renderItem={renderItem}
      keyExtractor={(item) => item.toString()}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
    />
  );
};
