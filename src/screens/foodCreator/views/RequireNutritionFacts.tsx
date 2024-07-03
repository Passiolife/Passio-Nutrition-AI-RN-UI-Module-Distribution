import React, { useImperativeHandle, useRef, useState, useMemo } from 'react';
import { Card, FiledViewRef, Text } from '../../../components';
import { StyleSheet, View } from 'react-native';
import { Branding, useBranding } from '../../../contexts';
import { FiledView } from '../../../components';
import {
  FiledSelectionView,
  FiledSelectionViewRef,
} from '../../../components/filed/FiledSelectionView';
import { Units, Weights } from '../data';

interface Props {}

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
>(({}: Props, ref: React.Ref<RequireNutritionFactsRef>) => {
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
          currentRef?.errorCheck();
          if (value === undefined || value.length === 0) {
            isNotValid = true;
          }
          record[key] = value ?? '';
        });

        return {
          records: record,
          isNotValid,
        };
      },
    }),
    [refs]
  );

  return (
    <Card style={styles.card}>
      <View>
        <Text style={styles.title}>{'Required Nutrition Facts'}</Text>
        <FiledView ref={servingSizeRef} name="Serving Size" />
        <FiledSelectionView
          lists={Units}
          name="Units"
          ref={unitRef}
          onChange={(value) => setUnits(value)}
        />
        {units === 'g' || units === 'ml' ? null : (
          <FiledSelectionView ref={weightRef} lists={Weights} name="Weight" />
        )}
        <FiledView ref={caloriesRef} name="Calories" />
        <FiledView ref={fatRef} name="Fat" />
        <FiledView ref={carbsRef} name="Carbs" />
        <FiledView ref={proteinRef} name="Protein" />
      </View>
    </Card>
  );
});

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
