import React, {
  useImperativeHandle,
  useRef,
  useState,
  useMemo,
  useEffect,
} from 'react';
import { Card, FiledViewRef, Text } from '../../../components';
import { StyleSheet, View } from 'react-native';
import { Branding, useBranding } from '../../../contexts';
import { FiledView } from '../../../components';
import {
  FiledSelectionView,
  FiledSelectionViewRef,
} from '../../../components/filed/FiledSelectionView';
import { Units, Weights } from '../data';
import {
  isGramOrML,
  isValidDecimalNumber,
  WEIGHT_UNIT_SPLIT_IDENTIFIER,
} from '../FoodCreator.utils';
import type { CustomFood } from '../../../models';

interface Props {
  foodLog?: CustomFood;
}

export type RequireNutritionFactsType =
  | 'calories'
  | 'ServingSize'
  | 'Units'
  | 'Weight'
  | 'Fat'
  | 'Carbs'
  | 'Protein';

interface Value {
  records: Record<RequireNutritionFactsType, string>;
  isNotValid?: boolean;
}

export interface RequireNutritionFactsRef {
  getValue: () => Value;
}

export const RequireNutritionFacts = React.forwardRef<
  RequireNutritionFactsRef,
  Props
>(
  (
    { foodLog: defaultFoodLog }: Props,
    ref: React.Ref<RequireNutritionFactsRef>
  ) => {
    const branding = useBranding();
    const styles = requireNutritionFactStyle(branding);

    const [units, setUnits] = useState<string>('');

    const servingSizeRef = useRef<FiledViewRef>(null);
    const caloriesRef = useRef<FiledViewRef>(null);
    const fatRef = useRef<FiledViewRef>(null);
    const carbsRef = useRef<FiledViewRef>(null);
    const proteinRef = useRef<FiledViewRef>(null);
    const unitRef = useRef<FiledSelectionViewRef>(null);
    const weightRef = useRef<FiledSelectionViewRef>(null);

    const [foodLog, setFoodLog] = useState(defaultFoodLog);

    useEffect(() => {
      setFoodLog(defaultFoodLog);
    }, [defaultFoodLog]);

    const refs = useMemo(
      () => ({
        ServingSize: servingSizeRef,
        Units: unitRef,
        Weight: weightRef,
        calories: caloriesRef,
        Fat: fatRef,
        Carbs: carbsRef,
        Protein: proteinRef,
      }),
      []
    );

    useImperativeHandle(
      ref,
      () => ({
        getValue: () => {
          let record: Record<RequireNutritionFactsType, string> = {} as Record<
            RequireNutritionFactsType,
            string
          >;
          let isNotValid = false;

          (Object.keys(refs) as RequireNutritionFactsType[]).forEach((key) => {
            const currentRef = refs[key].current;
            const value = currentRef?.value();
            const input = currentRef?.input?.();
            currentRef?.errorCheck();
            if (value === undefined || value.length === 0) {
              isNotValid = true;
            }

            if (key === 'Weight') {
              const unit = record.Units;

              if (isGramOrML(unit)) {
              } else {
                if (!isValidDecimalNumber(input)) {
                  isNotValid = true;
                }
                if (value === undefined || value.length === 0) {
                  isNotValid = true;
                }
              }

              record[key] = input + WEIGHT_UNIT_SPLIT_IDENTIFIER + value ?? '';
            } else {
              record[key] = value ?? '';
            }
          });

          return {
            records: record,
            isNotValid,
          };
        },
      }),
      [refs]
    );

    let calories;
    let fat;
    let carbs;
    let proteins;

    foodLog?.foodItems?.[0].nutrients.forEach((i) => {
      if (i.amount) {
        const amount = i.amount.toFixed(2).toString();
        if (i.id === 'calories') calories = amount;
        if (i.id === 'carbs') carbs = amount;
        if (i.id === 'protein') proteins = amount;
        if (i.id === 'fat') fat = amount;
      }
    });

    return (
      <Card style={styles.card}>
        <View>
          <Text style={styles.title}>{'Required Nutrition Facts'}</Text>
          <FiledView
            ref={servingSizeRef}
            name="Serving Size"
            value={
              foodLog?.selectedQuantity
                ? foodLog.selectedQuantity.toString()
                : ''
            }
          />
          <FiledSelectionView
            lists={Units}
            name="Units"
            value={foodLog?.selectedUnit}
            ref={unitRef}
            onChange={(value) => setUnits(value)}
          />
          {isGramOrML(units) ? null : (
            <FiledSelectionView
              isTextInput
              ref={weightRef}
              value={foodLog?.computedWeight?.unit}
              input={(foodLog?.computedWeight?.value ?? '').toString()}
              lists={Weights}
              name="Weight"
            />
          )}
          <FiledView
            ref={caloriesRef}
            name="Calories"
            value={calories}
            keyboardType="decimal-pad"
          />
          <FiledView
            ref={fatRef}
            value={fat}
            name="Fat"
            keyboardType="decimal-pad"
          />
          <FiledView
            ref={carbsRef}
            value={carbs}
            name="Carbs"
            keyboardType="decimal-pad"
          />
          <FiledView
            ref={proteinRef}
            value={proteins}
            name="Protein"
            keyboardType="decimal-pad"
          />
        </View>
      </Card>
    );
  }
);

const requireNutritionFactStyle = ({}: Branding) =>
  StyleSheet.create({
    card: {
      marginHorizontal: 16,
      marginVertical: 16,
      padding: 16,
    },
    title: {
      marginBottom: 16,
    },
  });
