import React from 'react';
import { View } from 'react-native';
import { CircularProgressNutritionTrackView } from './CircularProgressNutritionTrackView';
import styles from './styles';
import { useBranding } from '../../contexts';

interface MacroProgress {
  target: number;
  consumed: number;
}

interface MacrosProgressViewProps {
  calories: MacroProgress;
  carbs: MacroProgress;
  protein: MacroProgress;
  fat: MacroProgress;
}

const MacrosProgressView = (props: MacrosProgressViewProps) => {
  const { calories, carbs, protein, fat } = props;
  const {
    calories: calColor,
    carbs: cabColor,
    proteins: protColor,
    fat: fatColor,
  } = useBranding();
  return (
    <View style={styles.progressMainContainerStyle}>
      <CircularProgressNutritionTrackView
        record={calories.target}
        total={calories.consumed}
        stock={calColor}
        stock2={'rgba(120, 53, 15, 1)'}
        text={'Calories'}
      />
      <CircularProgressNutritionTrackView
        record={carbs.target}
        total={carbs.consumed}
        stock={cabColor}
        stock2={'rgba(12, 74, 110, 1)'}
        text={'Carbs'}
        unit="g"
      />
      <CircularProgressNutritionTrackView
        record={protein.target}
        total={protein.consumed}
        stock2={'rgba(6, 78, 59, 1)'}
        stock={protColor}
        unit="g"
        text={'Protein'}
      />
      <CircularProgressNutritionTrackView
        record={fat.target}
        unit="g"
        total={fat.consumed}
        stock2={'rgba(49, 46, 129, 1)'}
        stock={fatColor}
        text={'Fat'}
      />
    </View>
  );
};

export default MacrosProgressView;
