import { DateTime } from 'luxon';
import { useCallback, useState } from 'react';
import { SwitchTabLabelEnum } from '../../types/myProgress';

let toDay = DateTime.now();
type callback = (startDate: Date, end: Date, type: SwitchTabLabelEnum) => void;

interface Props {
  onDateSelect: callback;
}

const getWeekData = (date: DateTime) => {
  const startOfWeek = date.startOf('week');
  const endOfWeek = date.endOf('week');
  let weekLabel = '';
  if (
    startOfWeek.hasSame(DateTime.now(), 'week') &&
    endOfWeek.hasSame(DateTime.now(), 'week')
  ) {
    weekLabel = 'This Week';
  } else {
    weekLabel = `${startOfWeek.toFormat('MM/dd/yy')} - ${endOfWeek.toFormat('MM/dd/yy')}`;
  }

  return {
    start: startOfWeek,
    end: endOfWeek,
    weekLabel: weekLabel,
  };
};

export const useCalendarCarousel = ({ onDateSelect }: Props) => {
  const { start, end, weekLabel } = getWeekData(DateTime.now());
  const [startDate, setStartDate] = useState<Date>(start.toJSDate());
  const [endDate, setEndDate] = useState<Date>(end.toJSDate());
  const [label, setLabel] = useState<string>(weekLabel);
  const [calendarType, setCalendarType] = useState<SwitchTabLabelEnum>(
    SwitchTabLabelEnum.Week
  );

  const updateMonth = useCallback(
    (date: DateTime, type: SwitchTabLabelEnum) => {
      const newStartDate = date.startOf('month').toJSDate();
      const newEndDate = date.endOf('month').toJSDate();
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      if (date.month === toDay.month && date.year === toDay.year) {
        setLabel('This Month');
      } else if (date.year === toDay.year) {
        setLabel(date.toFormat('MMM'));
      } else {
        setLabel(date.toFormat('MMM ,yyyy'));
      }
      onDateSelect(newStartDate, newEndDate, type);
    },
    [onDateSelect]
  );

  const updateWeek = useCallback(
    (date: DateTime, type: SwitchTabLabelEnum) => {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const { start, end, weekLabel } = getWeekData(date);
      setStartDate(start.toJSDate());
      setEndDate(end.toJSDate());
      setLabel(weekLabel);
      onDateSelect(start.toJSDate(), end.toJSDate(), type);
    },
    [onDateSelect]
  );

  const onLeftPress = useCallback(() => {
    if (calendarType === SwitchTabLabelEnum.Month) {
      let dateTime = DateTime.fromJSDate(startDate);
      const pastMonth = dateTime.minus({ months: 1 });
      updateMonth(pastMonth, calendarType);
    } else {
      let dateTime = DateTime.fromJSDate(startDate);
      const pastWeek = dateTime.minus({ weeks: 1 });
      updateWeek(pastWeek, calendarType);
    }
  }, [calendarType, startDate, updateMonth, updateWeek]);

  const onRightPress = useCallback(() => {
    if (calendarType === SwitchTabLabelEnum.Month) {
      let dateTime = DateTime.fromJSDate(endDate);
      const nextMonth = dateTime.plus({ months: 1 });
      updateMonth(nextMonth, calendarType);
    } else {
      let dateTime = DateTime.fromJSDate(endDate);
      const nextWeek = dateTime.plus({ weeks: 1 });
      updateWeek(nextWeek, calendarType);
    }
  }, [endDate, calendarType, updateMonth, updateWeek]);

  const onChangeSwitchTab = useCallback(
    (val: SwitchTabLabelEnum) => {
      setCalendarType(val);
      if (val === SwitchTabLabelEnum.Month) {
        updateMonth(DateTime.fromJSDate(startDate), val);
      } else {
        updateWeek(DateTime.now(), val);
      }
    },
    [startDate, updateMonth, updateWeek]
  );

  return {
    selectedSwitch: calendarType,
    startDate,
    endDate,
    label,
    onLeftPress,
    onRightPress,
    onChangeSwitchTab,
    calendarType,
  };
};
