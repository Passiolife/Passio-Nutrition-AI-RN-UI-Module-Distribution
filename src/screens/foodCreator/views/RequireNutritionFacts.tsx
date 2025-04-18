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
import { totalAmountOfNutrientForCustomFood } from '../../../screens/editFoodLogs';

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

    const servingUnits = defaultFoodLog?.selectedUnit
      ? [
          defaultFoodLog?.selectedUnit,
          ...Units.filter((i) => i !== defaultFoodLog?.selectedUnit),
        ]
      : Units;

    useEffect(() => {
      setFoodLog(defaultFoodLog);
      setUnits(defaultFoodLog?.selectedUnit ?? '');
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

            if (key === 'Weight') {
              const unit = units;
              if (isGramOrML(unit)) {
                record[key] =
                  record.ServingSize + WEIGHT_UNIT_SPLIT_IDENTIFIER + unit ??
                  '';
              } else {
                if (!isValidDecimalNumber(input)) {
                  isNotValid = true;
                }
                if (value === undefined || value.length === 0) {
                  isNotValid = true;
                }
                record[key] =
                  input + WEIGHT_UNIT_SPLIT_IDENTIFIER + value ?? '';
              }
            } else if (key === 'Units') {
              if (value === undefined || value.length === 0) {
                isNotValid = true;
              }
              record[key] = value ?? '';
            } else {
              if (
                value === undefined ||
                value.length === 0 ||
                !isValidDecimalNumber(value)
              ) {
                isNotValid = true;
              }
              record[key] = value?.replaceAll(',', '.') ?? '';
            }
          });

          return {
            records: record,
            isNotValid,
          };
        },
      }),
      [refs, units]
    );

    let calories;
    let fat;
    let carbs;
    let proteins;

    calories = foodLog?.foodItems
      ? totalAmountOfNutrientForCustomFood(foodLog?.foodItems ?? [], 'calories')
      : undefined;
    carbs = foodLog?.foodItems
      ? totalAmountOfNutrientForCustomFood(foodLog?.foodItems ?? [], 'carbs')
      : undefined;
    proteins = foodLog?.foodItems
      ? totalAmountOfNutrientForCustomFood(foodLog?.foodItems ?? [], 'protein')
      : undefined;
    fat = foodLog?.foodItems
      ? totalAmountOfNutrientForCustomFood(foodLog?.foodItems ?? [], 'fat')
      : undefined;

    return (
      <Card style={styles.card}>
        <View>
          <Text size="title" weight="600" style={styles.title}>
            {'Required Nutrition Facts'}
          </Text>
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
            lists={servingUnits}
            name="Units"
            value={foodLog?.selectedUnit}
            ref={unitRef}
            onChange={(value) => setUnits(value)}
          />
          {isGramOrML(units) ? null : (
            <FiledSelectionView
              isTextInput
              ref={weightRef}
              value={
                foodLog?.computedWeight?.unit ??
                foodLog?.foodItems?.[0]?.computedWeight?.unit ??
                'g'
              }
              input={(
                foodLog?.computedWeight?.value ??
                foodLog?.foodItems?.[0]?.computedWeight?.value ??
                ''
              ).toString()}
              lists={Weights}
              name="Weight"
            />
          )}
          <FiledView
            ref={caloriesRef}
            name="Calories (kcal)"
            value={Number.isFinite(calories) ? calories?.toString() : ''}
            keyboardType="decimal-pad"
          />
          <FiledView
            ref={fatRef}
            value={Number.isFinite(fat) ? fat?.toString() : ''}
            name="Fat (g)"
            keyboardType="decimal-pad"
          />
          <FiledView
            ref={carbsRef}
            value={Number.isFinite(carbs) ? carbs?.toString() : ''}
            name="Carbs (g)"
            keyboardType="decimal-pad"
          />
          <FiledView
            ref={proteinRef}
            value={Number.isFinite(proteins) ? proteins?.toString() : ''}
            name="Protein (g)"
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
