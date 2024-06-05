import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import type { Recipe } from 'src/models';
import RecipeItemView from './RecipeItemView';
import { COLORS } from '../../../../constants';

export interface RecipesListViewProp {
  recipes: Recipe[];
  onLogItemPress: (item: Recipe) => void;
  onRecipePress: (item: Recipe) => void;
  onDeleteFoodRecipe?: (item: Recipe) => void;
  deleteRecipe: (item: Recipe) => void;
}

const MyRecipesView = (props: RecipesListViewProp) => {
  const renderRecipeList = (recipe: Recipe) => {
    return (
      <RecipeItemView
        recipe={recipe}
        onLogItemPress={props.onLogItemPress}
        onRecipePress={props.onRecipePress}
        onDeleteFoodRecipe={props.onDeleteFoodRecipe}
        deleteRecipe={props.deleteRecipe}
      />
    );
  };

  return (
    <FlatList
      style={styles.container}
      data={props.recipes}
      contentContainerStyle={styles.listContainer}
      testID={'testRecipeList'}
      keyExtractor={(_, index) => index.toString()}
      renderItem={({ item }: { item: Recipe }) => {
        return renderRecipeList(item);
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  listContainer: {
    paddingVertical: 15,
    paddingBottom: 150,
  },
});

export default MyRecipesView;
