import { ScrollView, View } from 'react-native';

import React from 'react';
import { foodCreatorStyle } from './FoodCreator.styles';
import { useFoodCreator } from './useFoodCreator';
import { BackNavigation, BasicButton } from '../../components';
import { FoodCreatorFoodDetail } from './views/FoodCreatorFoodDetail';
import { RequireNutritionFacts } from './views/RequireNutritionFacts';
import { OtherNutritionFacts } from './views/OtherNutritionFacts';

export const FoodCreatorScreen = () => {
  const {
    branding,
    otherNutritionFactsRef,
    requireNutritionFactsRef,
    foodCreatorFoodDetailRef,
    foodLog,
    onSavePress,
  } = useFoodCreator();

  const styles = foodCreatorStyle(branding);

  return (
    <View style={styles.body}>
      <BackNavigation title="Food Creator" />
      <ScrollView style={{ flex: 1 }}>
        <View>
          <FoodCreatorFoodDetail
            foodLog={foodLog}
            ref={foodCreatorFoodDetailRef}
          />
          <RequireNutritionFacts
            foodLog={foodLog}
            ref={requireNutritionFactsRef}
          />

          <OtherNutritionFacts foodLog={foodLog} ref={otherNutritionFactsRef} />
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 22,
          marginHorizontal: 16,
        }}
      >
        <BasicButton
          text={'Cancel'}
          secondary
          style={{
            flexDirection: 'row',
            flex: 1,
            marginHorizontal: 8,
            height: 40,
          }}
        />
        <BasicButton
          text={'Save'}
          onPress={onSavePress}
          style={{
            flexDirection: 'row',
            flex: 1,
            marginHorizontal: 8,
            height: 40,
          }}
        />
      </View>
    </View>
  );
};
