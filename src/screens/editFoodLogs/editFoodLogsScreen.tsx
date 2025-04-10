import React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Module, ParamList } from '../../navigaitons';
import type { CustomFood, FoodLog } from '../../models';
import { BasicButton, DatePicker, BackNavigation } from '../../components';
import { COLORS } from '../../constants';
import LogInformationView from './views/logInformationsView';
import type { StackNavigationProp } from '@react-navigation/stack';
import { TimeStampView } from './views/timeStampsView';
import { MealTimeView } from './views/mealTimesView';
import { IngredientsView } from './views/ingredients/IngredientsView';
import { calculateComputedWeightAmount } from './utils';
import { useEditFoodLog } from './useEditFoodLog';
import { content } from '../../constants/Content';
import type { Branding } from '../../contexts';
import { scaleHeight, scaleWidth } from '../../utils';
import { ICONS } from '../../assets';
import NewEditServingAmountView from './views/newEditServingsAmountView';
import AlertCustomFood from './views/AlertCustomFood';
import FoodNotFound from './views/FoodNotFound';

export type EditFoodLogScreenNavigationProps = StackNavigationProp<
  ParamList,
  'EditFoodLogScreen'
>;

export interface EditFoodLogScreenProps {
  foodLog: FoodLog;
  customFood?: CustomFood;
  prevRouteName: String | Module;
  onSaveLogPress?: (foodLog: FoodLog) => void;
  onDeleteLogPress?: (foodLog: FoodLog) => void;
  onCancelPress?: () => void;
  onEditCustomFood?: (foodLog: FoodLog) => void;
  onEditRecipeFood?: (foodLog: FoodLog) => void;
}

