import React, { forwardRef, useImperativeHandle } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardType,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { BasicButton, Text } from '../../../../components';
import {
  PassioFoodItem,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { scaleHeight, scaleWidth } from '../../../../utils';
import type { Branding } from '../../../../contexts';
import { formatNumber } from '../../../../utils/NumberUtils';
import { useEditNutritionFact } from './useEditNutritionFactModal';
import { ICONS } from '../../../../assets';

export interface EditNutritionFactProps {
  onClose?: () => void;
  onDone?: (result: PassioFoodItem) => void;
  result: PassioFoodItem;
  openBarcodeScanner?: (result: PassioFoodItem) => void;
  assets?: string;
  button?: string;
  note?: string | React.ReactElement;
}

export interface EditNutritionFactRef {
  barcode: (barcode: string) => void;
}
export const EditNutritionFact = forwardRef<
  EditNutritionFactRef,
  EditNutritionFactProps
>((props, ref) => {
  const {
    onUpdateNutritionUpdate,
    branding,
    info,
    servingInfo,
    onClose,
    caloriesRef,
    fatRef,
    proteinRef,
    carbsRef,
    macro,
    servingQtyRef,
    weightRef,
    nameRef,
    onBarcodePress,
    barcodeRef,
    barcodeTextInputRef,
    servingUnitRef,
    caloriesTextInputRef,
    carbsTextInputRef,
    nameTextInputRef,
    fatTextInputRef,
    proteinTextInputRef,
    servingQtyTextInputRef,
    selectedUnitTextInputRef,
    weightTextInputRef,
  } = useEditNutritionFact(props);
  const styles = customStyles(branding);

  const { button = 'Save', note } = props;

  const addMissingDataFromBarcode = async (barcode: string) => {
    const foodItem = await PassioSDK.fetchFoodItemForProductCode(barcode);
    if (foodItem) {
      const nutrients = PassioSDK.getNutrientsOfPassioFoodItem(
        foodItem,
        foodItem?.amount.weight
      );

      if (nutrients.calories && caloriesRef.current.trim().length === 0) {
        caloriesTextInputRef?.current?.setNativeProps?.({
          text: formatNumber(nutrients?.calories?.value)?.toString(),
        });
      }

      if (nutrients.carbs && carbsRef.current.trim().length === 0) {
        carbsTextInputRef?.current?.setNativeProps?.({
          text: formatNumber(nutrients?.carbs?.value)?.toString(),
        });
      }

      if (nutrients.protein && proteinRef.current.trim().length === 0) {
        proteinTextInputRef?.current?.setNativeProps?.({
          text: formatNumber(nutrients?.protein?.value)?.toString(),
        });
      }

      if (nutrients.fat && fatRef.current.trim().length === 0) {
        fatTextInputRef?.current?.setNativeProps?.({
          text: formatNumber(nutrients?.fat?.value)?.toString(),
        });
      }

      if (
        foodItem.amount.selectedUnit &&
        servingUnitRef.current.trim().length === 0
      ) {
        selectedUnitTextInputRef?.current?.setNativeProps?.({
          text: foodItem?.amount?.selectedUnit,
        });
      }

      if (
        foodItem?.amount.weight?.value &&
        (weightRef.current.trim().length === 0 || weightRef?.current === '0')
      ) {
        weightTextInputRef?.current?.setNativeProps?.({
          text: formatNumber(foodItem?.amount?.weight?.value)?.toString(),
        });
      }

      if (
        foodItem?.amount?.selectedQuantity &&
        (servingQtyRef.current.trim().length === 0 ||
          servingQtyRef?.current === '0')
      ) {
        servingQtyTextInputRef?.current?.setNativeProps?.({
          text: formatNumber(foodItem?.amount?.selectedQuantity)?.toString(),
        });
      }

      if (foodItem?.name && nameRef.current.trim().length === 0) {
        nameTextInputRef?.current?.setNativeProps?.({
          text: foodItem.name ?? '',
        });
      }
    }
  };

  useImperativeHandle(ref, () => ({
    barcode: async (item) => {
      barcodeRef.current = item;
      addMissingDataFromBarcode(item);
      barcodeTextInputRef?.current?.setNativeProps?.({ text: item });
    },
  }));

  const renderMacro = ({
    title,
    value,
    unit,
    flex = 1,
    keyboardType = 'numeric',
    alignSelf = 'center',
    storeRef,
    textInput,
  }: {
    title: string;
    unit: string;
    value: number | string;
    flex?: number;
    keyboardType?: KeyboardType;
    textInput: React.RefObject<TextInput>;
    alignSelf?: 'auto' | 'center' | 'left' | 'right' | 'justify' | undefined;
    storeRef: React.MutableRefObject<string>;
  }) => {
    return (
      <View style={{ flex: flex, marginHorizontal: scaleWidth(6) }}>
        <Text
          adjustsFontSizeToFit
          size="_14px"
          weight="400"
          color="secondaryText"
          style={{ textAlign: 'center' }}
        >
          {title}
        </Text>
        <View style={[styles.input, { marginVertical: scaleHeight(8) }]}>
          <View style={[styles.row]}>
            <TextInput
              keyboardType={keyboardType}
              returnKeyLabel="Done"
              returnKeyType="done"
              ref={textInput}
              style={{
                paddingStart: 4,
                margin: 0,
                fontSize: 13,
                flex: 1,
                textAlign: alignSelf,
                paddingVertical: scaleHeight(12),
              }}
              defaultValue={`${value}`}
              onBlur={(e) => {
                if (Platform.OS === 'ios') {
                  storeRef.current = e.nativeEvent.text;
                }
              }}
              onSubmitEditing={(e) => {
                if (Platform.OS === 'ios') {
                  storeRef.current = e.nativeEvent.text;
                }
              }}
              onChangeText={(e) => {
                if (Platform.OS === 'android') {
                  storeRef.current = e;
                }
              }}
            />
            <Text
              weight="400"
              style={{ marginHorizontal: 2, marginEnd: 4, alignSelf: 'center' }}
              color="secondaryText"
            >
              {unit}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderBarcode = () => {
    return (
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: scaleHeight(8),
          },
          styles.input,
        ]}
      >
        <TextInput
          ref={barcodeTextInputRef}
          defaultValue={info.barcode}
          style={[styles.flex1, styles.inputNutritionFact]}
          placeholder="Enter barcode"
          onBlur={(e) => {
            if (Platform.OS === 'ios') {
              nameRef.current = e.nativeEvent.text;
            }
          }}
          onSubmitEditing={(e) => {
            if (Platform.OS === 'ios') {
              nameRef.current = e.nativeEvent.text;
            }
          }}
          onChangeText={(e) => {
            if (Platform.OS === 'android') {
              barcodeRef.current = e;
            }
          }}
        />
        <TouchableOpacity
          onPress={onBarcodePress}
          style={{
            paddingHorizontal: scaleWidth(16),
          }}
        >
          <Image
            source={ICONS.scanBarcode}
            style={{
              height: scaleHeight(24),
              width: scaleWidth(24),
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <>
      <Text size={'_20px'} weight={'700'} style={styles.title}>
        Edit Nutrition Facts
      </Text>
      {note ? (
        <Text
          weight="400"
          size="_14px"
          style={{ textAlign: 'center', marginBottom: scaleHeight(16) }}
        >
          {note}
        </Text>
      ) : null}
      <View style={[styles.container]}>
        <View style={styles.imageContainer}>
          <Image
            resizeMode="cover"
            resizeMethod="resize"
            style={styles.image}
            source={{
              uri: Image.resolveAssetSource({
                uri:
                  Platform.OS === 'android'
                    ? `${'file://' + props.assets}`
                    : props.assets,
              }).uri,
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            marginStart: scaleWidth(12),
          }}
        >
          <TextInput
            defaultValue={info.label}
            ref={nameTextInputRef}
            style={[styles.input, styles.inputNutritionFact]}
            onBlur={(e) => {
              if (Platform.OS === 'ios') {
                nameRef.current = e.nativeEvent.text;
              }
            }}
            onSubmitEditing={(e) => {
              if (Platform.OS === 'ios') {
                nameRef.current = e.nativeEvent.text;
              }
            }}
            onChangeText={(e) => {
              if (Platform.OS === 'android') {
                nameRef.current = e;
              }
            }}
          />
          {renderBarcode()}
        </View>
      </View>
      <Text size={'_16px'} weight={'600'} style={styles.servingSizeTitle}>
        Nutrition Facts
      </Text>
      <View style={[styles.row, { marginTop: scaleHeight(16) }]}>
        {renderMacro({
          title: 'Calories',
          value: formatNumber(macro.calories) || 0,
          unit: 'cal',
          storeRef: caloriesRef,
          textInput: caloriesTextInputRef,
        })}
        {renderMacro({
          title: 'Carbs',
          value: formatNumber(macro.carbs) || 0,
          unit: 'g',
          storeRef: carbsRef,
          textInput: carbsTextInputRef,
        })}
        {renderMacro({
          title: 'Protein',
          value: formatNumber(macro.protein) || 0,
          unit: 'g',
          storeRef: proteinRef,
          textInput: proteinTextInputRef,
        })}
        {renderMacro({
          title: 'Fat',
          value: formatNumber(macro.fat) || 0,
          unit: 'g',
          storeRef: fatRef,
          textInput: fatTextInputRef,
        })}
      </View>

      <Text size={'_16px'} weight={'600'} style={styles.servingSizeTitle}>
        Portions
      </Text>
      <View style={[styles.row, { marginTop: scaleHeight(16) }]}>
        {renderMacro({
          title: 'Serving',
          value: formatNumber(servingInfo.servingQty) || 0,
          unit: '',
          storeRef: servingQtyRef,
          textInput: servingQtyTextInputRef,
        })}
        {renderMacro({
          title: 'Weight',
          value: formatNumber(servingInfo.weight) || 0,
          unit: 'g',
          storeRef: weightRef,
          textInput: weightTextInputRef,
        })}
        {renderMacro({
          title: 'Unit',
          value: servingInfo.servingUnit,
          keyboardType: 'default',
          alignSelf: 'left',
          unit: '',
          flex: 2,
          storeRef: servingUnitRef,
          textInput: selectedUnitTextInputRef,
        })}
      </View>

      <View style={styles.buttonContainer}>
        <BasicButton
          text={'Cancel'}
          onPress={onClose}
          secondary
          style={{ flex: 1, marginEnd: 8 }}
        />
        <BasicButton
          text={button}
          style={{ flex: 1, marginStart: 8 }}
          onPress={onUpdateNutritionUpdate}
        />
      </View>
    </>
  );
});

const customStyles = ({ border, white }: Branding) =>
  StyleSheet.create({
    row: { flexDirection: 'row' },
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
      borderColor: border,
      backgroundColor: 'white',
      borderWidth: 1,
      borderRadius: 8,
    },
    inputNutritionFact: {
      width: undefined,
      textAlign: 'left',
      marginVertical: scaleHeight(4),
      paddingHorizontal: scaleWidth(8),
      paddingVertical: scaleHeight(0),
      minHeight: scaleHeight(50),
    },
    buttonContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      marginTop: scaleHeight(16),
    },
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
  });
