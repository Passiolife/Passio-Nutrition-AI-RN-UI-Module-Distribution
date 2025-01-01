import React, { useImperativeHandle } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { DatePicker, Text } from '..';
import { scaleHeight, scaledSize } from '../../utils';
import { useBranding, type Branding } from '../../contexts';
import { useDatePicker } from './useDatePicker';
import { DateTime } from 'luxon';

export interface TimeStampViewRef {
  getTimeStamp: () => string;
}

interface TimeStampProps {
  date: string; // ISO
  mode?: 'datetime' | 'date' | 'time';
  format?: string;
}

export const TimeStampView = React.forwardRef(
  (
    { format, mode, date }: TimeStampProps,
    ref: React.Ref<TimeStampViewRef> | any
  ) => {
    const styles = timeStampViewStyle(useBranding());

    const f = (format ?? mode === 'time') ? 'hh:mm a' : 'MMM dd, yyyy';

    useImperativeHandle(ref, () => {
      return {
        getTimeStamp: () => {
          return eventTimeStamp.toISOString();
        },
      };
    });

    const {
      eventTimeStamp,
      isOpenDatePicker,
      closeDatePicker,
      openDatePicker,
      handleConfirm,
    } = useDatePicker(date);

    return (
      <>
        <TouchableOpacity
          style={styles.timeStampContainer}
          activeOpacity={1}
          onPress={openDatePicker}
        >
          <Text weight="400" size="_16px" color="text" style={styles.dateText}>
            {DateTime.fromJSDate(eventTimeStamp).toFormat(f)}
          </Text>
        </TouchableOpacity>

        <DatePicker
          mode={mode}
          selectedDate={eventTimeStamp}
          isDatePickerVisible={isOpenDatePicker}
          handleConfirm={handleConfirm}
          hideDatePicker={closeDatePicker}
        />
      </>
    );
  }
);

const timeStampViewStyle = ({ border, white }: Branding) =>
  StyleSheet.create({
    timeStampContainer: {
      marginTop: scaleHeight(6),
      marginBottom: scaleHeight(12),
      paddingHorizontal: 19,
      borderColor: border,
      borderWidth: 1,
      backgroundColor: white,
      borderRadius: scaledSize(8),
    },
    dateText: {
      lineHeight: 18,
      paddingVertical: scaleHeight(12),
      alignSelf: 'flex-start',
    },
  });
