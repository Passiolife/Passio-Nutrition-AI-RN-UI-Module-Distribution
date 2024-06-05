import { FlatList, StyleSheet } from 'react-native';
import React from 'react';
import type { FoodItem } from '../../../../models';
import RecipeView from '../../../editFoodLogs/views/ingredients/IngredientItemView';

interface Props {
  onIngredientPress: (foodItem: FoodItem) => unknown;
  deleteIngredientsItem: (foodItem: FoodItem) => unknown;
  foodItems: FoodItem[];
}

const IngredientsView = ({
  onIngredientPress,
  deleteIngredientsItem,
  foodItems,
}: Props) => {
  return (
    <FlatList
      contentContainerStyle={styles.ingredientFlatList}
      data={foodItems}
      renderItem={({ item }: { item: FoodItem }) => {
        return (
          <RecipeView
            deleteIngredientsItem={deleteIngredientsItem}
            foodItem={item}
            onPress={onIngredientPress}
          />
        );
      }}
      keyExtractor={(__: FoodItem, index: Number) => index.toString()}
      extraData={foodItems}
    />
  );
};

const styles = StyleSheet.create({
  ingredientFlatList: {
    marginHorizontal: 16,
    marginTop: 16,
  },
});

export default React.memo(IngredientsView);
