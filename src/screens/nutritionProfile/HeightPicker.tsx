import React, { useCallback, useEffect, useState } from 'react';
import {
  Dimensions,
  Keyboard,
  Platform,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  TouchableHighlight,
  View,
} from 'react-native';

import { BasicButton, Text, TextInput } from '../../components';
import { COLORS } from '../../constants';
import Modal from 'react-native-modal';
import { convertCMToFeet, convertCMToMeters } from './unitConversions';
import { Picker } from '@react-native-picker/picker';

const { height } = Dimensions.get('window');

interface Props {
  style?: StyleProp<TextStyle>;
  value: number; // value in centimeters
  error?: string;
  onChange: (centimeters: number) => unknown;
  unit?: 'imperial' | 'metric';
}

export const HeightPicker: React.FC<Props> = ({
  style,
  onChange,
  value,
  error,
  unit = 'imperial',
}) => {
  const heightImperial = convertCMToFeet(value);
  const heightMetric = convertCMToMeters(value);

  const [feet, setFeet] = useState(Math.floor(heightImperial.feet));
  const [inches, setInches] = useState(Math.floor(heightImperial.inches));
  const [meters, setMeters] = useState(Math.floor(heightMetric.meters));
  const [centimeters, setCentimeters] = useState(
    Math.floor(heightMetric.centimeters)
  );
  const [isVisible, setVisibility] = useState(false);
  const [totalCentimeter, setTotalCentemeter] = useState(0);

  const hidePicker = () => {
    Keyboard.dismiss();
    setVisibility(false);
  };
  const onPressOkBtn = () => {
    onChange(totalCentimeter);
    Keyboard.dismiss();
    setVisibility(false);
  };
  const [feetOptions] = useState(
    Array.apply(null, Array(9)).map((_n, index) => ({
      label: index + "'",
      value: index,
    }))
  );
  const [inchesOptions] = useState(
    Array.apply(null, Array(12)).map((_n, index) => ({
      label: index + '"',
      value: index,
    }))
  );

  const [meterOptions] = useState(
    Array.apply(null, Array(3)).map((_n, index) => ({
      label: index + 'm',
      value: index,
    }))
  );
  const [cmOptions] = useState(
    Array.apply(null, Array(100)).map((_n, index) => ({
      label: index + 'cm',
      value: index,
    }))
  );

  const updateHeightVal = useCallback(() => {
    const { feet: convertedFeet, inches: convertedInch } =
      convertCMToFeet(value);
    setFeet(Math.floor(convertedFeet));
    setInches(Math.floor(convertedInch));
    const { meters: convertedMeters, centimeters: convertedCentimeters } =
      convertCMToMeters(value);
    setMeters(Math.floor(convertedMeters));
    setCentimeters(Math.floor(convertedCentimeters));
  }, [value]);

  const showPicker = () => {
    Keyboard.dismiss();
    setVisibility(true);
    updateHeightVal();
  };

  useEffect(() => {
    updateHeightVal();
  }, [updateHeightVal]);

  const onChangeFeet = (f: number) => {
    const totalInches = f * 12 + Number(inches);
    setTotalCentemeter(totalInches * 2.54);
    setFeet(f);
  };

  const onChangeInches = useCallback(
    (i: number) => {
      const totalInches = feet * 12 + Number(i);
      setTotalCentemeter(totalInches * 2.54);
      setInches(i);
    },
    [feet]
  );

  const onChangeMeters = (m: number) => {
    const totalCentimeters = m * 100 + centimeters;
    setMeters(m);
    setTotalCentemeter(totalCentimeters);
  };

  const onChangeCentimeters = (cm: number) => {
    const totalCentimeters = meters * 100 + cm;
    setCentimeters(cm);
    setTotalCentemeter(totalCentimeters);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight
        onPress={showPicker}
        underlayColor={COLORS.transparent}
      >
        <TextInput
          value={
            unit === 'imperial'
              ? Math.floor(convertCMToFeet(value).feet) +
                "'" +
                Math.floor(convertCMToFeet(value).inches) +
                '" '
              : Math.floor(convertCMToMeters(value).meters) +
                'm ' +
                Math.floor(convertCMToMeters(value).centimeters) +
                'cm'
          }
          placeholder="Select"
          placeholderTextColor="grey"
          pointerEvents={'none'}
          editable={false}
          style={[
            style,

            {
              color: 'black',
            },
          ]}
          error={error}
        />
      </TouchableHighlight>
      <Modal
        backdropOpacity={0.4}
        style={styles.modal}
        onBackdropPress={() => {
          setVisibility(false);
        }}
        isVisible={isVisible}
      >
        <View style={styles.modalContentContainer}>
          <Text style={styles.title}>{'Height'}</Text>

          <View style={styles.modalValuesContainer}>
            <View style={styles.pickerRow}>
              {unit === 'imperial' && (
                <Picker
                  style={styles.picker}
                  selectedValue={feet}
                  itemStyle={styles.pickerItem}
                  onValueChange={onChangeFeet}
                >
                  {feetOptions.map((feetOption) => (
                    <Picker.Item
                      label={feetOption.label}
                      value={feetOption.value}
                      key={feetOption.value}
                    />
                  ))}
                </Picker>
              )}
              {unit === 'metric' && (
                <Picker
                  style={styles.picker}
                  selectedValue={meters}
                  itemStyle={styles.pickerItem}
                  onValueChange={onChangeMeters}
                >
                  {meterOptions.map((meterOption) => (
                    <Picker.Item
                      label={meterOption.label}
                      value={meterOption.value}
                      key={meterOption.value}
                    />
                  ))}
                </Picker>
              )}

              {unit === 'imperial' && (
                <Picker
                  style={styles.picker}
                  selectedValue={inches}
                  itemStyle={styles.pickerItem}
                  onValueChange={onChangeInches}
                >
                  {inchesOptions.map((option) => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              )}
              {unit === 'metric' && (
                <Picker
                  style={styles.picker}
                  selectedValue={centimeters}
                  itemStyle={styles.pickerItem}
                  onValueChange={onChangeCentimeters}
                >
                  {cmOptions.map((option) => (
                    <Picker.Item
                      label={option.label}
                      value={option.value}
                      key={option.value}
                    />
                  ))}
                </Picker>
              )}
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <BasicButton
              style={styles.bottomActionButton}
              text="Cancel"
              small
              secondary
              onPress={hidePicker}
            />
            <View style={styles.buttonSeparator} />
            <BasicButton
              style={styles.bottomActionButton}
              text="OK"
              small
              onPress={onPressOkBtn}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentContainer: {
    width: 314,
    borderRadius: 20,
    backgroundColor: 'white',
    paddingHorizontal: 12,
  },
  title: {
    marginTop: 20,
    fontSize: 22,
    color: COLORS.blue,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalValuesContainer: {
    // paddingTop: 20,
    // backgroundColor: "red",
  },
  pickerRow: {
    ...Platform.select({
      ios: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 'auto',
      },
      android: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: height / 10,
      },
    }),
  },
  picker: {
    // height: 180,
    // flex: 1,
    width: 100,
  },
  pickerItem: {
    // backgroundColor: "pink",
    color: COLORS.grey7,
    fontSize: 15,
    height: 100,
    // height: 30,
    // padding: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 20,
  },
  bottomActionButton: {
    flex: 1,
  },
  buttonSeparator: {
    width: 22,
  },
});
