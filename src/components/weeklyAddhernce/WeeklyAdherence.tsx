import { DateTime, Info } from 'luxon';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBranding, useServices, type Branding } from '../../contexts';
import { ICONS } from '../../assets';
import { Text } from '../texts';
import { scaleHeight, scaledSize } from '../../utils';
import { Card } from '../cards';
import { getMealLogsFormDateToDate } from '../../utils/DataServiceHelper';

interface Props {
  headerDate: DateTime;
  onDateClick: (date: string | null) => void;
}

interface DayItem {
  day: string | undefined;
  isoDate: string | null;
  isCurrentMonth: boolean;
}

const WeeklyAdherence = ({ headerDate, onDateClick }: Props) => {
  const branding = useBranding();
  const styles = calderComponentStyle(branding);

  // Get short names of weekdays
  const days = Info.weekdaysFormat('short', { locale: 'en' });
  // State variables
  const [calendarViewMode, setCalendarViewMode] = useState<'month' | 'week'>(
    'week'
  ); // View mode: 'week' or 'month'
  const [currentWeekStart, setCurrentWeekStart] = useState<DateTime>(
    headerDate.startOf('week')
  ); // Start of the current week
  const [currentMonth, setCurrentMonth] = useState<DateTime>(
    headerDate.startOf('month')
  ); // Start of the current month

  const [logDates, setLogDates] = useState<string[]>([]); // Start of the current month

  const service = useServices();

  const visibleDateRef = useRef(DateTime.now());

  useEffect(() => {
    setCurrentWeekStart(headerDate.startOf('week'));
    visibleDateRef.current = headerDate;
  }, [headerDate]);

  useEffect(() => {
    setCurrentMonth(headerDate.startOf('month'));
    visibleDateRef.current = headerDate;
  }, [headerDate]);

  const getLogStatus = useCallback(
    (startDate: DateTime, endDate: DateTime) => {
      const newLogs: string[] = [];
      getMealLogsFormDateToDate(
        startDate.toJSDate(),
        endDate.toJSDate(),
        service
      ).then((item) => {
        item.forEach((i) => {
          newLogs.push(
            DateTime.fromISO(i.eventTimestamp).toFormat('yyyy-MM-dd')
          );
        });
        setLogDates(newLogs);
      });
    },
    [service]
  );

  useEffect(() => {
    const startDate = visibleDateRef.current.startOf('month');
    const endDate = visibleDateRef.current.endOf('month');
    getLogStatus(startDate, endDate);
  }, [calendarViewMode, getLogStatus]);

  // Function to navigate to the previous period (week or month)
  const navigateToPrevious = useCallback(() => {
    if (calendarViewMode === 'week') {
      setCurrentWeekStart(currentWeekStart.minus({ weeks: 1 }));
      visibleDateRef.current = currentWeekStart;
      // Update currentMonth if the previous week is in a different month
      if (currentWeekStart.minus({ weeks: 1 }).month !== currentMonth.month) {
        setCurrentMonth(currentMonth.minus({ months: 1 }));
        visibleDateRef.current = currentMonth;
      }
    } else {
      setCurrentMonth(currentMonth.minus({ months: 1 }));
      visibleDateRef.current = currentMonth;
    }
  }, [calendarViewMode, currentWeekStart, currentMonth]);

  // Function to navigate to the next period (week or month)
  const navigateToNext = useCallback(() => {
    if (calendarViewMode === 'week') {
      setCurrentWeekStart(currentWeekStart.plus({ weeks: 1 }));
      visibleDateRef.current = currentWeekStart;
      // Update currentMonth if the next week is in a different month
      if (currentWeekStart.plus({ weeks: 1 }).month !== currentMonth.month) {
        setCurrentMonth(currentMonth.plus({ months: 1 }));
        visibleDateRef.current = currentMonth;
      }
    } else {
      setCurrentMonth(currentMonth.plus({ months: 1 }));
      visibleDateRef.current = currentMonth;
    }
  }, [calendarViewMode, currentWeekStart, currentMonth]);

  // Function to check if a date is today
  const isToday = (date: string | null) => {
    return DateTime.fromISO(date ?? '').hasSame(headerDate, 'day');
  };

  // Function to format a date
  const formatDate = (date: string | null) => {
    return DateTime.fromISO(date ?? '').toFormat('yyyy/MM/dd');
  };

  // Function to render the dates for the current week
  const renderWeekDates = useCallback(() => {
    const weekDatesArray: DayItem[] = [];
    for (let i = 0; i < 7; i++) {
      const weekDate = currentWeekStart.plus({ days: i });
      const isoDate = weekDate.toISODate();
      const data: DayItem = {
        day: days[i],
        isoDate: isoDate ?? ' ',
        isCurrentMonth: false,
      };
      weekDatesArray.push(data);
    }
    return weekDatesArray;
  }, [currentWeekStart, days]);

  // Function to render the dates for the current month
  const renderMonthDates = () => {
    const monthDatesArray = [];
    const startOfMonth = currentMonth.startOf('month');
    const endOfMonth = currentMonth.endOf('month');
    const numberOfDaysInMonth = currentMonth.daysInMonth;
    const startWeekday = startOfMonth.weekday; // Starting day of the month (1 for Monday, 7 for Sunday)
    const endWeekday = endOfMonth.weekday; // Ending day of the month (1 for Monday, 7 for Sunday)

    // Initialize an array to hold dates for each weekday
    const weekDayDates = Array.from({ length: 7 }, (_, i) => {
      // Calculate the date of the first box (could be from previous month)
      const date = startOfMonth.minus({ days: startWeekday - i - 1 });
      return { day: days[i], isoDate: date.toISODate(), isCurrentMonth: false };
    });

    // Loop through each day of the month
    for (let i = 0; i < (numberOfDaysInMonth ?? 0); i++) {
      const currentDate = startOfMonth.plus({ days: i });

      // Determine the weekday index (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
      const weekdayIndex = (currentDate.weekday - 1 + 7) % 7; // Convert 1-based index to 0-based index

      // Push the date into the corresponding weekday array
      weekDayDates[startWeekday - 1 + i] = {
        day: days[weekdayIndex], // Get the weekday name
        isoDate: currentDate.toISODate(),
        isCurrentMonth: true,
      };
    }

    // Set subsequent empty boxes to the next month's dates
    let nextMonthDate = endOfMonth.plus({ days: 1 });
    for (let i = endWeekday; i < 7; i++) {
      weekDayDates.push({
        day: days[i],
        isoDate: nextMonthDate.toISODate(),
        isCurrentMonth: false,
      });
      nextMonthDate = nextMonthDate.plus({ days: 1 });
    }

    // Flatten the array of arrays into a single array of objects
    monthDatesArray.push(...weekDayDates);

    return monthDatesArray;
  };

  // Function to toggle between week and month view
  const toggleCalendarView = () => {
    if (calendarViewMode === 'month') {
      setCurrentWeekStart(headerDate.startOf('week'));
      visibleDateRef.current = currentWeekStart;
      setCalendarViewMode('week');
    } else {
      const currentStartOfMonth = headerDate.startOf('month');
      visibleDateRef.current = currentStartOfMonth;
      setCurrentMonth(currentStartOfMonth);
      setCalendarViewMode('month');
    }
  };

  // Function to render the header based on the view mode
  const renderHeader = () => {
    const startDate = renderWeekDates()?.[0]?.isoDate;
    const endDate = renderWeekDates()?.[6]?.isoDate;

    if (calendarViewMode === 'month') {
      return (
        <Text weight="600" size="secondlyTitle" style={styles.dateContainer}>
          {currentMonth.toFormat('MMMM yyyy')}
        </Text>
      );
    } else {
      return (
        <>
          {renderWeekDates()[0]?.isoDate && renderWeekDates()[6]?.isoDate ? (
            <Text weight="600" size="_14px" style={styles.dateContainer}>
              {startDate && endDate
                ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                : ''}
            </Text>
          ) : null}
        </>
      );
    }
  };

  const renderDays = () => {
    return (
      <View style={styles.days}>
        {days.map((day, index) => {
          return (
            <Text
              weight={'500'}
              size={'_14px'}
              key={index}
              style={styles.dayText}
            >
              {day}
            </Text>
          );
        })}
      </View>
    );
  };

  const getDateStatus = (date: string) => {
    const status: 'Missed' | 'Logged' | 'Future' = 'Missed';
    if (logDates.find((i) => i === date) !== undefined) {
      return 'Logged';
    } else if (
      DateTime.fromFormat(date, 'yyyy-MM-dd').diffNow('day').days > 0
    ) {
      return 'Future';
    }
    return status;
  };

  const renderItem = ({ index, item }: { index: number; item: DayItem }) => {
    const status = getDateStatus(item.isoDate ?? '');
    return (
      <View style={styles.itemBox} key={index}>
        <TouchableOpacity
          style={[
            styles.itemBg,
            status === 'Missed' && styles.missedDate,
            status === 'Logged' && styles.loggedDate,
            isToday(item.isoDate) && styles.todayDateBg,
          ]}
          onPress={() => {
            onDateClick?.(item.isoDate);
          }}
        >
          <Text
            weight="600"
            size="_12px"
            style={[
              styles.itemText,
              isToday(item.isoDate) && styles.todayDateText,
            ]}
          >
            {DateTime.fromISO(item.isoDate ?? '').day}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Card style={styles.macroContainer}>
      <View style={styles.macroTitleContainer}>
        <Image source={ICONS.weeklyAdherence} style={styles.headerBodyIcon} />
        <Text weight="600" size="title" style={styles.macroTitle}>
          {'Weekly Adherence'}
        </Text>
        <TouchableOpacity onPress={toggleCalendarView}>
          <Image
            source={calendarViewMode === 'month' ? ICONS.up : ICONS.down}
            style={styles.arrow}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.calendarView}>
        <View style={styles.actionView}>
          <TouchableOpacity onPress={navigateToPrevious}>
            <Image source={ICONS.left} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>{renderHeader()}</TouchableOpacity>
          <TouchableOpacity onPress={navigateToNext}>
            <Image source={ICONS.right} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <FlatList
          ListHeaderComponent={renderDays}
          numColumns={7}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          renderItem={renderItem}
          data={
            calendarViewMode === 'week' ? renderWeekDates() : renderMonthDates()
          }
        />
      </View>
    </Card>
  );
};

