import { ScrollView, View } from 'react-native';

import React from 'react';
import { foodCreatorStyle } from './FoodCreator.styles';
import { useFoodCreator } from './useFoodCreator';
import { BackNavigation } from '../../components';
import { FoodCreatorFoodDetail } from './views/FoodCreatorFoodDetail';
import { RequireNutritionFacts } from './views/RequireNutritionFacts';
import { OtherNutritionFacts } from './views/OtherNutritionFacts';

export const FoodCreatorScreen = () => {
  const { branding } = useFoodCreator();

  const styles = foodCreatorStyle(branding);

  return (
    <View style={styles.body}>
      <BackNavigation title="Food Creator" />
      <ScrollView>
        <View>
          <FoodCreatorFoodDetail />
          <RequireNutritionFacts />
          <OtherNutritionFacts />
        </View>
      </ScrollView>
    </View>
  );
};
