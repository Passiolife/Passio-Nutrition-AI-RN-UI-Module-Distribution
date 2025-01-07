import { useRef, useCallback } from 'react';
import { useBranding } from '../../../contexts';
import { EditNutritionFactProps } from './EditNutritionFactModal';
import {
  PassioFoodAmount,
  PassioFoodItem,
  PassioIngredient,
  PassioSDK,
  ServingSize,
  ServingUnit,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { Alert } from 'react-native';

export const useEditNutritionFact = (props: EditNutritionFactProps) => {
  const branding = useBranding();

  const {
    iconID,
    label,
    calories = 0,
    fat = 0,
    carbs = 0,
    protein = 0,
    servingQty = 1,
    weight = 0,
    servingUnit = 'serving',
    barcode,
    onClose,
    onNext,
    result,
  } = props;

  const caloriesRef = useRef(calories.toString());
  const carbsRef = useRef(carbs.toString());
  const proteinRef = useRef(protein.toString());
  const fatRef = useRef(fat.toString());
  const servingQtyRef = useRef(servingQty.toString());
  const weightRef = useRef(weight.toString());
  const servingUnitRef = useRef(servingUnit.toString());
  const nameRef = useRef(label ?? '');
  const barcodeRef = useRef(barcode ?? '');

  const onUpdateNutritionUpdate = useCallback(() => {
    const updatedQty = Number(servingQtyRef.current || 0);
    const updatedWeight = Number(weightRef.current || 0);
    const updatedCalories = Number(caloriesRef.current || 0);
    const updatedCarbs = Number(carbsRef.current || 0);
    const updatedProtein = Number(proteinRef.current || 0);
    const updatedFat = Number(fatRef.current || 0);
    const updatedUnit = servingUnitRef.current.trim().toLowerCase();
    const updatedName = nameRef.current;
    const updatedBarcode = barcodeRef.current;

    if (!updatedQty || updatedQty <= 0) {
      Alert.alert('Please enter valid qty');
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

    let passioFoodItem: PassioFoodItem | undefined | null =
      result.passioFoodItem;

    let ingredient: PassioIngredient | undefined =
      result.passioFoodItem?.ingredients?.[0];

    let servingUnits: ServingUnit[] | undefined =
      result.passioFoodItem?.amount?.servingUnits?.filter(
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
      result.passioFoodItem?.amount?.servingSizes?.filter(
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

      onNext?.({
        ...result,
        passioFoodItem: passioFoodItem,
        nutrients: PassioSDK.getNutrientsOfPassioFoodItem(passioFoodItem, {
          unit: 'g',
          value: updatedWeight,
        }),
      });
    }
  }, [onNext, result]);

  const onBarcodePress = () => {};

  return {
    onUpdateNutritionUpdate,
    branding,
    onClose,
    caloriesRef,
    fatRef,
    proteinRef,
    carbsRef,
    servingQty,
    servingQtyRef,
    weightRef,
    servingUnitRef,
    onBarcodePress,
    nameRef,
    barcodeRef,
    info: {
      label,
      barcode,
      iconID,
    },
    servingInfo: {
      weight,
      servingUnit,
    },
    macro: {
      calories,
      carbs,
      protein,
      fat,
    },
  };
};
