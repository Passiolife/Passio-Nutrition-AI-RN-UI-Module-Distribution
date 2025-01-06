import React from 'react';
import { takePictureStyle } from '../takePicture/takePicture.styles';
import { usePhotoLogging } from './usePhotoLogging';
import { useBranding } from '../../contexts';
import { TouchableOpacity, View } from 'react-native';
import { PictureLoggingResult } from './result/PictureLoggingResult';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import {
  BackNavigation,
  DatePicker,
  MacrosProgressView,
  Text,
} from '../../components';
import FakeProgress from '../../components/progressBard/FakeProgress';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EditServingSizeModal } from './modal/EditServingSizeModal';
import { dateFormatter } from '../../utils';

export const PhotoLoggingScreen = gestureHandlerRootHOC(() => {
  const {
    changeDate,
    date,
    editServingInfoRef,
    isFetchingResponse,
    isOpenDatePicker,
    isPreparingLog,
    meal,
    mealTimes,
    onLogSelectPress,
    onUpdateFoodItem,
    openDatePicker,
    passioAdvisorFoodInfo,
    setMeal,
  } = usePhotoLogging();

  const branding = useBranding();
  const styles = takePictureStyle(branding);

  const renderHeader = () => {
    return (
      <View>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 8,
          }}
        >
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text color="secondaryText" size="_14px" weight="500">
              Meal Time
            </Text>
            <Dropdown
              data={mealTimes}
              labelField={'label'}
              value={meal}
              valueField={'value'}
              style={{
                borderWidth: 1,
                marginVertical: 4,
                borderColor: branding.border,
                paddingVertical: 12,
                borderRadius: 8,
                paddingHorizontal: 8,
              }}
              onChange={(value) => {
                setMeal(value.value);
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => openDatePicker(true)}
            style={{ flex: 1, marginHorizontal: 12 }}
          >
            <Text color="secondaryText" size="_14px" weight="500">
              Timestamp
            </Text>
            <Text
              style={{
                borderWidth: 1,
                marginVertical: 4,
                borderColor: branding.border,
                paddingVertical: 12,
                borderRadius: 8,
                paddingHorizontal: 8,
              }}
            >
              {dateFormatter(date)}
            </Text>
          </TouchableOpacity>
        </View>
        {!isFetchingResponse && (
          <MacrosProgressView
            calories={{
              consumed: 1512,
              target: 447,
            }}
            carbs={{
              consumed: 170,
              target: 27,
            }}
            protein={{
              consumed: 113,
              target: 17,
            }}
            fat={{
              consumed: 42,
              target: 29,
            }}
          />
        )}
        <View
          style={{
            shadowColor: '#000',
            height: 1,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 3.0,
            elevation: 5,
            backgroundColor: '#fff',
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.generatingResultLoading}>
      <BackNavigation
        title="Your Results"
        bottomView={renderHeader()}
        cardStyle={{
          shadowRadius: 0,
          shadowOpacity: 0.0,
          elevation: 0,
        }}
      />
      {isFetchingResponse ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
          }}
        >
          <FakeProgress
            data={[]}
            loading={isFetchingResponse}
            isNutritionLabelProgress
          />
        </View>
      ) : (
        <PictureLoggingResult
          onLogSelect={onLogSelectPress}
          onEditServingInfo={(item) => {
            editServingInfoRef.current?.open?.(item);
          }}
          isPreparingLog={isPreparingLog}
          passioAdvisorFoodInfoResult={passioAdvisorFoodInfo ?? []}
        />
      )}
      <EditServingSizeModal
        ref={editServingInfoRef}
        onUpdateFoodItem={onUpdateFoodItem}
      />
      <DatePicker
        isDatePickerVisible={isOpenDatePicker}
        handleConfirm={changeDate}
        hideDatePicker={() => openDatePicker(false)}
        selectedDate={date}
      />
    </SafeAreaView>
  );
});
