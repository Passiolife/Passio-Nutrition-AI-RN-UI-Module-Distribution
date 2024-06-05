// @ts-nocheck
import React from 'react';
import { render, type RenderAPI } from '@testing-library/react-native';
import MyRecipesView from '../../screens/recipeEditor/MyRecipes/views/MyRecipesView';

const mockedDispatch = jest.fn();
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: mockedDispatch,
    }),
    useRoute: () => ({
      params: {
        logToDate: { undefined },
        logToMeal: { undefined },
      },
    }),
  };
});

describe('recipes RecipesListView', () => {
  it('Renders correctly', async () => {
    let onLogItemPress = jest.fn();
    let onRecipePress = jest.fn();
    let onDeleteFoodRecipe = jest.fn();
    let deleteRecipe = jest.fn();

    let tree: RenderAPI;
    tree = render(
      <MyRecipesView
        recipes={require('../assets/json/recipe.json')}
        onLogItemPress={onLogItemPress}
        onDeleteFoodRecipe={onDeleteFoodRecipe}
        onRecipePress={onRecipePress}
        deleteRecipe={deleteRecipe}
      />
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });

  it('check total recipes count', async () => {
    let onLogItemPress = jest.fn();
    let tree: RenderAPI;
    let onRecipePress = jest.fn();
    let onDeleteFoodRecipe = jest.fn();
    let deleteRecipe = jest.fn();
    tree = render(
      <MyRecipesView
        recipes={require('../assets/json/recipe.json')}
        onLogItemPress={onLogItemPress}
        onRecipePress={onRecipePress}
        onDeleteFoodRecipe={onDeleteFoodRecipe}
        deleteRecipe={deleteRecipe}
      />
    );
    const totalRecipes = await tree.findAllByText(/Log Item/);
    expect(totalRecipes.length).toBe(2);
  });

  it('check recipe macro per serving for 123-5225-dcds-4555 uuid of recipe', async () => {
    let uuid = '123-5225-dcds-4555';
    let onLogItemPress = jest.fn();
    let onRecipePress = jest.fn();
    let onDeleteFoodRecipe = jest.fn();
    let deleteRecipe = jest.fn();
    let tree: RenderAPI;
    tree = render(
      <MyRecipesView
        recipes={require('../assets/json/recipe.json')}
        onLogItemPress={onLogItemPress}
        onRecipePress={onRecipePress}
        onDeleteFoodRecipe={onDeleteFoodRecipe}
        deleteRecipe={deleteRecipe}
      />
    );

    const caloriesPerServing = await tree.getByTestId(
      `testRecipeCaloriesPerTotalServing-${uuid}`
    );

    const carbsPerServing = await tree.getByTestId(
      `testRecipeCarbsPerTotalServing-${uuid}`
    );
    const fatPerServing = await tree.getByTestId(
      `testRecipeFatPerTotalServing-${uuid}`
    );
    const proteinPerServing = await tree.getByTestId(
      `testRecipeProteinPerTotalServing-${uuid}`
    );

    expect(caloriesPerServing.children).toContain('Calories: 100');
    expect(fatPerServing.children).toContain('Fat: 8');
    expect(carbsPerServing.children).toContain('Carbs: 20');
    expect(proteinPerServing.children).toContain('Protein: 15');
  });
});
