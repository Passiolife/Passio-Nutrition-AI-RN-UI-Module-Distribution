import { View } from 'react-native';

import React from 'react';
import { foodCreatorStyle } from './FoodCreator.styles';
import { useFoodCreator } from './useFoodCreator';
import { BackNavigation, BasicButton } from '../../components';
import { FoodCreatorFoodDetail } from './views/FoodCreatorFoodDetail';
import { RequireNutritionFacts } from './views/RequireNutritionFacts';
import { OtherNutritionFacts } from './views/OtherNutritionFacts';
import ImagePickerOptions from '../../components/imagePickerOptions/ImagePickerOptions';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export const FoodCreatorScreen = () => {
  const {
    title,
    branding,
    from,
    otherNutritionFactsRef,
    requireNutritionFactsRef,
    foodCreatorFoodDetailRef,
    barcode,
    foodLog,
    image,
    isImagePickerVisible,
    onSavePress,
    onNutritionFactSave,
    onDeletePress,
    isDeleteButtonVisible,
    onCancelPress,
    onBarcodePress,
    onEditImagePress,
    onSelectImagePress,
    closeImagePickerModal,
  } = useFoodCreator();

  const styles = foodCreatorStyle(branding);

  return (
    <View style={styles.body}>
      <BackNavigation title={title} />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        automaticallyAdjustKeyboardInsets
      >
        <View>
          <FoodCreatorFoodDetail
            foodLog={foodLog}
            barcode={barcode}
            ref={foodCreatorFoodDetailRef}
            onBarcodePress={onBarcodePress}
            onEditImagePress={onEditImagePress}
            image={image}
            isNutritionFact={from === 'NutritionFact'}
          />
          <RequireNutritionFacts
            foodLog={foodLog}
            ref={requireNutritionFactsRef}
          />

          <OtherNutritionFacts foodLog={foodLog} ref={otherNutritionFactsRef} />

          <View
            style={{
              flexDirection: 'row',
              marginVertical: 22,
              marginHorizontal: 16,
            }}
          >
            <BasicButton
              text={'Cancel'}
              onPress={onCancelPress}
              secondary
              style={{
                flexDirection: 'row',
                flex: 1,
                marginHorizontal: 4,
                height: 50,
              }}
            />
            {isDeleteButtonVisible && (
              <BasicButton
                text={'Delete'}
                onPress={onDeletePress}
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  backgroundColor: branding.error,
                  borderColor: branding.error,
                  height: 50,
                }}
              />
            )}
            {from === 'NutritionFact' ? (
              <BasicButton
                text={'Done'}
                onPress={onNutritionFactSave}
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  marginHorizontal: 4,
                  height: 50,
                }}
              />
            ) : (
              <BasicButton
                text={'Save'}
                onPress={onSavePress}
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  marginHorizontal: 4,
                  height: 50,
                }}
              />
            )}
          </View>
          <View style={{ height: 100 }} />
        </View>
      </KeyboardAwareScrollView>

      {isImagePickerVisible && (
        <ImagePickerOptions
          onCloseModel={closeImagePickerModal}
          onSelectGallery={async () => onSelectImagePress('gallery')}
          onSelectCamera={async () => onSelectImagePress('camera')}
        />
      )}
    </View>
  );
};
