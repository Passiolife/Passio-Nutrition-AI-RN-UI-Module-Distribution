import React from 'react';
import { View } from 'react-native';
import { CircularProgressNutritionTrackView } from './CircularProgressNutritionTrackView';
import styles from './styles';
import { useBranding } from '../../contexts';

interface MacroProgress {
  consumes: number;
  targeted: number;
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
        record={calories.consumes}
        total={calories.targeted}
        stock={calColor}
        stock2={'rgba(120, 53, 15, 1)'}
        text={'Calories'}
      />
      <CircularProgressNutritionTrackView
        record={carbs.consumes}
        total={carbs.targeted}
        stock={cabColor}
        stock2={'rgba(12, 74, 110, 1)'}
        text={'Carbs'}
        unit="g"
      />
      <CircularProgressNutritionTrackView
        record={protein.consumes}
        total={protein.targeted}
        stock2={'rgba(6, 78, 59, 1)'}
        stock={protColor}
        unit="g"
        text={'Protein'}
      />
      <CircularProgressNutritionTrackView
        record={fat.consumes}
        unit="g"
        total={fat.targeted}
        stock2={'rgba(49, 46, 129, 1)'}
        stock={fatColor}
        text={'Fat'}
      />
    </View>
  );
};

export default MacrosProgressView;
