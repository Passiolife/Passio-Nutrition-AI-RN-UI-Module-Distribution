import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { BasicButton, BackNavigation, RecipeOptions } from '../../components';
import { COLORS } from '../../constants';
import { IngredientsView } from '../editFoodLogs/views/ingredients/IngredientsView';
import { content } from '../../constants/Content';
import type { Branding } from '../../contexts';
import { scaleWidth, scaled, scaledSize } from '../../utils';
import NewEditServingAmountView from '../editFoodLogs/views/newEditServingsAmountView';
import { useEditRecipe } from './useEditRecipe';
import { EditRecipeName } from './views/EditRecipeName';
import type { FoodLog } from '../../models';
import ImagePickerOptions from '../../components/imagePickerOptions/ImagePickerOptions';

export const EditRecipeScreen = () => {
  const {
    branding,
    closeImagePickerModal,
    deleteIngredient,
    editRecipeNameRef,
    foodLog,
    image,
    isImagePickerVisible,
    isDeleteButtonVisible,
    onDeletePress,
    onAddIngredientPress,
    recipeOptionsRef,
    onFindSearchPress,
    onAddFavoritePress,
    onCancelPress,
    onEditImagePress,
    onEditIngredientPress,
    onSavePress,
    onSelectImagePress,
    onUpdateFoodLog,
  } = useEditRecipe();
  const styles = editFoodLogStyle(branding);

  const icon = undefined;

  return (
    <View style={styles.container}>
      <BackNavigation title={'Edit Recipe'} rightIcon={icon} />
      <ScrollView>
        <View style={styles.body}>
          <EditRecipeName
            foodLog={foodLog}
            image={image}
            ref={editRecipeNameRef}
            onEditImagePress={onEditImagePress}
          />
          {foodLog.foodItems.length > 0 && (
            <NewEditServingAmountView
              foodLog={foodLog as FoodLog}
              onUpdateFoodLog={onUpdateFoodLog}
            />
          )}
          <IngredientsView
            foodItems={foodLog.foodItems}
            isShowAll
            type="EditRecipe"
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
        {isDeleteButtonVisible && (
          <BasicButton
            text={'Delete'}
            onPress={onDeletePress}
            isDelete={true}
            small
            style={{
              flexDirection: 'row',
              flex: 1,
              justifyContent: 'center',
              backgroundColor: branding.error,
              borderColor: branding.error,
            }}
          />
        )}
        <BasicButton
          style={bottomActionStyle.bottomActionButton}
          text={content.save}
          testId="testButtonSave"
          enable={foodLog.foodItems.length > 1}
          small
          secondary={false}
          onPress={() => onSavePress()}
        />
      </View>
      {isImagePickerVisible && (
        <ImagePickerOptions
          onCloseModel={closeImagePickerModal}
          onSelectGallery={async () => onSelectImagePress('gallery')}
          onSelectCamera={async () => onSelectImagePress('camera')}
        />
      )}
      <RecipeOptions
        onTextSearch={onFindSearchPress}
        onFavorite={onAddFavoritePress}
        ref={recipeOptionsRef}
      />
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
    marginHorizontal: 4,
    borderRadius: scaledSize(4),
    justifyContent: 'center',
  },
});
