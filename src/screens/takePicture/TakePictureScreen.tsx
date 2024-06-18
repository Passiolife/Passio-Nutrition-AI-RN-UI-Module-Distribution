import React from 'react';
import { takePictureStyle } from './takePicture.styles';
import { useTakePicture } from './useTakePicture';
import { useBranding } from '../../contexts';
import { ActivityIndicator, Text, View } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { PictureLoggingResult } from './views/PictureLoggingResult';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { TakePicture } from './TakePicture';
import { SelectPhotos } from './SelectPhotos';

export const TakePictureScreen = gestureHandlerRootHOC(() => {
  const {
    type,
    recognizePictureRemote,
    snapPoints,
    bottomSheetModalRef,
    onLogSelectPress,
    passioAdvisorFoodInfo,
    onRetakePress,
    isFetchingResponse,
    takePictureRef,
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
        />
      ) : (
        <SelectPhotos recognizePictureRemote={recognizePictureRemote} />
      )}
      <BottomSheet
        ref={bottomSheetModalRef}
        index={-1}
        animatedIndex={animatedIndex}
        snapPoints={snapPoints}
        backgroundStyle={styles.bottomSheetChildrenContainer}
        handleIndicatorStyle={{ display: 'none' }}
      >
        <PictureLoggingResult
          onLogSelect={onLogSelectPress}
          onRetake={onRetakePress}
          type={type}
          passioAdvisorFoodInfoResult={passioAdvisorFoodInfo ?? []}
        />
      </BottomSheet>
    </>
  );
});
