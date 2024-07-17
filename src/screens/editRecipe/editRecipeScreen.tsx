import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BasicButton, BackNavigation } from '../../components';
import { COLORS } from '../../constants';
import { IngredientsView } from '../editFoodLogs/views/ingredients/IngredientsView';
import { content } from '../../constants/Content';
import type { Branding } from '../../contexts';
import { scaleWidth, scaled, scaledSize } from '../../utils';
import NewEditServingAmountView from '../editFoodLogs/views/newEditServingsAmountView';
import { useEditRecipe } from './useEditFoodLog';

export const EditRecipeScreen = () => {
  const {
    branding,
    foodLog,
    deleteIngredient,
    onAddIngredientPress,
    onEditIngredientPress,
    onCancelPress,
    onSavePress,
    onUpdateFoodLog,
  } = useEditRecipe();
  const styles = editFoodLogStyle(branding);

  const icon = undefined;

  return (
    <View style={styles.container}>
      <BackNavigation title={'Edit Recipe'} rightIcon={icon} />
      <ScrollView>
        <View style={styles.body}>
          <NewEditServingAmountView
            foodLog={foodLog}
            onUpdateFoodLog={onUpdateFoodLog}
          />
          <IngredientsView
            foodItems={foodLog.foodItems}
            isShowAll
            onAddIngredients={onAddIngredientPress}
            deleteIngredientsItem={deleteIngredient}
            navigateToEditIngredientsScreen={onEditIngredientPress}
          />
          <View style={styles.lastContainer} />
        </View>
      </ScrollView>

      <View style={bottomActionStyle.bottomActionContainer}>
        <BasicButton
          style={bottomActionStyle.bottomActionButton}
          text={content.cancel}
          testId="testButtonSave"
          small
          secondary={true}
          onPress={() => onCancelPress()}
        />
        <BasicButton
          style={bottomActionStyle.bottomActionButton}
          text={content.log}
          testId="testButtonSave"
          small
          secondary={false}
          onPress={() => onSavePress()}
        />
      </View>
    </View>
  );
};

const editFoodLogStyle = ({
  backgroundColor,
  gray300,
  primaryColor,
}: Branding) =>
  StyleSheet.create({
    container: {
      backgroundColor: backgroundColor,
      flex: 1,
    },
    headerIconImg: {
      width: 24,
      height: 24,
    },
    headerText: {
      textTransform: 'capitalize',
    },
    body: {
      paddingHorizontal: 20,
    },
    scrollViewContainer: {
      backgroundColor: 'red',
      flex: 1,
    },
    informationContainer: {
      padding: 10,
      paddingBottom: 20,
    },
    informationRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    image: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: COLORS.grey2,
    },
    informationContent: {
      marginLeft: 10,
    },
    logName: {
      color: COLORS.blue,
      fontSize: 20,
    },
    logSize: {
      fontSize: 13,
      color: COLORS.grey7,
      marginTop: 2,
    },
    calorieContainer: {
      flexDirection: 'row',
      marginTop: 15,
    },
    lastContainer: {
      height: 50,
    },
    heartIconStyle: {
      ...scaled(24),
      tintColor: gray300,
    },
    filledHeartIconStyle: {
      ...scaled(20),
      tintColor: primaryColor,
    },
  });

const bottomActionStyle = StyleSheet.create({
  bottomActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 32,
    marginHorizontal: scaleWidth(16),
  },
  bottomActionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: scaledSize(4),
    justifyContent: 'center',
  },
});
