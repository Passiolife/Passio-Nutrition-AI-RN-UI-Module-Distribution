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
import type { PassioFoodItem } from '@passiolife/nutritionai-react-native-sdk-v3';
import { scaleHeight, scaleWidth } from '../../../../utils';
import type { Branding } from '../../../../contexts';
import { formatNumber } from '../../../../utils/NumberUtils';
import { useEditNutritionFact } from './useEditNutritionFactModal';
import { ICONS } from '../../../../assets';
import { inValidNumberInput } from '../../../../utils/V3Utils';
import type { CustomFood } from '../../../../models';
import { Dropdown } from 'react-native-element-dropdown';

export interface EditNutritionFactProps {
  onClose?: () => void;
  onDone?: (result: PassioFoodItem, customFood?: CustomFood) => void;
  result: PassioFoodItem;
  openBarcodeScanner?: (result: PassioFoodItem) => void;
  assets?: string;
  button?: string;
  note?: string | React.ReactElement;
  isCustomFoodAlreadyAdded?: boolean;
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
    servingUnit,
    setServingUnit,
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
    weightTextInputRef,
    isErrorCalories,
    setErrorCalories,
    isErrorCarbs,
    setErrorCarbs,
    servings,
    isErrorProtein,
    setErrorProtein,
    isErrorFat,
    setErrorFat,
    isErrorQuantity,
    isErrorWeight,
    setErrorWeight,
    setErrorQuantity,
    setErrorName,
    isErrorName,
    isInvalid,
    handleBarcodeScanResult,
    isCustomFoodAlreadyAdded,
  } = useEditNutritionFact(props);
  const styles = customStyles(branding);

  const { button = 'Save', note } = props;

  useImperativeHandle(ref, () => ({
    barcode: async (item) => {
      barcodeRef.current = item;
      handleBarcodeScanResult(item);
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
    isError = false,
    setErrorState,
  }: {
    title: string;
    unit: string;
    value?: number | string;
    flex?: number;
    keyboardType?: KeyboardType;
    textInput: React.RefObject<TextInput>;
    alignSelf?: 'auto' | 'center' | 'left' | 'right' | 'justify' | undefined;
    isError?: boolean;
    setErrorState?: React.Dispatch<React.SetStateAction<boolean>>;
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
        <View
          style={[
            styles.input,
            isError && { borderColor: 'red' },
            { marginVertical: scaleHeight(8) },
          ]}
        >
          <View style={[styles.row]}>
            <TextInput
              keyboardType={keyboardType}
              returnKeyLabel="Done"
              placeholderTextColor={branding.secondaryText}
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
              defaultValue={`${value ?? ''}`}
              onBlur={(e) => {
                if (Platform.OS === 'ios') {
                  storeRef.current = e.nativeEvent.text;
                  if (setErrorState) {
                    if (keyboardType === 'default') {
                      setErrorState(e.nativeEvent.text.length === 0);
                    } else {
                      setErrorState(inValidNumberInput(e.nativeEvent.text));
                    }
                  }
                }
              }}
              onSubmitEditing={(e) => {
                if (Platform.OS === 'ios') {
                  storeRef.current = e.nativeEvent.text;
                  if (setErrorState) {
                    if (keyboardType === 'default') {
                      setErrorState(e.nativeEvent.text.length === 0);
                    } else {
                      setErrorState(inValidNumberInput(e.nativeEvent.text));
                    }
                  }
                }
              }}
              onChangeText={(e) => {
                if (Platform.OS === 'android') {
                  storeRef.current = e;
                  if (setErrorState) {
                    if (keyboardType === 'default') {
                      setErrorState(e.length === 0);
                    } else {
                      setErrorState(inValidNumberInput(e));
                    }
                  }
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
          placeholderTextColor={branding.secondaryText}
          placeholder="Enter barcode"
          onBlur={(e) => {
            if (Platform.OS === 'ios') {
              barcodeRef.current = e.nativeEvent.text;
            }
          }}
          onSubmitEditing={(e) => {
            if (Platform.OS === 'ios') {
              barcodeRef.current = e.nativeEvent.text;
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
            placeholder="Enter food name"
            placeholderTextColor={branding.secondaryText}
            style={[
              styles.input,
              styles.inputNutritionFact,
              isErrorName && { borderColor: 'red' },
            ]}
            onBlur={(e) => {
              if (Platform.OS === 'ios') {
                nameRef.current = e.nativeEvent.text;
                setErrorName(e.nativeEvent.text.length === 0);
              }
            }}
            onSubmitEditing={(e) => {
              if (Platform.OS === 'ios') {
                nameRef.current = e.nativeEvent.text;
                setErrorName(e.nativeEvent.text.length === 0);
              }
            }}
            onChangeText={(e) => {
              if (Platform.OS === 'android') {
                nameRef.current = e;
                setErrorName(e.length === 0);
              }
            }}
          />
          {renderBarcode()}
        </View>
      </View>
      <Text size={'_16px'} weight={'600'} style={styles.servingSizeTitle}>
        Nutrition Facts
      </Text>
      <View style={[styles.row, { marginTop: scaleHeight(0) }]}>
        {renderMacro({
          title: 'Calories',
          value: macro.calories ? formatNumber(macro.calories) || 0 : undefined,
          unit: 'cal',
          storeRef: caloriesRef,
          textInput: caloriesTextInputRef,
          isError: isErrorCalories,
          setErrorState: setErrorCalories,
        })}
        {renderMacro({
          title: 'Carbs',
          value: macro.carbs ? formatNumber(macro.carbs) || 0 : '',
          unit: 'g',
          storeRef: carbsRef,
          textInput: carbsTextInputRef,
          isError: isErrorCarbs,
          setErrorState: setErrorCarbs,
        })}
        {renderMacro({
          title: 'Protein',
          value: macro.protein ? formatNumber(macro.protein) || 0 : '',
          unit: 'g',
          storeRef: proteinRef,
          textInput: proteinTextInputRef,
          isError: isErrorProtein,
          setErrorState: setErrorProtein,
        })}
        {renderMacro({
          title: 'Fat',
          value: macro.fat ? formatNumber(macro.fat) || 0 : '',
          unit: 'g',
          storeRef: fatRef,
          textInput: fatTextInputRef,
          isError: isErrorFat,
          setErrorState: setErrorFat,
        })}
      </View>

      <Text size={'_16px'} weight={'600'} style={styles.servingSizeTitle}>
        Portions
      </Text>
      <View style={[styles.row, { marginTop: scaleHeight(0) }]}>
        {renderMacro({
          title: 'Serving',
          value: formatNumber(servingInfo.servingQty) || 0,
          unit: '',
          storeRef: servingQtyRef,
          textInput: servingQtyTextInputRef,
          isError: isErrorQuantity,
          setErrorState: setErrorQuantity,
        })}
        {/* <>
          {servingUnit !== 'gram' &&
            renderMacro({
              title: 'Unit',
              value: servingInfo.servingUnit,
              keyboardType: 'default',
              alignSelf: 'left',
              unit: '',
              flex: 2,
              storeRef: servingUnitRef,
              textInput: selectedUnitTextInputRef,
              isError: isErrorServingUnit,
              setErrorState: seErrorServingUnit,
            })}
        </> */}
        <View style={{ flex: 2 }}>
          <Text
            adjustsFontSizeToFit
            size="_14px"
            weight="400"
            color="secondaryText"
            style={{ textAlign: 'center' }}
          >
            {'Unit'}
          </Text>
          <Dropdown
            data={servings}
            labelField={'label'}
            value={servingUnit}
            valueField={'value'}
            itemTextStyle={{
              textAlign: 'center',
            }}
            selectedTextStyle={{
              textAlign: 'center',
            }}
            style={styles.dropDown}
            onChange={(item) => {
              setServingUnit(item.value);
              servingUnitRef.current = item.value;
              if (
                item.value.toLowerCase() === 'gram' ||
                item.value.toLowerCase() === 'ml'
              ) {
                weightTextInputRef?.current?.setNativeProps?.({
                  text: formatNumber(weightRef?.current)?.toString(),
                });
                servingQtyTextInputRef?.current?.setNativeProps?.({
                  text: formatNumber(weightRef?.current)?.toString(),
                });
                servingQtyRef.current = weightRef?.current;
                setErrorWeight(false);
              }
            }}
          />
        </View>
        {servingUnit !== 'gram' &&
          servingUnit !== 'ml' &&
          renderMacro({
            title: 'Weight',
            value: formatNumber(servingInfo.weight) || 0,
            unit: 'g',
            storeRef: weightRef,
            textInput: weightTextInputRef,
            isError: isErrorWeight,
            setErrorState: setErrorWeight,
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
          text={isCustomFoodAlreadyAdded ? 'Update' : button}
          disabled={isInvalid}
          style={[
            { flex: 1, marginStart: 8 },
            isInvalid && { borderColor: branding.gray300 },
            isInvalid && { backgroundColor: branding.gray300 },
          ]}
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
      borderRadius: 8,
      marginVertical: scaleHeight(8),
      paddingHorizontal: 8,
      paddingVertical: scaleHeight(10),
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
