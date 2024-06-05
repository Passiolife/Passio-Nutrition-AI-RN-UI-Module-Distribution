import React from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Text } from '../../components';
import { COLORS } from '../../constants';

import { MacroView } from './MacroView';
import DoughnutChart from '../../components/doughnutChart/DoughnutChart';
import { useBranding } from '../../contexts';
import { ICONS } from '../../assets';
import { scaled } from '../../utils';

interface Config {
  totalCalories: number;
  carbs: number;
  protein: number;
  fat: number;
}

interface Props {
  config: Config;
  onEditMacro: () => void;
}

export const ProfileMacroInfo = ({ config, onEditMacro }: Props) => {
  const branding = useBranding();

  return (
    <View>
      <View>
        <View style={styles.cardHeader}>
          <Text weight="600" size="_16px" style={styles.macroHeading}>
            {'Daily Nutrition Goals'}
          </Text>
          <TouchableOpacity onPress={onEditMacro}>
            <Image
              source={ICONS.editGreyIc}
              resizeMode="contain"
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', marginTop: 16 }}>
          <View style={styles.calorieContainer}>
            <DoughnutChart
              data={[
                {
                  progress: config.carbs - 1 ?? 0,
                  color: branding.carbs,
                },
                {
                  progress: config.protein - 1 ?? 0,
                  color: branding.proteins,
                },
                {
                  progress: config.fat ?? 0,
                  color: branding.fat,
                },
              ]}
              size={100}
              gap={12}
            />
            <View style={styles.calorieItem}>
              <Text
                weight="700"
                size="_16px"
                color="calories"
                testID="testNutrientCalories"
              >
                {Math.round(config.totalCalories)}
              </Text>
              <Text weight="500" size="_14px" color="text">
                {'Calories'}
              </Text>
            </View>
          </View>
          <TouchableWithoutFeedback onPress={onEditMacro}>
            <View style={styles.infoMacroContainer}>
              <MacroView
                color="carbs"
                style={styles.macro}
                label="Carbs"
                valuePercentage={String(config.carbs)}
                valueGrams={String(
                  ((config.totalCalories ?? 0) * (config.carbs ?? 0)) / 100 / 4
                )}
                unit={'g'}
              />
              <MacroView
                color="proteins"
                style={styles.macro}
                label="Protein"
                valuePercentage={String(config.protein)}
                valueGrams={String(
                  ((config.totalCalories ?? 0) * (config.protein ?? 0)) /
                    100 /
                    4
                )}
                unit={'g'}
              />
              <MacroView
                color="fat"
                label="Fat"
                valuePercentage={String(config.fat)}
                valueGrams={String(
                  ((config.totalCalories ?? 0) * (config.fat ?? 0)) / 100 / 9
                )}
                unit={'g'}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </View>
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