export default WeeklyAdherence;

const calderComponentStyle = ({ primaryColor, indigo50 }: Branding) =>
  StyleSheet.create({
    calendarView: {
      flex: 1,
      padding: 16,
    },
    actionView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginHorizontal: 16,
    },
    dateContainer: {},
    days: {
      flexDirection: 'row',
      marginTop: 24,
      alignSelf: 'center',
      textAlign: 'center',
      alignItems: 'center',
      flex: 1,
    },
    itemText: {},
    dayText: {
      flex: 1,
      textAlign: 'center',
    },
    itemBox: {
      flex: 1,
      alignItems: 'center',
      marginTop: 16,
    },
    itemBg: {
      backgroundColor: indigo50,
      borderRadius: 17,
      height: 34,
      width: 34,
      alignItems: 'center',
      justifyContent: 'center',
    },
    todayDateBg: {
      backgroundColor: primaryColor,
    },
    loggedDate: {
      backgroundColor: 'rgba(209, 250, 229, 1)',
    },
    missedDate: {
      backgroundColor: 'rgba(254, 226, 226, 1)',
    },
    todayDateText: {
      color: '#FFF',
    },
    icon: {
      width: 24,
      height: 24,
      tintColor: primaryColor,
    },
    macroContainer: {},
    macroTitle: {
      flex: 1,
      marginStart: scaleHeight(8),
    },
    macroTitleContainer: {
      marginTop: scaleHeight(16),
      marginHorizontal: scaleHeight(16),
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },

    headerBodyIcon: {
      height: scaledSize(24),
      width: scaledSize(24),
      tintColor: primaryColor,
    },
    arrow: {
      height: scaledSize(24),
      width: scaledSize(24),
    },
  });
