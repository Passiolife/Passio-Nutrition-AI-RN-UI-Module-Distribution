import { BackNavigation, BasicButton, DatePicker } from '../../components';
import {
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import type { FavoriteFoodItem, FoodLog, MealLabel } from '../../models';
import React, { useCallback, useState } from 'react';
import {
  SaveFavoriteFoodItem,
  UpdateFoodLogAlertPrompt,
  calculateComputedWeightAmount,
} from '../../screens/editFoodLogs';
import { convertFoodLogsToFavoriteFoodLog } from '../../utils';

import { COLORS } from '../../constants';
import EditServingAmountView from '../../screens/editFoodLogs/views/EditServingAmountView';
import LogInformationView from '../../screens/editFoodLogs/views/logInformationsView';
import { MealTimeView } from '../../screens/editFoodLogs/views/mealTimesView';
import { TimeStampView } from '../../screens/editFoodLogs/views/timeStampsView';
import { useBranding, type Branding } from '../../contexts';

interface Props {
  foodLog: FoodLog;
  isVisible: boolean;
  onDismissFoodLogModal: () => void;
  onSavedLog: (foodLog: FoodLog) => void;
  onFavoriteFoodLog?: (favoriteFoodItem: FavoriteFoodItem) => void;
}

export const FoodLogEditorModal = React.memo((props: Props) => {
  const [foodLog, setFoodLog] = useState<FoodLog>(props.foodLog);
  const [open, setOpen] = useState(false);
  const [isFavoriteAlertPromptOpen, setFavoriteAlertPromptOpen] =
    useState<boolean>(false);
  const [isUpdateAlertPromptOpen, setUpdateAlertPromptOpen] =
    useState<boolean>(false);
  const [eventTimeStamp, setEventTimeStamp] = useState<Date>(
    new Date(foodLog.eventTimestamp)
  );
  const { primaryColor } = useBranding();

  const openDatePicker = useCallback(() => {
    setOpen(true);
  }, []);

  const dismissDatePicker = useCallback(() => {
    setOpen(false);
  }, []);

  const onDatePick = useCallback(
    (selectedDate: Date) => {
      setFoodLog((item) => {
        const update = { ...item };
        update.eventTimestamp = new Date(selectedDate).toISOString();
        return update;
      });
      setEventTimeStamp(new Date(selectedDate));
      dismissDatePicker();
    },
    [dismissDatePicker]
  );

  // Save FoodLog As Favourite Item
  const saveFoodLogAsFavorite = useCallback(
    async (input: string | undefined) => {
      if (input != null) {
        if (props.onFavoriteFoodLog) {
          props.onFavoriteFoodLog(
            convertFoodLogsToFavoriteFoodLog(input, foodLog)
          );
        }
      }
      setFavoriteAlertPromptOpen(false);
    },
    [foodLog, props]
  );

  const dismissFavouriteAlert = useCallback(() => {
    setFavoriteAlertPromptOpen(false);
  }, []);

  const onUpdateFoodLogName = useCallback(async (input: string | undefined) => {
    if (input != null) {
      setFoodLog((item) => {
        const update = { ...item };
        update.name = input;
        return update;
      });
      setUpdateAlertPromptOpen(false);
    } else {
    }
  }, []);

  const dismissRenameFoodLogAlert = useCallback(() => {
    setUpdateAlertPromptOpen(false);
  }, []);

  const onUpdateMealLabel = useCallback((label: MealLabel) => {
    setFoodLog((item) => {
      const update = { ...item };
      update.meal = label;
      return update;
    });
  }, []);

  const onSavePress = useCallback(() => {
    props.onSavedLog(foodLog);
  }, [foodLog, props]);

  const styles = foodLogEditorModalStyle(useBranding());

  return (
    <Modal
      animationType="slide"
      transparent={false}
      animated={true}
      statusBarTranslucent={true}
      visible={props.isVisible}
      onRequestClose={props.onDismissFoodLogModal}
    >
      <View style={styles.container}>
        <BackNavigation
          title="Edit"
          onBackArrowPress={props.onDismissFoodLogModal}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.scrollContentView}
          contentContainerStyle={styles.scrollContent}
        >
          <TouchableOpacity
            onPress={() => {
              setUpdateAlertPromptOpen(true);
            }}
            activeOpacity={1}
          >
            <LogInformationView
              foodItems={foodLog.foodItems}
              passioID={foodLog.passioID}
              name={foodLog.name}
              qty={foodLog.selectedQuantity}
              servingUnit={foodLog.selectedUnit}
              entityType={foodLog.entityType}
              imageName={foodLog.imageName}
              weight={calculateComputedWeightAmount(
                foodLog.selectedQuantity,
                foodLog.servingUnits,
                foodLog.selectedUnit
              )}
            />
          </TouchableOpacity>
          <EditServingAmountView
            servingInfo={foodLog}
            foodItems={foodLog.foodItems}
            onUpdateServingInfo={(servingInfo, foodItems) => {
              setFoodLog((item) => {
                const update = { ...item };
                update.foodItems = foodItems;
                update.selectedUnit = servingInfo.selectedUnit;
                update.servingUnits = servingInfo.servingUnits;
                update.selectedQuantity = servingInfo.selectedQuantity;
                return update;
              });
            }}
          />
          <MealTimeView
            defaultLabel={foodLog.meal}
            onPress={(label) => onUpdateMealLabel(label)}
          />
          <TimeStampView
            date={foodLog.eventTimestamp}
            onPress={openDatePicker}
          />
        </ScrollView>
        <View style={bottomActionStyle.bottomActionContainer}>
          <BasicButton
            style={bottomActionStyle.bottomActionButton}
            text="Cancel"
            small
            secondary={true}
            boarderColor={primaryColor}
            onPress={props.onDismissFoodLogModal}
          />
          <BasicButton
            style={bottomActionStyle.bottomActionButton}
            text="Log"
            small
            secondary={false}
            onPress={onSavePress}
          />
        </View>
        <DatePicker
          mode="datetime"
          selectedDate={eventTimeStamp}
          isDatePickerVisible={open}
          handleConfirm={(date) => onDatePick(date)}
          hideDatePicker={() => dismissDatePicker()}
        />
        <SaveFavoriteFoodItem
          text={''}
          onSave={(input) => saveFoodLogAsFavorite(input)}
          onClose={async () => dismissFavouriteAlert()}
          isVisible={isFavoriteAlertPromptOpen}
        />
        <UpdateFoodLogAlertPrompt
          defaultValue={foodLog.name}
          onSave={async (input) => onUpdateFoodLogName(input)}
          onClose={() => dismissRenameFoodLogAlert()}
          isVisible={isUpdateAlertPromptOpen}
        />
      </View>
    </Modal>
  );
});

const foodLogEditorModalStyle = ({ backgroundColor }: Branding) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
    bodyContainer: {
      padding: 4,
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 13,
    },
    scrollContentView: {},
    headerIconImg: {
      width: 24,
      height: 24,
    },
    headerText: {
      fontSize: 16,
      lineHeight: 19,
      color: COLORS.white,
      textTransform: 'capitalize',
    },
    body: {},
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
      // height: 50,
    },
  });

const bottomActionStyle = StyleSheet.create({
  bottomActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    marginVertical: 16,
    paddingBottom: 20,
    paddingTop: 10,
  },
  bottomActionButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
});
