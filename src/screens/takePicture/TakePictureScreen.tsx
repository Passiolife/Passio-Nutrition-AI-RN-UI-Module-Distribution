import React from 'react';
import { takePictureStyle } from './takePicture.styles';
import { useTakePicture } from './useTakePicture';
import { useBranding } from '../../contexts';
import { ActivityIndicator, Text, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { PictureLoggingResult } from './result/PictureLoggingResult';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { TakePicture } from './views/TakePicture';
import { SelectPhotos } from './views/SelectPhotos';
import { NoResultFound } from './views/NoResultFound';

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
  return (
    <>
      {isFetchingResponse && (
        <View style={styles.generatingResultLoading}>
          <View
            style={{
              padding: 16,
              backgroundColor: '#FFFFFF80',
              borderRadius: 15,
            }}
          >
            <ActivityIndicator style={{ marginVertical: 8 }} color={'black'} />
            <Text style={{ color: 'black' }}>Generating results...</Text>
          </View>
        </View>
      )}
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
      <BottomSheet
        ref={bottomSheetModalRef}
        index={-1}
        snapPoints={snapPoints}
        backgroundStyle={styles.bottomSheetChildrenContainer}
        handleIndicatorStyle={{ display: 'none' }}
      >
        <PictureLoggingResult
          onLogSelect={onLogSelectPress}
          onRetake={onRetakePress}
          onCancel={onRetakePress}
          type={type}
          isPreparingLog={isPreparingLog}
          passioAdvisorFoodInfoResult={passioAdvisorFoodInfo ?? []}
        />
      </BottomSheet>
      <BottomSheet
        ref={noResultFoundRef}
        index={-1}
        snapPoints={snapPointsNoResultFound}
        backgroundStyle={styles.bottomSheetChildrenContainer}
        handleIndicatorStyle={{ display: 'none' }}
      >
        <NoResultFound
          onTryAgain={onRetakePress}
          onSearchManuallyPress={onSearchManuallyPress}
        />
      </BottomSheet>
    </>
  );
});
