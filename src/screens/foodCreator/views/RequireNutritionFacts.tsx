import React from 'react';
import { Card, Text } from '../../../components';
import { StyleSheet, View } from 'react-native';
import { Branding, useBranding } from '../../../contexts';
import { FiledView } from './FiledView';
import { FiledSelectionView } from './FiledSelectionView';
import { Units, Weights } from '../data';

interface Props {}

export const RequireNutritionFacts = ({}: Props) => {
  const branding = useBranding();

  const styles = requireNutritionFactStyle(branding);

  return (
    <Card style={styles.card}>
      {
        <View>
          <Text style={styles.title}>{'Required Nutrition Facts'}</Text>
          <FiledView name="Serving Size" />
          <FiledSelectionView lists={Units} name="Units" />
          <FiledSelectionView lists={Weights} name="Weight" />
          <FiledView name="Calories" />
          <FiledView name="Fat" />
          <FiledView name="Carbs" />
          <FiledView name="Protein" />
        </View>
      }
    </Card>
  );
};

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
