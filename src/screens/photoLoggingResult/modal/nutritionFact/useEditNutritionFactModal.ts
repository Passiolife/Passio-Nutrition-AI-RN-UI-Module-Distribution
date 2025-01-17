import { useRef, useCallback } from 'react';
import { useBranding } from '../../../../contexts';
import type { EditNutritionFactProps } from './EditNutritionFactModal';
import {
  PassioFoodAmount,
  PassioFoodItem,
  PassioIngredient,
  PassioSDK,
  ServingSize,
  ServingUnit,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { Alert, TextInput } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../../../navigaitons';
import { isMissingNutrition } from '../../../../utils/V3Utils';

export type NavigationProps = StackNavigationProp<
  ParamList,
  'PhotoLoggingScreen'
>;

export const useEditNutritionFact = (props: EditNutritionFactProps) => {
  const branding = useBranding();

  const result = props.result;
  const nutrients = PassioSDK.getNutrientsOfPassioFoodItem(
    result,
    result?.amount?.weight ?? 100
  );
  const passioAmount = props.result?.amount;

  const calories = (nutrients?.calories?.value || '').toString();
  const carbs = (nutrients?.carbs?.value || '').toString();
  const protein = (nutrients?.protein?.value || '').toString();
  const fat = (nutrients?.fat?.value || '').toString();
  const barcode = result?.ingredients?.[0]?.metadata?.barcode;
  const iconID = result?.iconId;
  const name = result?.name || result?.ingredients?.[0].name || '';

  const passioWeight = (passioAmount?.weight.value ?? '').toString();
  const passioSelectedQuantity = (
    passioAmount?.selectedQuantity ?? ''
  ).toString();
  const passioSelectedUnit = (passioAmount?.selectedUnit ?? '').toString();

  const { onClose, onDone } = props;

  const caloriesRef = useRef(calories);
  const carbsRef = useRef(carbs);
  const proteinRef = useRef(protein);
  const fatRef = useRef(fat);
  const servingQtyRef = useRef(passioSelectedQuantity);
  const weightRef = useRef(passioWeight);
  const servingUnitRef = useRef(passioSelectedUnit);
  const nameRef = useRef(name ?? '');
  const barcodeRef = useRef(barcode ?? '');
  const barcodeTextInputRef = useRef<TextInput>(null);
  const nameTextInputRef = useRef<TextInput>(null);
  const caloriesTextInputRef = useRef<TextInput>(null);
  const carbsTextInputRef = useRef<TextInput>(null);
  const fatTextInputRef = useRef<TextInput>(null);
  const proteinTextInputRef = useRef<TextInput>(null);
  const servingQtyTextInputRef = useRef<TextInput>(null);
  const selectedUnitTextInputRef = useRef<TextInput>(null);
  const weightTextInputRef = useRef<TextInput>(null);

  const onUpdatePassioFoodItem = useCallback(() => {
    const updatedQty = Number(servingQtyRef.current || 0);
    const updatedWeight = Number(weightRef.current || 0);
    const updatedCalories = Number(caloriesRef.current || 0);
    const updatedCarbs = Number(carbsRef.current || 0);
    const updatedProtein = Number(proteinRef.current || 0);
    const updatedFat = Number(fatRef.current || 0);
    const updatedUnit = servingUnitRef.current.trim().toLowerCase();
    const updatedName = nameRef.current;
    const updatedBarcode = barcodeRef.current;

    let passioFoodItem: PassioFoodItem | undefined | null = result;

    let ingredient: PassioIngredient | undefined = result?.ingredients?.[0];

    let servingUnits: ServingUnit[] | undefined =
      result?.amount?.servingUnits?.filter(
        (i) => i?.unitName?.trim().toLowerCase() !== updatedUnit
      );

    servingUnits = [
      ...(servingUnits ?? []),
      {
        unit: 'g',
        unitName: updatedUnit,
        value: updatedWeight / updatedQty,
      },
    ];

    let servingSizes: ServingSize[] | undefined =
      result?.amount?.servingSizes?.filter(
        (i) => i?.unitName?.trim().toLowerCase() !== updatedUnit
      );

    servingSizes = [
      ...(servingSizes ?? []),
      {
        unitName: updatedUnit,
        quantity: 1,
      },
    ];

    if (ingredient && passioFoodItem) {
      const amount: PassioFoodAmount = {
        selectedQuantity: updatedQty,
        selectedUnit: updatedUnit,
        weight: {
          unit: 'g',
          value: updatedWeight,
        },
        weightGrams: updatedWeight,
        servingUnits: servingUnits,
        servingSizes: servingSizes,
      };

      passioFoodItem = {
        ...passioFoodItem,
        name: updatedName,
        amount: {
          ...passioFoodItem.amount,
          ...amount,
        },
        ingredients: [
          {
            ...ingredient,
            name: updatedName,
            metadata: {
              ...ingredient.metadata,
              barcode: updatedBarcode,
            },
            amount: {
              ...ingredient.amount,
              ...amount,
            },
            referenceNutrients: {
              calories: {
                unit: 'kcal',
                value: updatedCalories,
              },
              carbs: {
                unit: 'g',
                value: updatedCarbs,
              },
              fat: {
                unit: 'g',
                value: updatedFat,
              },
              protein: {
                unit: 'g',
                value: updatedProtein,
              },
              weight: {
                unit: 'g',
                value: updatedWeight,
              },
            },
            weight: {
              unit: 'g',
              value: updatedWeight,
            },
          },
        ],
      };

      return passioFoodItem;
    } else {
      return passioFoodItem;
    }
  }, [result]);

  const onUpdateNutritionUpdate = useCallback(() => {
    const updatedQty = Number(servingQtyRef.current || 0);
    const updatedWeight = Number(weightRef.current || 0);
    const updatedUnit = servingUnitRef.current.trim().toLowerCase();

    if (!updatedQty || updatedQty <= 0) {
      Alert.alert('Please enter valid serving');
      return;
    }

    if (!updatedWeight || updatedWeight <= 0) {
      Alert.alert('Please enter valid weight');
      return;
    }

    if (!updatedUnit || updatedUnit.length <= 0) {
      Alert.alert('Please enter valid unit');
      return;
    }

    if (!nameRef.current || nameRef.current.length <= 0) {
      Alert.alert('Please enter food name');
      return;
    }

    if (barcodeRef.current.length >= 0) {
      // check custom food already exist for this barcode.
    }

    const updatedResult = onUpdatePassioFoodItem();

    if (isMissingNutrition(updatedResult)) {
      Alert.alert('Please enter valid macros');
      return;
    }

    if (updatedResult) {
      onDone?.(updatedResult);
    }
  }, [onDone, onUpdatePassioFoodItem]);

  const onBarcodePress = () => {
    const updatedResult = onUpdatePassioFoodItem();

    if (updatedResult) {
      props.openBarcodeScanner?.(updatedResult);
    }
  };

  return {
    onUpdateNutritionUpdate,
    branding,
    onClose,
    caloriesRef,
    fatRef,
    proteinRef,
    carbsRef,
    servingQtyRef,
    weightRef,
    servingUnitRef,
    barcodeTextInputRef,
    onBarcodePress,
    nameRef,
    barcodeRef,
    info: {
      label: name,
      barcode: barcode,
      iconID: iconID,
    },
    servingInfo: {
      weight: passioWeight,
      servingUnit: passioSelectedUnit,
      servingQty: passioSelectedQuantity,
    },
    macro: {
      calories,
      carbs,
      protein,
      fat,
    },
    nameTextInputRef,
    caloriesTextInputRef,
    carbsTextInputRef,
    fatTextInputRef,
    proteinTextInputRef,
    servingQtyTextInputRef,
    selectedUnitTextInputRef,
    weightTextInputRef,
  };
};
