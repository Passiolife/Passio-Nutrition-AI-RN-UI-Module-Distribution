import React from 'react';
import { useNutritionFactsScanner } from './useNutritionFactsScanner';
import {
  BackNavigation,
  ItemAddedToDairyViewModal,
  NutritionNotFoundModal,
} from '../../components';
import { Image, StyleSheet, View } from 'react-native';
import { TakePicture } from '../takePicture/views/TakePicture';
import { useSharedValue } from 'react-native-reanimated';
import { Branding, useBranding } from '../../contexts';
import { scaleHeight, screenHeight } from '../../utils';
import FakeProgress from '../../components/progressBard/FakeProgress';
import { PhotoLoggingEditorModal } from '../photoLoggingResult/modal/PhotoLoggingEditorModal';

export const NutritionFactScanScreen = () => {
  const {
    type,
    recognizePictureRemote,
    url,
    onUpdateFoodItem,
    editNutritionFactRef,
    itemAddedToDairyViewModalRef,
    onEnterManually,
    onTryAgain,
    nutritionNotFoundModalRef,
    onViewDiaryPress,
    setType,
  } = useNutritionFactsScanner();
  const animatedIndex = useSharedValue<number>(0);
  const branding = useBranding();
  const styles = customStyle(branding);

  const renderImage = () => {
    return (
      <View style={{ flex: 1, marginTop: scaleHeight(24) }}>
        <Image style={styles.image} source={{ uri: url }} />
        <FakeProgress
          data={[]}
          style={{
            position: undefined,
            top: 0,
            marginTop: scaleHeight(24),
          }}
          loading={type === 'scanning'}
          isNutritionLabelProgress={true}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <BackNavigation />
      {(() => {
        switch (type) {
          case 'camera':
            return (
              <TakePicture
                recognizePictureRemote={recognizePictureRemote}
                animatedIndex={animatedIndex}
              />
            );
          default:
            return renderImage();
        }
      })()}
      <PhotoLoggingEditorModal
        ref={editNutritionFactRef}
        onUpdateFoodItem={onUpdateFoodItem}
      />
      <ItemAddedToDairyViewModal
        ref={itemAddedToDairyViewModalRef}
        action="Add More"
        onViewDiaryPress={onViewDiaryPress}
        onContinuePress={() => {
          itemAddedToDairyViewModalRef.current?.close();
          setType('camera');
        }}
      />
      <NutritionNotFoundModal
        ref={nutritionNotFoundModalRef}
        onTryAgain={onTryAgain}
        onEnterManually={onEnterManually}
      />
    </View>
  );
};

const customStyle = ({ white, indigo50 }: Branding) => {
  return StyleSheet.create({
    image: {
      backgroundColor: 'black',
      borderRadius: 20,
      height: scaleHeight(screenHeight / 2),
      marginHorizontal: 20,
      resizeMode: 'contain',
    },
  });
};
