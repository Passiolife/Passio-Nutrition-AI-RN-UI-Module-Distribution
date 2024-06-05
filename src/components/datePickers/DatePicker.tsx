import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

interface Props {
  isDatePickerVisible: boolean;
  handleConfirm: (date: Date) => void;
  hideDatePicker: () => void;
  selectedDate: Date;
  mode?: 'datetime' | 'date' | 'time';
}

const DatePicker: React.FC<Props> = (props) => {
  const {
    isDatePickerVisible,
    handleConfirm,
    hideDatePicker,
    selectedDate,
    mode = 'date',
  } = props;
  return (
    <DateTimePickerModal
      testID="datePicker"
      isVisible={isDatePickerVisible}
      mode={mode}
      onConfirm={handleConfirm}
      onCancel={hideDatePicker}
      // locale="en_GB"
      date={selectedDate}
    />
  );
};

export default DatePicker;
