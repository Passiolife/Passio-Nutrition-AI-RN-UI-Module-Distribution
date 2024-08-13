import {
  type KeyboardTypeOptions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { BasicButton, Text } from '../../../components';
import React, { useState } from 'react';

import { EditValueAlertPrompt } from '../alerts/UpdateNutrtionUnitValueAlert';
import type { NutritionFacts } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { useBranding } from '../../../contexts/branding/BrandingContext';

interface Props {
  nutritionFact: NutritionFacts;
  onCancel: () => void;
  onPreventToUpdatingNutritionFact: () => void;
  onNext: (nutritionFact: NutritionFacts, name: string) => void;
}

export type EditNutritionUnitAlertType =
  | 'editServingSizeAlert'
  | 'editCaloriesAlert'
  | 'editFatAlert'
  | 'editCarbAlert'
  | 'editProteinAlert';

// Nutrition facts scanned from the nutrition label on a package food item
const NutritionFactView = (props: Props) => {
  const { primaryColor } = useBranding();
  const copyOfNutritionFact = { ...props.nutritionFact };
  const [openEditAlertType, setEditOpenEditAlertType] =
    useState<EditNutritionUnitAlertType | null>(null);
  const [nutrientAlertValue] = useState<string | number | undefined>(undefined);
  const [nutrientAlertTitle] = useState<string>('');
  const [keyboardType] = useState<KeyboardTypeOptions | undefined>();

  const dismissNutrientEditAlert = () => {
    setEditOpenEditAlertType(null);
  };

  const BottomActionView = () => {
    return (
      <View style={bottomActionStyle.bottomActionContainer}>
        <BasicButton
          style={bottomActionStyle.bottomActionButton}
          text="Cancel"
          small
          secondary
          boarderColor={primaryColor}
          onPress={props.onCancel}
        />
        <BasicButton
          style={bottomActionStyle.bottomActionButton}
          text="Next"
          small
          secondary={false}
          onPress={() => props.onNext(props.nutritionFact, '')}
        />
      </View>
    );
  };

  const NutritionUnitAmountView = ({
    title,
    unit,
    amount,
  }: {
    title: string;
    unit?: string;
    amount: number | undefined | string;
    alertType: EditNutritionUnitAlertType;
    keyboardTypeOptions?: KeyboardTypeOptions;
  }) => {
    return (
      <TouchableOpacity style={styles.nutritionItemContainer}>
        <Text
          weight="600"
          color="primaryColor"
          size="_16px"
          style={styles.nutritionItemUnitText}
        >
          {amount ?? '?'}{' '}
          {unit && (
            <Text
              weight="400"
              size="_14px"
              color="secondaryText"
              style={styles.nutritionItemUnitText}
            >
              {unit}
            </Text>
          )}
        </Text>
        <Text weight="400" size="_14px" style={styles.nutritionItemUnitText}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const render = () => {
    return (
      <View style={styles.cardContainer}>
        <Text weight="600" size="_18px" style={[styles.titleText]}>
          Nutrition Facts
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          <NutritionUnitAmountView
            title={'Calories'}
            alertType={'editCaloriesAlert'}
            amount={copyOfNutritionFact.calories}
            keyboardTypeOptions="numeric"
          />

          <NutritionUnitAmountView
            title={'Carb'}
            unit={'g'}
            alertType={'editCarbAlert'}
            amount={copyOfNutritionFact.carbs}
            keyboardTypeOptions="numeric"
          />
          <NutritionUnitAmountView
            title={'Protein'}
            alertType={'editProteinAlert'}
            unit={'g'}
            amount={copyOfNutritionFact.protein}
            keyboardTypeOptions="numeric"
          />
          <NutritionUnitAmountView
            title={'Fat'}
            unit={'g'}
            alertType={'editFatAlert'}
            amount={copyOfNutritionFact.fat}
            keyboardTypeOptions="numeric"
          />
        </View>

        <BottomActionView />
        {openEditAlertType != null ? (
          <EditValueAlertPrompt
            onSave={() => {}}
            onClose={dismissNutrientEditAlert}
            keyboardType={keyboardType}
            isVisible={true}
            defaultValue={nutrientAlertValue?.toString() ?? ''}
            message={
              'Automatic detection was stopped, all values can be edited manually if needed'
            }
            title={nutrientAlertTitle}
            hint={'Enter value'}
          />
        ) : null}
      </View>
    );
  };
  return render();
};

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
  },
  titleText: {
    alignSelf: 'center',
    paddingVertical: 0,
    paddingBottom: 16,
  },
  nutritionItemContainer: {},
  nutritionItemUnitText: {
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  nutritionItemAmountText: {
    fontSize: 16,
    fontWeight: '600',
    paddingHorizontal: 24,
  },
});

const bottomActionStyle = StyleSheet.create({
  bottomActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 16,
    marginBottom: 24,
    marginHorizontal: 16,
  },
  bottomActionButton: {
    flex: 1,
    marginHorizontal: 8,
    justifyContent: 'center',
  },
});

export default React.memo(NutritionFactView);
