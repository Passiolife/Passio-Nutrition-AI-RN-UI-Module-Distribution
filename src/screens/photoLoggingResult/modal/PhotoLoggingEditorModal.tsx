import React, { forwardRef, useImperativeHandle } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { scaleHeight, scaleWidth } from '../../../utils';
import { Branding } from '../../../contexts';
import { PhotoLoggingResults } from '../usePhotoLogging';
import { usePhotoLoggingEditor } from './usePhotoLoggingEditor';
import { EditNutritionFact } from './nutritionFact/EditNutritionFactModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { EditServingSizeModal } from './servingSize/EditServingSizeModal';
import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3';

export interface EditServingSizeProps {
  onUpdateFoodItem?: (photoLoggingResults: PhotoLoggingResults) => void;
  openNutritionFactFromServing?: (result: PhotoLoggingResults) => void;
}

export interface EditServingSizeRef {
  open: (result: PhotoLoggingResults) => void;
  openNutritionFact: (result: PhotoLoggingResults) => void;
}
export const PhotoLoggingEditorModal = forwardRef<
  EditServingSizeRef,
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
      if (item.resultType === 'nutritionFacts') {
        setEditType('nutrient');
      } else {
        setEditType('serving');
      }
      openEditServingPopup(item);
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
          props.onUpdateFoodItem?.(item);
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
        onDone={(updatedResult) => {
          props?.onUpdateFoodItem?.({
            ...result,
            passioFoodItem: updatedResult,
            nutrients: PassioSDK.getNutrientsOfPassioFoodItem(
              updatedResult,
              updatedResult.amount.weight
            ),
          });
          releaseEditor();
        }}
        openBarcodeScanner={handleBarcodeClick}
        onClose={handleNutritionFactCloseClick}
      />
    );
  };

  return (
    <Modal visible transparent>
      <View style={styles.modalContainer}>
        <View style={styles.flex1} />

        <View style={styles.card}>
          <KeyboardAwareScrollView contentContainerStyle={{}}>
            {editType === 'nutrient' || editType === 'edit-serving-to-nutrient'
              ? renderEditNutritionFact()
              : renderEditServingSize()}
          </KeyboardAwareScrollView>
        </View>

        <View style={styles.flex1} />
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
      marginHorizontal: scaleWidth(12),
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
