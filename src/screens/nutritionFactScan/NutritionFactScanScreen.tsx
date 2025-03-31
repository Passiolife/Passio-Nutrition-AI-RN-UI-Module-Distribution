import React from 'react';
import { useNutritionFactsScanner } from './useNutritionFactsScanner';
import {
  BackNavigation,
  BasicButton,
  ItemAddedToDairyViewModal,
  NutritionNotFoundModal,
  Text,
} from '../../components';
import { Image, StyleSheet, View } from 'react-native';
import { TakePicture } from '../takePicture/views/TakePicture';
import { useSharedValue } from 'react-native-reanimated';
import { Branding, useBranding } from '../../contexts';
import { scaleHeight, scaleWidth } from '../../utils';
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
    introductionNutritionModalRef,
    onOkayPress,
    onEnterManually,
    onTryAgain,
    nutritionNotFoundModalRef,
    onViewDiaryPress,
    setType,
    onCancelPress,
    initializeCamera,
  } = useNutritionFactsScanner();
  const animatedIndex = useSharedValue<number>(0);
  const branding = useBranding();
  const styles = customStyle(branding);

  const renderImage = () => {
    return (
      <View style={{ flex: 1, marginTop: scaleHeight(24) }}>
        <Image
          style={styles.image}
          source={{ uri: `file://${url}` }}
          resizeMethod="resize"
          resizeMode="cover"
        />
        <FakeProgress
          data={[]}
          style={{
            position: undefined,
            top: 0,
            marginTop: scaleHeight(24),
          }}
          title="Analyzing Photo..."
          loading={type === 'scanning'}
          isNutritionLabelProgress={true}
        />
        <BasicButton
          text="Cancel"
          onPress={onCancelPress}
          style={{
            marginVertical: 9,
            maxWidth: scaleWidth(150),
            alignSelf: 'center',
          }}
        />
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <BackNavigation title={url ? 'Photo Preview' : 'Barcode Scan'} />
      {(() => {
        switch (type) {
          case 'camera':
            return (
              <>
                {initializeCamera && (
                  <TakePicture
                    recognizePictureRemote={recognizePictureRemote}
                    animatedIndex={animatedIndex}
                  />
                )}
              </>
            );
          default:
            return renderImage();
        }
      })()}
      <PhotoLoggingEditorModal
        ref={editNutritionFactRef}
        nutritionFactButtonName="Save & Log"
        updateButtonName="Update & Log"
        nutritionFactNote={
          <Text weight="400" size="_14px">
            Logging this item will create a custom food. You can edit this item
            from your
            <Text weight="700" size="_14px">
              {' My Foods '}
            </Text>
            <Text weight="400" size="_14px">
              list
            </Text>
          </Text>
        }
        onUpdateFoodItem={onUpdateFoodItem}
        onCancelPress={onCancelPress}
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
      <NutritionNotFoundModal
        ref={introductionNutritionModalRef}
        title="Capture Nutrition Facts Label"
        note="Capture a photo of the entire Nutrition Facts Label"
        onEnterManually={onOkayPress}
        action="Ok"
      />
    </View>
  );
};

const customStyle = ({}: Branding) => {
  return StyleSheet.create({
    image: {
      backgroundColor: 'black',
      borderRadius: 20,
      height: scaleHeight(500),
      marginHorizontal: 20,
      resizeMode: 'contain',
    },
  });
};
