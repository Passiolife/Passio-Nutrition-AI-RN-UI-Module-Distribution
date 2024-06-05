import { useState } from 'react';
import type { HorizontalCalendarProps } from './HorizontalCalendar';

const MEAL_PLANS = 14;
export const useHorizontalCalendar = ({
  selectedDay,
  onSelectDayPress,
}: HorizontalCalendarProps) => {
  const [calendarSelectDate, setCalendarSelectDate] = useState(selectedDay);
  const onDayPress = (day: number) => {
    setCalendarSelectDate(day);
    onSelectDayPress(day);
  };
  const isSelected = (day: number) => {
    return day === selectedDay;
  };
  return {
    days: Array.from({ length: MEAL_PLANS }, (_, i) => i + 1),
    calendarSelectDate,
    onDayPress,
    isSelected,
  };
};
