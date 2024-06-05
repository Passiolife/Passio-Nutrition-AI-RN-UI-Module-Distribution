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
import weightEntryStyle from './WeightEntry.style';
import { useWeightEntry } from './useWeightEntry';

const WeightEntry = () => {
  const styles = weightEntryStyle(useBranding());
  const {
    dateRef,
    prevWeight,
    timeRef,
    weight,
    isEdit,
    weightLabel,
    handlePressCancel,
    handlePressOk,
    handleWeightInput,
  } = useWeightEntry();

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
            {`Weight (${weightLabel})`}
          </Text>
          <TextInput
            value={weight}
            containerStyle={styles.containerTextInput}
            onChangeText={handleWeightInput}
            style={styles.textInput}
            returnKeyType="done"
            error={
              weight?.toString() === '' || Number(weight) <= 0 ? 'Required' : ''
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
            date={prevWeight?.day ?? new Date().toISOString()}
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
            date={prevWeight?.time ?? new Date().toISOString()}
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

export default withLoading(WeightEntry);
