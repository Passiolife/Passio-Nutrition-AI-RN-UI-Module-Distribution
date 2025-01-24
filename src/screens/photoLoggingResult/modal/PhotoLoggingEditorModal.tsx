import React, { forwardRef, useImperativeHandle } from 'react';
import { Alert, Modal, StyleSheet, View } from 'react-native';
import {
  getNutrientsOfPassioFoodItem,
  scaleHeight,
  scaleWidth,
} from '../../../utils';
import type { Branding } from '../../../contexts';
import type { PhotoLoggingResults } from '../usePhotoLogging';
import { usePhotoLoggingEditor } from './usePhotoLoggingEditor';
import { EditNutritionFact } from './nutritionFact/EditNutritionFactModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { EditServingSizeModal } from './servingSize/EditServingSizeModal';
import { isMissingNutrition } from '../../../utils/V3Utils';

export type PhotoLoggingType = 'serving' | 'nutritionFact';
interface EditServingSizeProps {
  onUpdateFoodItem?: (
    photoLoggingResults: PhotoLoggingResults,
    from: PhotoLoggingType,
    isSamePreviousValue?: boolean
  ) => void;
  openNutritionFactFromServing?: (result: PhotoLoggingResults) => void;
  onCancelPress?: () => void;
  nutritionFactButtonName?: string;
  nutritionFactNote?: JSX.Element;
}

export interface PhotoLoggingBarcodeRef {
  open: (result: PhotoLoggingResults) => void;
  openNutritionFact: (result: PhotoLoggingResults) => void;
}
export const PhotoLoggingEditorModal = forwardRef<
  PhotoLoggingBarcodeRef,
  EditServingSizeProps
>((props, ref) => {
  const {
    branding,
    handleNutritionFactCloseClick,
    isOpen,
    openEditServingPopup,
    editNutritionFactRef,
    result,
    setResult,
    handleBarcodeClick,
    editType,
    setEditType,
    releaseEditor,
  } = usePhotoLoggingEditor();

  useImperativeHandle(ref, () => ({
    open: (item) => {
      if (item.passioFoodItem) {
        if (isMissingNutrition(item.passioFoodItem)) {
          setEditType('nutrient');
        } else {
          setEditType('serving');
        }
        openEditServingPopup(item);
      } else {
        Alert.alert('Item not found');
      }
    },
    openNutritionFact: (item) => {
      setEditType('nutrient');
      openEditServingPopup(item);
    },
  }));

  const styles = customStyles(branding);

  if (!isOpen) {
    return null;
  }

  if (!result) {
    return null;
  }
  if (!result.passioFoodItem) {
    return null;
  }

  const renderEditServingSize = () => {
    return (
      <EditServingSizeModal
        result={result}
        onUpdateFoodItem={(item) => {
          props.onUpdateFoodItem?.(item, 'serving');
          releaseEditor();
        }}
        openNutritionFactModificationPopup={(item) => {
          setEditType('edit-serving-to-nutrient');
          setResult(item);
        }}
        onClose={releaseEditor}
      />
    );
  };

  const renderEditNutritionFact = () => {
    if (!result.passioFoodItem) {
      return null;
    }
    return (
      <EditNutritionFact
        result={result.passioFoodItem}
        ref={editNutritionFactRef}
        isCustomFoodAlreadyAdded={result.customFood !== undefined}
        assets={result.assets}
        button={props.nutritionFactButtonName}
        note={props.nutritionFactNote}
        onDone={(updatedResult, isSamePreviousValue) => {
          props?.onUpdateFoodItem?.(
            {
              ...result,
              passioFoodItem: updatedResult,
              nutrients: getNutrientsOfPassioFoodItem(
                updatedResult,
                updatedResult.amount.weight
              ),
            },
            'nutritionFact',
            isSamePreviousValue
          );
          releaseEditor();
        }}
        openBarcodeScanner={(updatedResult) => {
          handleBarcodeClick?.({
            ...result,
            passioFoodItem: updatedResult,
            nutrients: getNutrientsOfPassioFoodItem(
              updatedResult,
              updatedResult.amount.weight
            ),
          });
        }}
        onClose={props?.onCancelPress || handleNutritionFactCloseClick}
      />
    );
  };

  return (
    <Modal visible transparent>
      <View style={styles.modalContainer}>
        <KeyboardAwareScrollView
          contentContainerStyle={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: 0,
          }}
        >
          <View style={{ flex: 1 }} />
          <View style={[styles.card]}>
            {editType === 'nutrient' || editType === 'edit-serving-to-nutrient'
              ? renderEditNutritionFact()
              : renderEditServingSize()}
          </View>
          <View style={{ flex: 1 }} />
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
});

const customStyles = ({ border, white }: Branding) =>
  StyleSheet.create({
    servingSizeContainer: { flexDirection: 'row' },
    slider: {
      marginVertical: 16,
      width: '100%',
    },
    card: {
      padding: scaleWidth(16),
      backgroundColor: white,
      marginVertical: 8,
      marginHorizontal: scaleWidth(16),
      paddingVertical: 8,
      borderRadius: 8,
      shadowColor: '#00000029',
      shadowOpacity: 1,
      shadowOffset: {
        width: 1.0,
        height: 2.0,
      },
      shadowRadius: 0.5,
      elevation: 1,
    },
    servingSizeTitle: {
      alignSelf: 'flex-start',
      marginVertical: scaleHeight(16),
    },
    dropDown: {
      borderWidth: 1,
      marginHorizontal: scaleWidth(8),
      borderColor: border,
      flex: 1,
      borderRadius: 8,
      paddingVertical: 16,
      paddingHorizontal: 8,
    },
    input: {
      paddingVertical: 16,
      borderColor: border,
      width: scaleWidth(52),
      backgroundColor: 'white',
      borderWidth: 1,
      borderRadius: 8,
      textAlign: 'center',
      fontSize: 16,
    },
    buttonContainer: { flexDirection: 'row', marginBottom: 16 },
    nutrientsContainer: {
      flexDirection: 'row',
      marginStart: 16,
    },
    title: { alignSelf: 'center', marginVertical: 16 },
    modalContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      flex: 1,
    },
    flex1: {
      flex: 1,
    },
    allNutrientsContainer: {
      flexDirection: 'row',
      flex: 1,
      alignSelf: 'flex-start',
      marginTop: 8,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: white,
    },
    imageContainer: {
      width: 42,
      borderRadius: 32,
      overflow: 'hidden',
      alignSelf: 'center',
    },
    image: {
      width: 42,
      height: 42,
      aspectRatio: 1,
    },
    text: {
      textTransform: 'capitalize',
      marginStart: 8,
      marginVertical: 2,
      marginRight: 10,
    },
    bottom: {
      marginStart: 8,
      marginVertical: 2,
      marginRight: 10,
    },
    secondaryText: {},
  });
