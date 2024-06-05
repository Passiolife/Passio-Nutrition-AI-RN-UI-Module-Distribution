import React, { useState } from 'react';
import { StyleSheet, View, Keyboard, Dimensions, Modal } from 'react-native';
import { BasicButton, ProgressSlider, Text, TextInput } from '../../components';
import { COLORS } from '../../constants';

import { scaled } from '../../utils';

interface Config {
  totalCalories: number;
  carbs: number;
  protein: number;
  fat: number;
}

interface Props {
  config: Config;
  onCloseModal: () => void;
  isShow: boolean;
  onChange: (
    carbs: number,
    protein: number,
    fat: number,
    calories: string
  ) => unknown;
}

export const MacroModal = ({
  config,
  onChange,
  isShow,
  onCloseModal,
}: Props) => {
  const newConfig: Config = config;
  const [calories, setCalories] = useState<number | undefined>(
    newConfig.totalCalories
  );
  const [macroCarbs, setMacroCarbs] = useState<number | undefined>(
    newConfig.carbs
  );
  const [macroProtein, setMacroProtein] = useState<number | undefined>(
    newConfig.protein
  );
  const [macroFat, setMacroFat] = useState<number | undefined>(newConfig.fat);

  const hideModal = () => {
    Keyboard.dismiss();
    onCloseModal();
  };

  const handleOk = () => {
    Keyboard.dismiss();
    onChange(
      macroCarbs ?? 0,
      macroProtein ?? 0,
      macroFat ?? 0,
      (calories ?? '').toString()
    );
    onCloseModal();
  };

  const calculateMacros = (values: Array<number | undefined>) => {
    let first = values[0] ?? 0;
    let second = values[1] ?? 0;
    let third = values[2] ?? 0;
    let remainder = 100 - (first + second + third);

    if (remainder < 0) {
      if (Math.abs(remainder) > second) {
        remainder = remainder + second;
        second = 0;
      } else {
        second = second + remainder;
        remainder = 0;
      }

      if (Math.abs(remainder) > third) {
        third = 0;
        second = 0;
      } else {
        third = third + remainder;
      }
    } else if (remainder > 0) {
      second = second + remainder;
    }

    return [first, second, third];
  };

  const handleMacroChange = (c?: number, p?: number, f?: number) => {
    if (typeof c !== 'undefined') {
      const normalizedMarcoValues = calculateMacros([
        c,
        macroProtein,
        macroFat,
      ]);
      setMacroCarbs(normalizedMarcoValues[0] ?? 0);
      setMacroProtein(normalizedMarcoValues[1] ?? 0);
      setMacroFat(normalizedMarcoValues[2] ?? 0);
    } else if (typeof p !== 'undefined') {
      const normalizedMarcoValues = calculateMacros([p, macroFat, macroCarbs]);
      setMacroCarbs(normalizedMarcoValues[2] ?? 0);
      setMacroProtein(normalizedMarcoValues[0] ?? 0);
      setMacroFat(normalizedMarcoValues[1] ?? 0);
    } else if (typeof f !== 'undefined') {
      const normalizedMarcoValues = calculateMacros([
        f,
        macroCarbs,
        macroProtein,
      ]);
      setMacroCarbs(normalizedMarcoValues[1] ?? 0);
      setMacroProtein(normalizedMarcoValues[2] ?? 0);
      setMacroFat(normalizedMarcoValues[0] ?? 0);
    }
  };

  return (
    <Modal
      transparent
      statusBarTranslucent
      visible={isShow}
      onRequestClose={hideModal}
    >
      <View style={styles.modalContentContainer}>
        <View style={styles.modalViewContentContainer}>
          <View style={styles.modalValuesContainer}>
            <Text weight="700" size="_20px" style={styles.macroModalHeading}>
              {'Daily Nutrition Target'}
            </Text>
            <Text weight="400" size="_14px" style={styles.macroModalHeading}>
              {'Move the sliders to adjust your targets'}
            </Text>

            <Text style={styles.caloriesTitle}>{'Calories'}</Text>
            <TextInput
              value={calories ? calories.toString() : ''}
              onChangeText={(value) => {
                setCalories(value.length > 0 ? Number(value) : undefined);
              }}
              style={styles.caloriesTextInput}
              placeholder="1,200 kcal"
              error={!calories ? 'Required' : ''}
              keyboardType="numeric"
              returnKeyLabel="Done"
              returnKeyType="done"
            />
            <View style={styles.macrosContainer}>
              <View style={styles.macro}>
                <Text style={styles.caloriesTitle}>{'Carbs'}</Text>
                <TextInput
                  value={macroCarbs ? macroCarbs.toString() : undefined}
                  onChangeText={(value) =>
                    setMacroCarbs(value.length > 0 ? Number(value) : undefined)
                  }
                  onSubmitEditing={() => {
                    handleMacroChange(
                      Number(macroCarbs && macroCarbs > 0 ? macroCarbs : 0),
                      undefined,
                      undefined
                    );
                  }}
                  style={styles.caloriesTextInput}
                  placeholder="0%"
                  keyboardType="numeric"
                  returnKeyLabel="Done"
                  returnKeyType="done"
                />
                <Text style={styles.nutrientGram}>
                  {String(
                    Math.round(((calories ?? 0) * (macroCarbs ?? 0)) / 100 / 4)
                  ) + ' g'}
                </Text>

                <View style={[styles.sliderStyle]}>
                  <ProgressSlider
                    sliderMaxValue={100}
                    sliderValue={macroCarbs ?? 0}
                    minimumTrackTintColor={'#6366F1'}
                    maximumTrackTintColor={'#EEF2FF'}
                    thumbTintColor={'#4F46E5'}
                    step={1}
                    onChangeSliderValue={(progress) => {
                      handleMacroChange(progress, undefined, undefined);
                    }}
                  />
                </View>
              </View>
              <View style={styles.macro}>
                <Text style={styles.caloriesTitle}>{'Protein'}</Text>
                <TextInput
                  value={macroProtein ? macroProtein.toString() : undefined}
                  onChangeText={(value) =>
                    setMacroProtein(
                      value.length > 0 ? Number(value) : undefined
                    )
                  }
                  onSubmitEditing={() => {
                    handleMacroChange(
                      undefined,
                      Number(
                        macroProtein && macroProtein > 0 ? macroProtein : 0
                      ),
                      undefined
                    );
                  }}
                  style={styles.caloriesTextInput}
                  placeholder="0%"
                  keyboardType="numeric"
                  returnKeyLabel="Done"
                  returnKeyType="done"
                />
                <Text style={styles.nutrientGram}>
                  {String(
                    Math.round(
                      ((calories ?? 0) * (macroProtein ?? 0)) / 100 / 4
                    )
                  ) + ' g'}
                </Text>

                <View style={[styles.sliderStyle]}>
                  <ProgressSlider
                    sliderMaxValue={100}
                    sliderValue={macroProtein ?? 0}
                    minimumTrackTintColor={'#6366F1'}
                    maximumTrackTintColor={'#EEF2FF'}
                    thumbTintColor={'#4F46E5'}
                    step={1}
                    onChangeSliderValue={(progress) => {
                      handleMacroChange(undefined, progress, undefined);
                    }}
                  />
                </View>
              </View>
              <View style={styles.macro}>
                <Text style={styles.caloriesTitle}>{'fat'}</Text>
                <TextInput
                  value={macroFat ? macroFat.toString() : undefined}
                  onChangeText={(value) =>
                    setMacroFat(value.length > 0 ? Number(value) : undefined)
                  }
                  onSubmitEditing={() => {
                    handleMacroChange(
                      undefined,
                      undefined,
                      Number(macroFat && macroFat > 0 ? macroFat : 0)
                    );
                  }}
                  style={styles.caloriesTextInput}
                  placeholder="0%"
                  keyboardType="numeric"
                  returnKeyLabel="Done"
                  returnKeyType="done"
                />

                <Text style={styles.nutrientGram}>
                  {String(
                    Math.round(((calories ?? 0) * (macroFat ?? 0)) / 100 / 9)
                  ) + ' g'}
                </Text>

                <View style={[styles.sliderStyle]}>
                  <ProgressSlider
                    sliderMaxValue={100}
                    sliderValue={macroFat ?? 0}
                    minimumTrackTintColor={'#6366F1'}
                    maximumTrackTintColor={'#EEF2FF'}
                    thumbTintColor={'#4F46E5'}
                    step={1}
                    onChangeSliderValue={(progress) => {
                      handleMacroChange(undefined, undefined, progress);
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <BasicButton
              style={styles.bottomActionButton}
              text="Cancel"
              small
              secondary
              onPress={hideModal}
            />
            <View style={styles.buttonSeparator} />
            <BasicButton
              style={styles.bottomActionButton}
              text="OK"
              small
              onPress={handleOk}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  macroHeading: {
    textAlign: 'left',
  },
  calorieItem: {
    alignItems: 'center',
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'column',
  },
  calorieContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calorieValueText: {
    fontWeight: '600',
    marginRight: 4,
  },
  calorieUnitText: {
    fontSize: 17,
    color: COLORS.grey6,
  },
  infoMacroContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  macrosContainer: {
    flexDirection: 'row',
    marginTop: 16,
    alignSelf: 'center',
  },
  macro: {
    flex: 1,
  },
  footer: {
    alignItems: 'center',
  },
  button: {},
  modal: {
    marginHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContentContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
  },
  modalViewContentContainer: {
    backgroundColor: 'white',
    alignContent: 'center',
    marginHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 20,
  },
  macroModalHeading: {
    textAlign: 'center',
    paddingVertical: 4,
  },
  caloriesTitle: {
    paddingTop: 20,
    textAlign: 'center',
  },
  nutrientGram: {
    paddingTop: 6,
    textAlign: 'center',
  },
  modalValuesContainer: {
    paddingTop: 20,
  },
  picker: {},
  pickerItem: {
    color: COLORS.grey7,
    fontSize: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 15,
  },
  calorieModelButtonContainer: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 15,
  },
  bottomActionButton: {
    flex: 1,
    borderRadius: 4,
    marginHorizontal: 8,
  },
  buttonSeparator: {},
  caloriesTextInput: {
    textAlign: 'center',
    alignSelf: 'center',
    paddingVertical: 8,
    minWidth: 50,
    backgroundColor: 'white',
    borderRadius: 4,
    marginTop: 4,
  },
  caloriesContainer: {
    borderRadius: 20,
    padding: 24,
    maxHeight: Dimensions.get('screen').height / 2,
    backgroundColor: 'white',
    paddingHorizontal: 15,
  },
  caloriesButtonAction: {
    flex: 1,
  },
  sliderStyle: {
    transform: [{ rotate: '-90deg' }],
    marginVertical: 50,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  editIcon: {
    ...scaled(16),
  },
});
