import React from 'react';
import { View } from 'react-native';
import {
  BackNavigation,
  BasicButton,
  Text,
  TextInput,
  TimeStampView,
} from '../../../../components';
import { withLoading } from '../../../../components/withLoading';
import { useBranding } from '../../../../contexts';
import waterScreenStyle from './../waterentry/WaterEntry.style';
import { useWaterEntry } from './useWaterEntry';

const WaterEntry = () => {
  const styles = waterScreenStyle(useBranding());
  const {
    consumed,
    isEdit,
    dateRef,
    timeRef,
    unitLabel,
    water,
    handlePressCancel,
    handlePressOk,
    handleWaterInput,
  } = useWaterEntry();

  return (
    <View style={styles.bodyContainer} testID="testView">
      <View style={styles.content}>
        <BackNavigation
          title={isEdit ? 'Edit Entry' : 'New Entry'}
          cardStyle={styles.cardStyle}
        />
        <View style={styles.formView}>
          <Text
            weight="500"
            size="_14px"
            color="text"
            style={styles.inputTitle}
          >
            {`Water Consumed (${unitLabel})`}
          </Text>
          <TextInput
            value={consumed}
            containerStyle={styles.containerTextInput}
            onChangeText={handleWaterInput}
            style={styles.textInput}
            returnKeyType="done"
            error={
              consumed?.toString() === '' || Number(consumed) <= 0
                ? 'Required'
                : ''
            }
            keyboardType="numeric"
          />
          <Text
            weight="500"
            size="_14px"
            color="text"
            style={styles.inputTitle}
          >
            {'Day'}
          </Text>
          <TimeStampView
            date={water?.day ?? new Date().toISOString()}
            ref={dateRef}
            mode="date"
          />
          <Text
            weight="500"
            size="_14px"
            color="text"
            style={styles.inputTitle}
          >
            {'Time'}
          </Text>
          <TimeStampView
            date={water?.time ?? new Date().toISOString()}
            ref={timeRef}
            mode="time"
          />
        </View>
      </View>

      <View style={styles.actionContainer}>
        <BasicButton
          style={styles.bottomActionButton}
          text="Cancel"
          small
          secondary
          onPress={handlePressCancel}
        />
        <View style={styles.buttonSeparator} />
        <BasicButton
          style={styles.bottomActionButton}
          text="Save"
          small
          onPress={handlePressOk}
        />
      </View>
    </View>
  );
};

export default withLoading(WaterEntry);
