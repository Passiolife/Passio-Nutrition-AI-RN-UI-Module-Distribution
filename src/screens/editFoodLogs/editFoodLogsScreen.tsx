import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Module, ParamList } from '../../navigaitons';
import type { FoodLog } from '../../models';
import { BasicButton, DatePicker, BackNavigation } from '../../components';
import { COLORS } from '../../constants';
import LogInformationView from './views/logInformationsView';
import type { StackNavigationProp } from '@react-navigation/stack';
import { TimeStampView } from './views/timeStampsView';
import { SaveFavoriteFoodItem, UpdateFoodLogAlertPrompt } from './alerts';
import { MealTimeView } from './views/mealTimesView';
import { IngredientsView } from './views/ingredients/IngredientsView';
import { calculateComputedWeightAmount } from './utils';
import { useEditFoodLog } from './useEditFoodLog';
import { content } from '../../constants/Content';
import type { Branding } from '../../contexts';
import { scaleWidth, scaled, scaledSize } from '../../utils';
import { ICONS } from '../../assets';
import NewEditServingAmountView from './views/newEditServingsAmountView';

export type EditFoodLogScreenNavigationProps = StackNavigationProp<
  ParamList,
  'EditFoodLogScreen'
>;

export interface EditFoodLogScreenProps {
  foodLog: FoodLog;
  prevRouteName: String | Module;
  onSaveLogPress?: (foodLog: FoodLog) => void;
  onDeleteLogPress?: (foodLog: FoodLog) => void;
  onCancelPress?: () => void;
}

export const EditFoodLogScreen = () => {
  const {
    branding,
    eventTimeStamp,
    foodLog,
    from,
    isFavorite,
    isHideFavorite,
    isOpenDatePicker,
    isOpenFavoriteFoodAlert,
    isOpenFoodNameAlert,
    isHideMealTime,
    isHideTimeStamp,
    closeDatePicker,
    closeFavoriteFoodLogAlert,
    closeSaveFoodNameAlert,
    deleteIngredient,
    onDateChangePress,
    onAddIngredientPress,
    onEditIngredientPress,
    onCancelPress,
    onRightActionPress,
    onSaveFavoriteFoodLog,
    onSaveFoodLogName,
    onSavePress,
    onUpdateFoodLog,
    onUpdateFavoritePress,
    onMealLabelPress,
    openDatePicker,
    setOpenFoodNameAlert,
    onDeleteFavoritePress,
    onMoreDetailPress,
  } = useEditFoodLog();
  const styles = editFoodLogStyle(branding);

  const icon =
    from === 'MealLog'
      ? ICONS.delete
      : from === 'QuickScan'
        ? ICONS.swap
        : undefined;

  return (
    <View style={styles.container}>
      <BackNavigation
        title={'Edit'}
        rightIcon={icon}
        onRightPress={onRightActionPress}
      />
      <ScrollView>
        <View style={styles.body}>
          <TouchableOpacity
            onPress={() => {
              setOpenFoodNameAlert(false);
            }}
            activeOpacity={1}
          >
            <LogInformationView
              imageName={foodLog.imageName}
              foodItems={foodLog.foodItems}
              userFoodImage={foodLog.userFoodImage}
              longName={foodLog.longName}
              passioID={foodLog.passioID}
              isOpenFood={foodLog.isOpenFood}
              onMoreDetailPress={onMoreDetailPress}
              name={foodLog.name}
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
                      onSaveFavoriteFoodLog(foodLog.name);
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
          </TouchableOpacity>
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
            foodItems={foodLog.foodItems}
            onAddIngredients={onAddIngredientPress}
            deleteIngredientsItem={deleteIngredient}
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
          <BasicButton
            style={bottomActionStyle.bottomActionButton}
            text={content.log}
            testId="testButtonSave"
            small
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
      <SaveFavoriteFoodItem
        text={''}
        onSave={(input) => onSaveFavoriteFoodLog(input)}
        onClose={async () => closeFavoriteFoodLogAlert()}
        isVisible={isOpenFavoriteFoodAlert}
      />
      <UpdateFoodLogAlertPrompt
        defaultValue={foodLog.name}
        onSave={async (input) => onSaveFoodLogName(input)}
        onClose={() => closeSaveFoodNameAlert()}
        isVisible={isOpenFoodNameAlert}
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
    marginHorizontal: 8,
    borderRadius: scaledSize(4),
    justifyContent: 'center',
  },
});
