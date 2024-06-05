import { useState } from 'react';

export function useDatePicker(eventTimestamp: string) {
  const [isOpenDatePicker, setOpenDatePicker] = useState(false);
  const [eventTimeStamp, setEventTimeStamp] = useState<Date>(
    new Date(eventTimestamp)
  );

  const openDatePicker = () => {
    setOpenDatePicker(true);
  };

  const closeDatePicker = () => {
    setOpenDatePicker(false);
  };

  const updateEventTimeStamp = (updatedDate: Date) => {
    setEventTimeStamp(new Date(updatedDate));
    closeDatePicker();
  };

  return {
    isOpenDatePicker,
    eventTimeStamp,
    updateEventTimeStamp,
    openDatePicker,
    closeDatePicker,
  };
}
