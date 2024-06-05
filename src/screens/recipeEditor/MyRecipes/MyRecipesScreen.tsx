import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Header } from '../../../components';
import { ic_chevron_left_round } from '../../../assets';
import {
  type RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import type { MealLabel, Recipe } from '../../../models';
import type { ParamList } from '../../../navigaitons';
import { ProgressLoadingView } from '../../../components/loader';
import SearchInput from '../../../components/searchInputs/SearchInput';
import { COLORS } from '../../../constants';
import RecipeEmptyView from './views/RecipeEmptyView';
import MyRecipesView from './views/MyRecipesView';
import AddRecipeButton from './views/AddRecipeButton';
import { useMyRecipes } from './useMyRecipes';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MealLogScreenRoute } from '../../../navigaitons/Route';

export interface MyRecipeScreenProps {
  logToDate: Date | undefined;
  logToMeal: MealLabel | undefined;
}

const MyRecipesScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamList>>();
  const route = useRoute<RouteProp<ParamList, 'MyRecipeScreen'>>();

  const {
    refreshRecipes,
    convertRecipeToFoodLog,
    searchQuery,
    onSearchRecipe,
    clearSearchResult,
    recipes,
    deleteRecipe,
  } = useMyRecipes(route.params.logToDate, route.params.logToMeal);

  const goBack = () => {
    navigation.goBack();
  };

  const navigateToRecipeEditorScreen = (
    recipe?: Recipe,
    isNewRecipe: boolean = false
  ) => {
    navigation.navigate('RecipeEditorScreen', {
      recipe: recipe,
      isNewRecipe: isNewRecipe,
      logToDate: route.params.logToDate,
      logToMeal: route.params.logToMeal,
      refreshRecipes: refreshRecipes,
    });
  };

  const navigateToAddRecipe = () => {
    navigateToRecipeEditorScreen(undefined, true);
  };

  const navigateToEditRecipe = (recipe?: Recipe) => {
    navigateToRecipeEditorScreen(recipe, false);
  };

  const navigateToEditFoodLogScreen = (recipe: Recipe) => {
    const foodLog = convertRecipeToFoodLog(recipe);
    navigation.navigate('EditFoodLogScreen', {
      foodLog: foodLog,
      prevRouteName: MealLogScreenRoute.toString(),
    });
  };

  return (
    <View style={styles.recipeScreenContainer}>
      <Header
        leftSide={
          <TouchableOpacity onPress={goBack}>
            <Image
              source={ic_chevron_left_round}
              resizeMode="contain"
              style={styles.headerIconImg}
            />
          </TouchableOpacity>
        }
        body={
          <Text numberOfLines={1} style={styles.headerTitle}>
            My Recipes
          </Text>
        }
        bottomView={
          <SearchInput
            searchQuery={searchQuery}
            onChangeSearchInput={onSearchRecipe}
            clearSearchInput={clearSearchResult}
          />
        }
      />
      {recipes == null ? (
        <ProgressLoadingView />
      ) : recipes.length > 0 ? (
        <MyRecipesView
          recipes={recipes}
          onLogItemPress={navigateToEditFoodLogScreen}
          onRecipePress={navigateToEditRecipe}
          deleteRecipe={deleteRecipe}
        />
      ) : (
        <RecipeEmptyView />
      )}
      <View style={styles.addBtnLayout}>
        <AddRecipeButton onPressBtn={navigateToAddRecipe} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  recipeScreenContainer: {
    flex: 1,
  },
  headerIconImg: {
    height: 26,
    width: 24,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 16,
  },
  addBtnLayout: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
});

export default MyRecipesScreen;
