// @ts-nocheck
import React from 'react';
import { render, type RenderAPI } from '@testing-library/react-native';
import {
  type Recipe,
  RecipeEditorScreen,
} from '@passiolife/nutrition-ai-ui-ux';
import { MockProviders } from '../provider/MockProviders';

const mockedDispatch = jest.fn();
const mockedGoBack = jest.fn();
const mockedSaveRecipe = jest.fn();

mockedGoBack.mockReset() && mockedSaveRecipe.mockReset();

const recipeDataServices = {
  dataService: {
    saveFoodLog: () => {
      return Promise.resolve();
    },
    deleteFoodLog: () => {
      return Promise.resolve();
    },
    deleteFavoriteFoodItem: () => {
      return Promise.resolve();
    },
    deleteRecipe: () => {
      return Promise.resolve();
    },
    getFoodLogs: async () => {
      return [];
    },
    getFavoriteFoodItems: async () => {
      return require('../assets/json/favorites_food_logs.json');
    },
    saveFavoriteFoodItem: () => {
      return Promise.resolve();
    },
    getMealLogs: async () => {
      return [];
    },
    getRecipes: async () => {
      return [];
    },
    saveRecipe: mockedSaveRecipe,
    saveNutritionProfile: () => {
      return Promise.resolve();
    },
    getNutritionProfile: async () => {
      return undefined;
    },
    getPatientProfile: () => {
      return Promise.resolve(require('../assets/json/patient_profile.json'));
    },
  },
  analyticsService: {
    logEvent: () => {},
  },
};

jest.mock('@react-navigation/native', () => {
  const refreshRecipes = jest.fn();
  const actualNav = jest.requireActual('@react-navigation/native');
  const recipe: Recipe = require('../assets/json/detail_recipe.json');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: mockedGoBack,
      dispatch: mockedDispatch,
    }),
    useRoute: () => ({
      params: {
        recipe: recipe,
        isNewRecipe: false,
        refreshRecipes: refreshRecipes,
      },
    }),
  };
});

describe('recipes editor screen', () => {
  it('Renders correctly(Edit Recipe)', async () => {
    let tree: RenderAPI;
    tree = render(
      <>
        <MockProviders services={recipeDataServices}>
          <RecipeEditorScreen />
        </MockProviders>
      </>
    );
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
