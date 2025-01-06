import React, { forwardRef, useImperativeHandle } from 'react';
import { Modal, StyleSheet, View, TextInput } from 'react-native';
import { BasicButton, Text } from '../../../components';
import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';
import { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3';
import { scaleHeight, scaleWidth } from '../../../utils';
import { Dropdown } from 'react-native-element-dropdown';
import { Branding } from '../../../contexts';
import Slider from '@react-native-community/slider';
import { PhotoLoggingResults } from '../usePhotoLogging';
import { useEditServing } from './useEditServing';

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
  } = useEditServing();
  useImperativeHandle(ref, () => ({
    open: openEditServingPopup,
  }));

  const styles = customStyles(branding);

  if (!isOpen) {
    return null;
  }

  if (!result) {
    return null;
  }

  const name = result?.passioFoodItem?.name || result?.foodDataInfo?.foodName;
  const iconID = result?.passioFoodItem?.iconId || result?.foodDataInfo?.iconID;
  const bottom = `${result?.passioFoodItem?.amount.selectedQuantity || result?.foodDataInfo?.nutritionPreview?.servingQuantity} ${result.passioFoodItem?.amount.selectedUnit || result?.foodDataInfo?.nutritionPreview?.servingUnit} (${weight} g)`;
  const [min, max, steps] = sliderConfig;
  return (
    <Modal visible transparent>
      <View style={styles.modalContainer}>
        <View style={styles.flex1} />
        <View style={styles.card}>
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
              inputMode="decimal"
              returnKeyLabel="Done"
              returnKeyType="done"
              style={styles.input}
              ref={qtyTextInputRef}
              onChangeText={handleQtyUpdate}
              defaultValue={`${quantity}`}
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
            ref={sliderRef}
            maximumValue={max}
            onValueChange={(value) => {
              handleQtyUpdate(value.toString(), true);
            }}
            minimumTrackTintColor={branding.primaryColor}
            maximumTrackTintColor={branding.border}
          />

          <View style={styles.buttonContainer}>
            <BasicButton
              text={'Cancel'}
              onPress={close}
              secondary
              style={{ flex: 1, marginEnd: 8 }}
            />
            <BasicButton
              text={'Done'}
              style={{ flex: 1, marginStart: 8 }}
              onPress={() => {
                handleDoneClick(props);
              }}
            />
          </View>
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
      alignItems: 'center',
      padding: scaleWidth(16),
      backgroundColor: white,
      marginVertical: 8,
      marginHorizontal: 8,
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
