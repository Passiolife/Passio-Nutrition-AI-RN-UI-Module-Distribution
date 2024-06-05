import React, { useCallback } from 'react';
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ActionSheet,
  BasicButton,
  DeleteAlert,
  DeleteButton,
  Header,
} from '../../../components';
import {
  ic_barcode_blue_x4,
  ic_chevron_left_round,
  ICONS,
} from '../../../assets';
import { type ActionSheetType, COLORS } from '../../../constants';
import {
  type RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import type { FoodItem, FoodLog, Recipe } from '../../../models';
import { AddButton } from '../../../components/addButtons';
import { useBranding } from '../../../contexts';
import type { ParamList } from '../../../navigaitons';
import type { StackNavigationProp } from '@react-navigation/stack';
import RecipeMacroView from './views/RecipeMacroView';
import IngredientsView from './views/IngredientsView';
import { useRecipeEditor } from './useRecipeEditor';
import {
  IngredientQuickScanScreenRoute,
  ROUTES,
} from '../../../navigaitons/Route';
import type { MealLabel } from '../../../models';
import { convertPassioFoodItemToFoodLog } from '../../../utils/V3Utils';

let { width } = Dimensions.get('window');

export interface RecipeEditorScreenProps {
  recipe?: Recipe;
  isNewRecipe: boolean;
  logToDate: Date | undefined;
  logToMeal: MealLabel | undefined;
  refreshRecipes?: () => unknown;
}

export type RecipeEditorScreenNavigationProps = StackNavigationProp<
  ParamList,
  'RecipeEditorScreen'
>;

const RecipeEditorScreen = () => {
  const { primaryColor } = useBranding();
  const navigation = useNavigation<RecipeEditorScreenNavigationProps>();
  const { params } = useRoute<RouteProp<ParamList, 'RecipeEditorScreen'>>();
  const {
    totalServings,
    ingredients,
    recipeName,
    macrosPerServing,
    isOpenActionSheet,
    updateIngredientsItem,
    onCloseActionSheet,
    deleteIngredientsItem,
    openActionSheet,
    updateRecipeName,
    updateTotalServings,
    saveRecipe,
    saveRecipeAndConvertLog,
    deleteRecipe,
  } = useRecipeEditor(params.recipe, params.logToDate, params.logToMeal);

  function goBack() {
    navigation.goBack();
  }

  function redirectToSearchIngredientScreen() {
    navigation.navigate('FoodSearchScreen', {
      onSaveData: (item) => {
        const foodItem = convertPassioFoodItemToFoodLog(
          item,
          new Date(),
          undefined
        ).foodItems[0];
        if (foodItem) {
          updateIngredientsItem(foodItem);
        }
      },
      from: 'Ingredient',
    });
  }

  const navigateToEditIngredientsScreen = (foodItem: FoodItem) => {
    navigation.navigate('EditIngredientScreen', {
      foodItem: foodItem,
      deleteIngredient: deleteIngredientsItem,
      updateIngredient: updateIngredientsItem,
    });
  };

  const isValidRecipe = useCallback(() => {
    if (totalServings !== undefined && totalServings <= 0) {
      Alert.alert('Please enter total servings');
      return false;
    } else if (ingredients.length === 0) {
      Alert.alert('Please add ingredients');
      return false;
    } else if (recipeName.length === 0) {
      Alert.alert('Please add recipe name');
      return false;
    } else {
      return true;
    }
  }, [ingredients.length, recipeName.length, totalServings]);

  const onSaveRecipe = useCallback(async () => {
    if (isValidRecipe()) {
      await saveRecipe();
      params.refreshRecipes?.();
      navigation.goBack();
    }
  }, [isValidRecipe, navigation, params, saveRecipe]);

  const onDeleteRecipe = useCallback(() => {
    DeleteAlert({
      title: `Are sure want to delete ${recipeName}?`,
      onClose(): void {},
      async onDelete() {
        await deleteRecipe();
        params.refreshRecipes?.();
        navigation.goBack();
      },
    });
  }, [deleteRecipe, navigation, params, recipeName]);

  const onSaveAndLogRecipe = useCallback(async () => {
    if (isValidRecipe()) {
      const foodLog: FoodLog = await saveRecipeAndConvertLog();
      params.refreshRecipes?.();
      // navigation.goBack();
      navigation.navigate('EditFoodLogScreen', {
        foodLog: foodLog,
        prevRouteName: ROUTES.RecipeEditorScreen,
      });
    }
  }, [isValidRecipe, navigation, params, saveRecipeAndConvertLog]);

  const bottomActionView = useCallback(() => {
    return (
      <View style={bottomActionStyle.bottomActionContainer}>
        <DeleteButton
          style={bottomActionStyle.bottomActionButton}
          small
          onPress={onDeleteRecipe}
        />
        <BasicButton
          style={bottomActionStyle.bottomActionButton}
          text="Save"
          testId="testSave"
          small
          secondary={false}
          onPress={onSaveRecipe}
        />
        <BasicButton
          style={bottomActionStyle.bottomActionButton}
          text="Save & Log"
          small
          secondary={false}
          onPress={onSaveAndLogRecipe}
        />
      </View>
    );
  }, [onDeleteRecipe, onSaveAndLogRecipe, onSaveRecipe]);

  const onPressAction = (type: ActionSheetType) => {
    if (type.action) {
      type.action();
    }
    onCloseActionSheet();
  };

  const redirectToIngredientQuickScanScreen = () => {
    navigation.navigate(IngredientQuickScanScreenRoute, {
      onSelectPassioIDAttribute: (item: FoodItem) => {
        updateIngredientsItem(item);
      },
    });
  };

  const addIngredientsOptions: Array<ActionSheetType> = [
    {
      icon: ICONS.quickAdd,
      title: 'Quick scan',
      action: redirectToIngredientQuickScanScreen,
    },
    {
      icon: ICONS.fullMeal,
      title: 'Multi-food scan',
    },
    {
      icon: ic_barcode_blue_x4,
      title: 'Barcode',
    },
    {
      icon: ICONS.search,
      title: 'Search manually',
      action: redirectToSearchIngredientScreen,
    },
  ];

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
            {params.isNewRecipe ? 'Create Recipe' : 'Edit Recipe'}
          </Text>
        }
      />
      <ScrollView
        contentContainerStyle={styles.contentContainerStyle}
        keyboardDismissMode="on-drag"
      >
        <View>
          <View style={styles.recipeName}>
            <Text style={styles.textInputTitle}>Recipe Name</Text>
            <TextInput
              onChangeText={(text) => {
                updateRecipeName(text);
              }}
              placeholder="My Recipe"
              testID="testMyRecipe"
              returnKeyType="next"
              onSubmitEditing={() => {}}
              style={styles.textInputStyle}
              value={recipeName}
            />
          </View>
          <View style={styles.recipeName}>
            <Text style={styles.textInputTitle}>
              <Text style={styles.textInputTitle}>Total servings </Text>
              <Text style={styles.hintText}>(how many does it serve?)</Text>
            </Text>
            <TextInput
              value={totalServings?.toString()}
              testID={'testEditNumberOfServing'}
              onChangeText={(text) => {
                updateTotalServings(Number(text));
              }}
              placeholder="Number of servings"
              style={styles.textInputStyle}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.macroTextHeader}>
            <Text style={[styles.titleText, { color: primaryColor }]}>
              Macros Per Serving
            </Text>
          </View>
          <RecipeMacroView
            title={'Calories'}
            value={macrosPerServing.calories}
          />
          <RecipeMacroView title={'Carbs'} value={macrosPerServing.carbs} />
          <RecipeMacroView title={'Protein'} value={macrosPerServing.protein} />
          <RecipeMacroView title={'Fat'} value={macrosPerServing.fat} />
          <View style={styles.line} />
          <View style={styles.macroTextHeader}>
            <Text style={[styles.titleText, { color: primaryColor }]}>
              Ingredients
            </Text>
          </View>
          <View>
            <IngredientsView
              foodItems={ingredients}
              deleteIngredientsItem={deleteIngredientsItem}
              onIngredientPress={navigateToEditIngredientsScreen}
            />
            <AddButton style={styles.addButton} onPress={openActionSheet} />
          </View>
          <View style={styles.fakeHeight} />
        </View>
      </ScrollView>
      {params.isNewRecipe ? (
        <BasicButton
          style={styles.okBtn}
          text="OK"
          small
          secondary={false}
          onPress={onSaveRecipe}
        />
      ) : (
        bottomActionView()
      )}
      <ActionSheet
        onCloseActionSheet={onCloseActionSheet}
        modalVisible={isOpenActionSheet}
        actionSheetData={addIngredientsOptions}
        onPressAction={onPressAction}
        modalTitle="Add new ingredients"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  recipeScreenContainer: {
    flex: 1,
  },
  fakeHeight: {
    height: 100,
  },
  headerIconImg: {
    height: 26,
    width: 24,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 16,
  },
  recipeName: {
    marginTop: 24,
    marginLeft: 20,
  },
  textInputStyle: {
    borderBottomWidth: 1,
    marginTop: 10,
    height: 40,
    width: width / 1.1 - 5,
    borderBottomColor: COLORS.grey3,
  },
  macroTextHeader: {
    marginHorizontal: 16,
    marginTop: 32,
  },
  line: {
    backgroundColor: COLORS.grey3,
    marginHorizontal: 16,
    marginTop: 16,
    height: 1,
  },
  titleText: {
    fontWeight: '600',
    fontSize: 15,
  },
  textInputTitle: {
    fontWeight: '600',
    fontSize: 15,
    color: COLORS.blackShade,
  },
  hintText: {
    fontWeight: '400',
    fontSize: 15,
    color: COLORS.blackShade,
  },
  addButton: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  contentContainerStyle: {},
  okBtn: {
    borderRadius: 0,
    height: 62,
    marginTop: 20,
    width: '100%',
    position: 'absolute',
    backgroundColor: COLORS.blue,
    bottom: 0,
  },
});

const bottomActionStyle = StyleSheet.create({
  bottomActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 32,
    marginBottom: 60,
    marginHorizontal: 32,
  },
  bottomActionButton: {
    marginHorizontal: 8,
    borderRadius: 14,
    justifyContent: 'center',
  },
});

export default React.memo(RecipeEditorScreen);
