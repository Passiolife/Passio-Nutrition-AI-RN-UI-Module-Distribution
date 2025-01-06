import React from 'react';
import { takePictureStyle } from '../takePicture/takePicture.styles';
import { usePhotoLogging } from './usePhotoLogging';
import { useBranding } from '../../contexts';
import { View } from 'react-native';
import { PictureLoggingResult } from './result/PictureLoggingResult';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { BackNavigation, MacrosProgressView, Text } from '../../components';
import FakeProgress from '../../components/progressBard/FakeProgress';
import { Dropdown } from 'react-native-element-dropdown';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EditServingSizeModal } from './modal/EditServingSizeModal';

export const PhotoLoggingScreen = gestureHandlerRootHOC(() => {
  const {
    mealTimes,
    meal,
    setMeal,
    onLogSelectPress,
    passioAdvisorFoodInfo,
    isFetchingResponse,
    isPreparingLog,
    editServingInfoRef,
    onUpdateFoodItem,
  } = usePhotoLogging();

  const branding = useBranding();
  const styles = takePictureStyle(branding);

  const renderHeader = () => {
    return (
      <View style={{ marginTop: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: 8,
          }}
        >
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text color="secondaryText" size="_12px">
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
                paddingVertical: 6,
                paddingHorizontal: 8,
              }}
              onChange={(value) => {
                setMeal(value.value);
              }}
            />
          </View>
          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text color="secondaryText" size="_12px">
              Timestamp
            </Text>
            <Dropdown
              data={mealTimes}
              labelField={'label'}
              value={'value'}
              valueField={'value'}
              style={{
                borderWidth: 1,
                marginVertical: 4,
                borderColor: branding.border,
                paddingVertical: 6,
                paddingHorizontal: 8,
              }}
              onChange={(value) => {
                setMeal(value.value);
              }}
            />
          </View>
        </View>
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
    </SafeAreaView>
  );
});
