import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { type Recipe, totalNutrientsOfFoodItems } from '../../../../models';
import { COLORS } from '../../../../constants';
import { Card, SwipeToDelete } from '../../../../components';

export interface RecipeItemViewProps {
  recipe: Recipe;
  onLogItemPress: (item: Recipe) => void;
  onRecipePress: (item: Recipe) => void;
  onDeleteFoodRecipe?: (item: Recipe) => void;
  deleteRecipe: (item: Recipe) => void;
}

const formatNutrientAmount = (
  value: number | undefined,
  numberOfServings: number
) => {
  if (value === undefined) {
    return 0;
  }
  return (value / numberOfServings).toFixed(0);
};

const RecipeItemView = (props: RecipeItemViewProps) => {
  const { recipe } = props;
  const { calories, carbs, fat, protein } = totalNutrientsOfFoodItems(
    recipe.ingredients
  );

  return (
    <SwipeToDelete
      swipeableContainer={styles.swipeableContainer}
      onPressDelete={() => props.deleteRecipe(props.recipe)}
    >
      <Card style={[styles.mainContainer, styles.recipeItem]}>
        <TouchableOpacity
          style={styles.container}
          onPress={() => props.onRecipePress(props.recipe)}
        >
          <View style={styles.recipeInfoContainer}>
            <Text style={styles.cardTitle}>{props.recipe.name}</Text>
            <Text style={styles.macroServingText}>Macros per serving:</Text>
            <View style={styles.row}>
              <Text
                testID={`testRecipeCaloriesPerTotalServing-${props.recipe.uuid}`}
                style={styles.rowText}
              >
                {`Calories: ${formatNutrientAmount(
                  calories,
                  recipe.totalServings
                )}`}
              </Text>
              <Text
                testID={`testRecipeCarbsPerTotalServing-${props.recipe.uuid}`}
                style={styles.rowText}
              >
                {`Carbs: ${formatNutrientAmount(carbs, recipe.totalServings)}`}
              </Text>
              <Text
                testID={`testRecipeFatPerTotalServing-${props.recipe.uuid}`}
                style={styles.rowText}
              >
                {`Fat: ${formatNutrientAmount(fat, recipe.totalServings)}`}
              </Text>
              <Text
                testID={`testRecipeProteinPerTotalServing-${props.recipe.uuid}`}
                style={styles.rowText}
              >
                {`Protein: ${formatNutrientAmount(
                  protein,
                  recipe.totalServings
                )}`}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.logItem}
          onPress={() => props.onLogItemPress(props.recipe)}
        >
          <Text style={styles.btnText}>Log Item</Text>
        </TouchableOpacity>
      </Card>
    </SwipeToDelete>
  );
};

const styles = StyleSheet.create({
  recipeItem: {
    paddingHorizontal: 12,
    borderRadius: 16,
    shadowColor: '#fff',
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 0,
    elevation: 0,
  },
  mainContainer: {
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 4,
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  container: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    color: COLORS.grey7,

    fontWeight: '600',
  },
  rowText: {
    fontSize: 13,
    marginRight: 8,
    color: COLORS.grey7,
  },
  macroServingText: {
    fontSize: 14,
    marginTop: 4,
    color: COLORS.grey8,
  },
  recipeInfoContainer: {
    flex: 1,
  },
  btnText: {
    color: COLORS.blue,
    fontSize: 13,
    fontWeight: '600',
  },
  logItem: {
    alignSelf: 'center',
  },
  swipeableContainer: {
    marginHorizontal: 16,
  },
});

export default RecipeItemView;
