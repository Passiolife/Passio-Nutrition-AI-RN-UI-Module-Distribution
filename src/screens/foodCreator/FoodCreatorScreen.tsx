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
    branding,
    otherNutritionFactsRef,
    requireNutritionFactsRef,
    foodCreatorFoodDetailRef,
    foodLog,
    image,
    isImagePickerVisible,
    onSavePress,
    onCancelPress,
    onBarcodePress,
    onEditImagePress,
    onSelectImagePress,
    closeImagePickerModal,
  } = useFoodCreator();

  const styles = foodCreatorStyle(branding);

  return (
    <View style={styles.body}>
      <BackNavigation title="Food Creator" />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        automaticallyAdjustKeyboardInsets
      >
        <View>
          <FoodCreatorFoodDetail
            foodLog={foodLog}
            ref={foodCreatorFoodDetailRef}
            onBarcodePress={onBarcodePress}
            onEditImagePress={onEditImagePress}
            image={image}
          />
          <RequireNutritionFacts
            foodLog={foodLog}
            ref={requireNutritionFactsRef}
          />

          <OtherNutritionFacts foodLog={foodLog} ref={otherNutritionFactsRef} />
          <View style={{ height: 100 }} />
        </View>
      </KeyboardAwareScrollView>
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
            marginHorizontal: 8,
            height: 40,
          }}
        />
        <BasicButton
          text={'Save'}
          onPress={onSavePress}
          style={{
            flexDirection: 'row',
            flex: 1,
            marginHorizontal: 8,
            height: 40,
          }}
        />
      </View>
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