export const EditFoodLogScreen = () => {
  const {
    alertCustomFoodRef,
    branding,
    closeDatePicker,
    eventTimeStamp,
    foodLog,
    foodNotFoundRef,
    from,
    isFavorite,
    isHideFavorite,
    isHideMealTime,
    isSubmitting,
    isHideTimeStamp,
    isOpenDatePicker,
    onEditIngredientPress,
    onCancelPress,
    onCreateCustomFood,
    onDateChangePress,
    onDeleteFavoritePress,
    onDeleteFoodLogPress,
    onEditCustomFood,
    onEditCustomFoodPress,
    onMealLabelPress,
    onMoreDetailPress,
    onSaveFavoriteFoodLog,
    onSavePress,
    onUpdateFavoritePress,
    onUpdateFoodLog,
    openDatePicker,
    onEditCustomRecipePress,
  } = useEditFoodLog();
  const styles = editFoodLogStyle(branding);

  return (
    <View style={styles.container}>
      <BackNavigation
        title={'Food Details'}
        rightSide={
          <View>
            {foodLog.foodItems.length === 1 ? (
              <Pressable
                onPress={onEditCustomFoodPress}
                style={{ marginStart: 16 }}
              >
                <Image
                  source={ICONS.editGreyIc}
                  resizeMethod="resize"
                  resizeMode="contain"
                  style={{
                    width: scaleWidth(24),
                    height: scaleHeight(24),
                    marginEnd: 32,
                  }}
                />
              </Pressable>
            ) : (
              <View style={{ marginStart: 46 }} />
            )}
          </View>
        }
      />
      <ScrollView>
        <View style={styles.body}>
          <LogInformationView
            iconID={foodLog.iconID}
            foodItems={foodLog.foodItems}
            isOpenFood={foodLog.isOpenFood}
            onMoreDetailPress={onMoreDetailPress}
            name={foodLog.name}
            longName={
              foodLog.name === foodLog.longName ? undefined : foodLog.longName
            }
            qty={foodLog.selectedQuantity}
            entityType={foodLog.entityType}
            servingUnit={foodLog.selectedUnit}
            weight={calculateComputedWeightAmount(
              foodLog.selectedQuantity,
              foodLog.servingUnits,
              foodLog.selectedUnit
            )}
            rightIconForHeader={
              !isHideFavorite ? (
                <TouchableOpacity
                  onPress={() => {
                    onSaveFavoriteFoodLog();
                  }}
                >
                  <Image
                    source={
                      isFavorite ? ICONS.filledHeartBlue : ICONS.heartBlue
                    }
                    style={
                      isFavorite
                        ? styles.filledHeartIconStyle
                        : styles.heartIconStyle
                    }
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : undefined
            }
          />
          <NewEditServingAmountView
            foodLog={foodLog}
            onUpdateFoodLog={onUpdateFoodLog}
          />
          {!isHideMealTime && (
            <MealTimeView
              defaultLabel={foodLog.meal}
              onPress={(label) => onMealLabelPress(label)}
            />
          )}
          {!isHideTimeStamp && (
            <TimeStampView
              date={foodLog.eventTimestamp}
              onPress={openDatePicker}
            />
          )}
          <IngredientsView
            onAddIngredients={onEditCustomRecipePress}
            foodItems={foodLog.foodItems}
            referenceCode={foodLog.refCustomFoodID}
            enable={false}
            onAddIngredients={onEditCustomRecipePress}
            navigateToEditIngredientsScreen={onEditIngredientPress}
          />
          <View style={styles.lastContainer} />
        </View>
      </ScrollView>

      {from === 'Favorites' ? (
        <View style={bottomActionStyle.bottomActionContainer}>
          <BasicButton
            style={bottomActionStyle.bottomActionButton}
            text={content.delete}
            testId="testFavoriteDelete"
            small
            boarderColor={branding.error}
            secondary={true}
            onPress={onDeleteFavoritePress}
          />
          <BasicButton
            style={bottomActionStyle.bottomActionButton}
            text={'Update'}
            testId="testButtonSave"
            small
            secondary={false}
            onPress={onUpdateFavoritePress}
          />
        </View>
      ) : (
        <View style={bottomActionStyle.bottomActionContainer}>
          <BasicButton
            style={bottomActionStyle.bottomActionButton}
            text={content.cancel}
            testId="testButtonSave"
            small
            secondary={true}
            onPress={() => onCancelPress()}
          />
          {from === 'MealLog' && (
            <BasicButton
              style={bottomActionStyle.deleteActionButton}
              text={content.delete}
              small
              onPress={() => onDeleteFoodLogPress()}
            />
          )}
          <BasicButton
            style={bottomActionStyle.bottomActionButton}
            text={from === 'MealLog' ? 'Save' : content.log}
            testId="testButtonSave"
            small
            isLoading={isSubmitting}
            secondary={false}
            onPress={() => onSavePress()}
          />
        </View>
      )}

      <DatePicker
        mode="date"
        selectedDate={eventTimeStamp}
        isDatePickerVisible={isOpenDatePicker}
        handleConfirm={(date) => onDateChangePress(date)}
        hideDatePicker={() => closeDatePicker()}
      />
      <AlertCustomFood
        ref={alertCustomFoodRef}
        onCreatePress={onCreateCustomFood}
        onEditPress={onEditCustomFood}
      />
      <FoodNotFound ref={foodNotFoundRef} onCreatePress={onCreateCustomFood} />
    </View>
  );
};

const editFoodLogStyle = ({ backgroundColor }: Branding) =>
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
      height: 24,
      width: 24,
    },
    filledHeartIconStyle: {
      height: 24,
      width: 24,
    },
  });

const bottomActionStyle = StyleSheet.create({
  bottomActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginBottom: 32,
    marginHorizontal: 16,
  },
  bottomActionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 4,
    justifyContent: 'center',
  },
  deleteActionButton: {
    flex: 1,
    backgroundColor: 'rgba(239, 68, 68, 1)',
    borderColor: 'rgba(239, 68, 68, 1)',
    justifyContent: 'center',
  },
});
