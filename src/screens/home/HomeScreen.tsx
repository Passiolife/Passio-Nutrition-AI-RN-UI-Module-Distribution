import React from 'react';
import { Image, ScrollView, TouchableOpacity, View } from 'react-native';
import {
  BackNavigation,
  DatePicker,
  DashboardMenu,
  Text,
  DailyNutrition,
  WidgetsCard,
} from '../../components';
import { ICONS } from '../../assets';
import { dateFormatter } from '../../utils';
import { withLoading } from '../../components/withLoading';
import { content } from '../../constants/Content';
import { useHome } from './useHome';
// import WeeklyAdherence from '../../components/weeklyAddhernce/WeeklyAdherence';
import { useBranding } from '../../contexts';
import homeScreenStyle from './styles';
// import { DateTime } from 'luxon';

export interface HomeScreenScreenProps {
  defaultDate?: Date;
  onDateChange?: (defaultDate: Date) => void;
}

const HomeScreen = () => {
  return <HomeScreenView />;
};

const HomeScreenView = () => {
  const {
    foodLogs,
    achievedWater,
    achievedWeight,
    remainWater,
    remainWeight,
    unitOfWater,
    unitOfWeight,
    name,
    date,
    isOpenDatePicker,
    openDatePicker,
    changeDate,
    onWaterPress,
    onWeightPress,
  } = useHome();
  const styles = homeScreenStyle(useBranding());

  return (
    <View style={styles.bodyContainer} testID="testView">
      <BackNavigation
        title={content.welcome + ' ' + (name ?? '')}
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
        style={styles.scrollViewStyle}
      >
        <DailyNutrition foodLogs={foodLogs} />

        {/* <WeeklyAdherence headerDate={DateTime.fromJSDate(date)} /> */}

        <View style={styles.widgetsContainer}>
          <WidgetsCard
            widgetTitle="Water"
            leftIcon={ICONS.blueWaterDrop}
            rightIcon={ICONS.newAddPlus}
            value={Math.round(achievedWater)}
            onPressRightIcon={onWaterPress}
            unitValue={unitOfWater}
            remain={Math.round(remainWater)}
          />
          <WidgetsCard
            widgetTitle="Weight"
            onPressRightIcon={onWeightPress}
            leftIcon={ICONS.blueWeightMachine}
            rightIcon={ICONS.newAddPlus}
            value={Math.round(achievedWeight)}
            unitValue={unitOfWeight}
            remain={Math.round(remainWeight)}
          />
        </View>
      </ScrollView>
      <DatePicker
        isDatePickerVisible={isOpenDatePicker}
        handleConfirm={changeDate}
        hideDatePicker={() => openDatePicker(false)}
        selectedDate={date}
      />
    </View>
  );
};

export default withLoading(HomeScreen);
