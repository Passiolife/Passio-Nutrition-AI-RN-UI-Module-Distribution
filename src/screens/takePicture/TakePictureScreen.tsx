import React from 'react';
import { takePictureStyle } from './takePicture.styles';
import { useTakePicture } from './useTakePicture';
import { useBranding } from '../../contexts';
import { View } from 'react-native';
import { PictureLoggingResult } from './result/PictureLoggingResult';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { TakePicture } from './views/TakePicture';
import { SelectPhotos } from './views/SelectPhotos';
import { BackNavigation, Text } from '../../components';
import FakeProgress from '../../components/progressBard/FakeProgress';
import { Dropdown } from 'react-native-element-dropdown';

interface Select {
  label: string;
  value: string;
}

const mealOptions: Select[] = [
  {
    label: 'Breakfast',
    value: 'Breakfast',
  },
  {
    label: 'Lunch',
    value: 'Lunch',
  },
  {
    label: 'Dinner',
    value: 'Dinner',
  },
  {
    label: 'Snack',
    value: 'Snack',
  },
  {
    label: 'Other',
    value: 'Other',
  },
];

export const TakePictureScreen = gestureHandlerRootHOC(() => {
  const {
    type,
    recognizePictureRemote,
    snapPoints,
    bottomSheetModalRef,
    noResultFoundRef,
    selectPhotoRef,
    onLogSelectPress,
    passioAdvisorFoodInfo,
    onRetakePress,
    onSearchManuallyPress,
    snapPointsNoResultFound,
    isFetchingResponse,
    takePictureRef,
    isPreparingLog,
  } = useTakePicture();

  const animatedIndex = useSharedValue<number>(0);
  const branding = useBranding();
  const styles = takePictureStyle(branding);

  const takePicture = () => {
    return (
      <>
        {isFetchingResponse === undefined && (
          <>
            {type === 'camera' ? (
              <TakePicture
                recognizePictureRemote={recognizePictureRemote}
                animatedIndex={animatedIndex}
                ref={takePictureRef}
                isMultiple
              />
            ) : (
              <SelectPhotos
                recognizePictureRemote={recognizePictureRemote}
                ref={selectPhotoRef}
                isMultiple
              />
            )}
          </>
        )}
      </>
    );
  };

  const renderHeader = () => {
    return (
      <View
        style={{ flexDirection: 'row', marginHorizontal: 8, marginBottom: 12 }}
      >
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text color="secondaryText" size="_12px">
            Meal Time
          </Text>
          <Dropdown
            data={mealOptions}
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
            onChange={(item) => console.log(item)}
          />
        </View>
        <View style={{ flex: 1, marginHorizontal: 12 }}>
          <Text color="secondaryText" size="_12px">
            Timestamp
          </Text>
          <Dropdown
            data={mealOptions}
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
            onChange={(item) => console.log(item)}
          />
        </View>
      </View>
    );
  };

  const result = () => {
    return (
      <>
        {isFetchingResponse !== undefined && (
          <View style={styles.generatingResultLoading}>
            <BackNavigation title="Your Results" bottomView={renderHeader()} />
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
                onRetake={onRetakePress}
                onCancel={onRetakePress}
                type={type}
                isPreparingLog={isPreparingLog}
                passioAdvisorFoodInfoResult={passioAdvisorFoodInfo ?? []}
              />
            )}
          </View>
        )}
      </>
    );
  };

  return (
    <>
      {takePicture()}
      {result()}
    </>
  );
});
