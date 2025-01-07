import React, { forwardRef, useImperativeHandle } from 'react';
import { Modal, StyleSheet, View, TextInput } from 'react-native';
import { BasicButton, Text } from '../../../components';
import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';
import { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3';
import { scaleHeight, scaleWidth } from '../../../utils';
import { Dropdown } from 'react-native-element-dropdown';
import { Branding } from '../../../contexts';
import Slider, { SliderReferenceType } from '@react-native-community/slider';
import { PhotoLoggingResults } from '../usePhotoLogging';
import { useEditServing } from './useEditServing';
import { EditNutritionFact } from './EditNutritionFactModal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { formatNumber } from '../../../utils/NumberUtils';
import { SCANNED_NUTRITION_LABEL } from '../result/PictureLoggingResult';

export interface EditServingSizeProps {
  onUpdateFoodItem?: (photoLoggingResults: PhotoLoggingResults) => void;
}

export interface EditServingSizeRef {
  open: (result: PhotoLoggingResults) => void;
}
export const EditServingSizeModal = forwardRef<
  EditServingSizeRef,
  EditServingSizeProps
>((props, ref) => {
  const {
    branding,
    close,
    handleQtyUpdate,
    handleServingChange,
    isOpen,
    openEditServingPopup,
    qtyTextInputRef,
    sliderRef,
    quantity,
    result,
    selectedUnit,
    servingSizes,
    weight,
    sliderConfig,
    handleDoneClick,
    onEditServingBackPress,
    editType,
    setEditType,
    setOpen,
  } = useEditServing();
  useImperativeHandle(ref, () => ({
    open: (item) => {
      if (item.resultType === 'nutritionFacts') {
        setEditType('nutrient');
      } else {
        setEditType('serving');
      }
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

  const name =
    result?.passioFoodItem?.name ||
    result?.foodDataInfo?.foodName ||
    (result.resultType === 'nutritionFacts' ? SCANNED_NUTRITION_LABEL : '');
  const iconID = result?.passioFoodItem?.iconId || result?.foodDataInfo?.iconID;
  const bottom = `${quantity} ${selectedUnit} (${formatNumber(weight)} g)`;
  const [min, max, steps] = sliderConfig;

  const renderEditServingSize = () => {
    return (
      <>
        <Text size={'_20px'} weight={'700'} style={styles.title}>
          Adjust Serving Size
        </Text>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <PassioFoodIcon
              style={styles.image}
              iconID={iconID}
              entityType={PassioIDEntityType.group}
            />
          </View>
          <View
            style={{
              flex: 1,
            }}
          >
            <Text weight="600" size="_14px" style={styles.text}>
              {name}
            </Text>
            <Text
              weight="400"
              color="secondaryText"
              size="_14px"
              style={[styles.bottom, styles.secondaryText]}
            >
              {bottom}
            </Text>
          </View>
        </View>
        <Text size={'_16px'} weight={'600'} style={styles.servingSizeTitle}>
          Serving Size
        </Text>
        <View style={styles.servingSizeContainer}>
          <TextInput
            keyboardType="numeric"
            returnKeyLabel="Done"
            returnKeyType="done"
            style={styles.input}
            ref={qtyTextInputRef}
            defaultValue={`${quantity}`}
            onBlur={(e) => handleQtyUpdate(e.nativeEvent.text, false)}
            onSubmitEditing={(e) =>
              handleQtyUpdate(e.nativeEvent.text.toString(), false)
            }
          />
          <Dropdown
            data={servingSizes}
            labelField={'label'}
            value={selectedUnit}
            valueField={'value'}
            style={styles.dropDown}
            onChange={handleServingChange}
          />
        </View>
        <Slider
          step={steps}
          minimumValue={min}
          style={styles.slider}
          value={quantity}
          ref={sliderRef as unknown as SliderReferenceType}
          maximumValue={max}
          onValueChange={(value) => {
            handleQtyUpdate(value.toString(), true);
          }}
          minimumTrackTintColor={branding.primaryColor}
          maximumTrackTintColor={branding.border}
        />

        <View style={styles.buttonContainer}>
          {editType === 'nutrient_with_serving' ? (
            <BasicButton
              text={'Back'}
              onPress={onEditServingBackPress}
              secondary
              style={{ flex: 1, marginEnd: 8 }}
            />
          ) : (
            <BasicButton
              text={'Cancel'}
              onPress={close}
              secondary
              style={{ flex: 1, marginEnd: 8 }}
            />
          )}
          <BasicButton
            text={'Done'}
            style={{ flex: 1, marginStart: 8 }}
            onPress={() => {
              handleDoneClick(props);
            }}
          />
        </View>
      </>
    );
  };

  const renderEditNutritionFact = () => {
    const calories =
      result?.nutrients?.calories?.value ||
      result?.foodDataInfo?.nutritionPreview?.calories;

    const carbs =
      result?.nutrients?.carbs?.value ||
      result?.foodDataInfo?.nutritionPreview?.carbs;

    const protein =
      result?.nutrients?.protein?.value ||
      result?.foodDataInfo?.nutritionPreview?.protein;

    const fat =
      result?.nutrients?.fat?.value ||
      result?.foodDataInfo?.nutritionPreview?.fat;

    const barcode = result?.passioFoodItem?.ingredients?.[0]?.metadata?.barcode;

    return (
      <EditNutritionFact
        calories={calories}
        carbs={carbs}
        protein={protein}
        result={result}
        barcode={barcode}
        servingQty={quantity}
        fat={fat}
        label={name}
        iconID={iconID}
        weight={weight}
        servingUnit={selectedUnit}
        onNext={(updatedResult) => {
          setEditType('nutrient_with_serving');
          openEditServingPopup(updatedResult);
        }}
        onHide={() => {
          setOpen(false);
        }}
        onShow={() => {
          setOpen(true);
        }}
        onClose={close}
      />
    );
  };

  return (
    <Modal visible transparent>
      <View style={styles.modalContainer}>
        <View style={styles.flex1} />

        <View style={styles.card}>
          <KeyboardAwareScrollView contentContainerStyle={{}}>
            {editType === 'nutrient'
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
