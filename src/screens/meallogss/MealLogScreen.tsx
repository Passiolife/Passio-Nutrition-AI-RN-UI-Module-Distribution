import React, { useMemo, useState } from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import type { ParamList } from '../../navigaitons';
import MealLogsView from './views/MealLogsView';
import {
  BackNavigation,
  DatePicker,
  DashboardMenu,
  Text,
  DailyNutrition,
} from '../../components';
import { ICONS } from '../../assets';
import { dateFormatter, scaleHeight } from '../../utils';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useMealLogs } from './useMealLogs';
import { content } from '../../constants/Content';
import { QuickSuggestions } from './views/QuickSuggesstions';
import { useQuickSuggestion } from '../../hooks/useQuickSuggestion';
import BottomSheet from '@gorhom/bottom-sheet';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useBranding } from '../../contexts';
import mealLogScreenStyle from './styles';

export type MealLogScreenNavigationProps = StackNavigationProp<
  ParamList,
  'MealLogScreen'
>;

export interface MealLogScreenProps {
  defaultDate?: Date;
  onDateChange?: (defaultDate: Date) => void;
}

const MealLogScreen = () => {
  return <MealLogScreenView />;
};

export const MealLogScreenView = gestureHandlerRootHOC(() => {
  const {
    bottomSheetModalRef,
    date,
    foodLogs,
    isOpenDatePicker,
    changeDate,
    navigateToEditFoodLog,
    onQuickSuggestionPress,
    onDeleteFoodLog,
    openDatePicker,
  } = useMealLogs();

  const snapPoints = useMemo(() => [scaleHeight(100), '50%'], []);

  const { quickSuggestedFoodItems, removeQuickSuggestion } =
    useQuickSuggestion(foodLogs);

  const [isLoadingScreen, setLoadingScreen] = useState(false);

  const styles = mealLogScreenStyle(useBranding());

  return (
    <>
      <View style={styles.bodyContainer} testID="testView">
        <BackNavigation
          title={content.myDiary}
          bottomStyle={styles.bottomStyle}
          rightSide={<DashboardMenu />}
          bottomView={
            <View style={styles.headerBodyContainer}>
              <TouchableOpacity
                style={styles.headerBodyIconLayout}
                onPress={() =>
                  changeDate(new Date(date.setDate(date.getDate() - 1)))
                }
              >
                <Image source={ICONS.left} style={styles.headerBodyIcon} />
              </TouchableOpacity>
              <TouchableOpacity
                testID="testOpenDatePicker"
                onPress={() => openDatePicker(true)}
                style={styles.datePickerContainer}
              >
                <Image source={ICONS.calendar} style={styles.calendarIcon} />
                <Text
                  weight="600"
                  size="_14px"
                  numberOfLines={1}
                  style={styles.headerDate}
                >
                  {dateFormatter(date)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerBodyIconLayout}
                onPress={() =>
                  changeDate(new Date(date.setDate(date.getDate() + 1)))
                }
              >
                <Image source={ICONS.right} style={styles.headerBodyIcon} />
              </TouchableOpacity>
            </View>
          }
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          onLayout={(event) => {
            if (isLoadingScreen === false) {
              setLoadingScreen(event.nativeEvent.layout.height > 0);
            }
          }}
          style={styles.scrollViewStyle}
        >
          <DailyNutrition foodLogs={foodLogs} />
          {isLoadingScreen && (
            <>
              <MealLogsView
                isAddEnable={true}
                onDeleteFoodLog={onDeleteFoodLog}
                foodLogs={foodLogs}
                navigateToEditFoodLog={navigateToEditFoodLog}
              />
              <View style={styles.bottomFakeView} />
            </>
          )}
        </ScrollView>

        <DatePicker
          isDatePickerVisible={isOpenDatePicker}
          handleConfirm={changeDate}
          hideDatePicker={() => openDatePicker(false)}
          selectedDate={date}
        />
      </View>
      <BottomSheet
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backgroundStyle={styles.bottomSheetChildrenContainer}
      >
        <QuickSuggestions
          onFoodLog={(suggestion) => {
            onQuickSuggestionPress(suggestion, false);
            removeQuickSuggestion(suggestion);
          }}
          onFoodLogEditor={(suggestion) => {
            onQuickSuggestionPress(suggestion, true);
          }}
          quickSuggestedAttributes={quickSuggestedFoodItems ?? []}
        />
      </BottomSheet>
    </>
  );
});

export default MealLogScreen;
