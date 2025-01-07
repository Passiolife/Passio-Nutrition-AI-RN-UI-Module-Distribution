import React, { forwardRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  KeyboardType,
  Image,
  TouchableOpacity,
} from 'react-native';
import { BasicButton, Text } from '../../../components';
import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';
import { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3';
import { scaleHeight, scaleWidth } from '../../../utils';
import { Branding } from '../../../contexts';
import { PhotoLoggingResults } from '../usePhotoLogging';
import { formatNumber } from '../../../utils/NumberUtils';
import { useEditNutritionFact } from './useEditNutritionFactModal';
import { ICONS } from '../../../assets';

export interface EditNutritionFactProps {
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  label?: string;
  barcode?: string;
  servingQty?: number;
  weight?: number;
  servingUnit?: string;
  iconID?: string;
  onClose?: () => void;
  onNext?: (result: PhotoLoggingResults) => void;
  result: PhotoLoggingResults;
  onHide?: () => void;
  onShow?: () => void;
}

export interface EditNutritionFactRef {
  open: (result: PhotoLoggingResults) => void;
}
export const EditNutritionFact = forwardRef<
  EditNutritionFactRef,
  EditNutritionFactProps
>((props, _ref) => {
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
    servingQty,
    servingQtyRef,
    weightRef,
    nameRef,
    onBarcodePress,
    barcodeRef,
    servingUnitRef,
  } = useEditNutritionFact(props);
  const styles = customStyles(branding);

  const renderMacro = ({
    title,
    value,
    unit,
    flex = 1,
    keyboardType = 'numeric',
    alignSelf = 'center',
    storeRef,
  }: {
    title: string;
    unit: string;
    value: number | string;
    flex?: number;
    keyboardType?: KeyboardType;
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
              style={{
                paddingStart: 4,
                margin: 0,
                fontSize: 13,
                flex: 1,
                textAlign: alignSelf,
                paddingVertical: scaleHeight(12),
              }}
              defaultValue={`${value}`}
              onBlur={(e) => (storeRef.current = e.nativeEvent.text)}
              onSubmitEditing={(e) => (storeRef.current = e.nativeEvent.text)}
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
          defaultValue={info.barcode}
          style={[styles.flex1, styles.inputNutritionFact]}
          onBlur={(e) => (barcodeRef.current = e.nativeEvent.text)}
          placeholder="Enter barcode"
          onSubmitEditing={(e) => (barcodeRef.current = e.nativeEvent.text)}
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
      <View style={[styles.container]}>
        <View style={styles.imageContainer}>
          <PassioFoodIcon
            style={styles.image}
            iconID={info.iconID}
            entityType={PassioIDEntityType.group}
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
            style={[styles.input, styles.inputNutritionFact]}
            onBlur={(e) => (nameRef.current = e.nativeEvent.text)}
            onSubmitEditing={(e) => (nameRef.current = e.nativeEvent.text)}
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
        })}
        {renderMacro({
          title: 'Carbs',
          value: formatNumber(macro.carbs) || 0,
          unit: 'g',
          storeRef: carbsRef,
        })}
        {renderMacro({
          title: 'Protein',
          value: formatNumber(macro.protein) || 0,
          unit: 'g',
          storeRef: proteinRef,
        })}
        {renderMacro({
          title: 'Fat',
          value: formatNumber(macro.fat) || 0,
          unit: 'g',
          storeRef: fatRef,
        })}
      </View>

      <Text size={'_16px'} weight={'600'} style={styles.servingSizeTitle}>
        Portions
      </Text>
      <View style={[styles.row, { marginTop: scaleHeight(16) }]}>
        {renderMacro({
          title: 'Serving',
          value: formatNumber(servingQty) || 0,
          unit: '',
          storeRef: servingQtyRef,
        })}
        {renderMacro({
          title: 'Weight',
          value: formatNumber(servingInfo.weight) || 0,
          unit: 'g',
          storeRef: weightRef,
        })}
        {renderMacro({
          title: 'Unit',
          value: servingInfo.servingUnit,
          keyboardType: 'default',
          alignSelf: 'left',
          unit: '',
          flex: 2,
          storeRef: servingUnitRef,
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
          text={'Next'}
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
