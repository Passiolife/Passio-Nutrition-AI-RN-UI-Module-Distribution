import { useRef, useCallback, useState } from 'react';
import { useBranding, useServices } from '../../../../contexts';
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
import {
  convertNumberInput,
  inValidNumberInput,
  isMissingNutrition,
} from '../../../../utils/V3Utils';
import { formatNumber } from '../../../../utils/NumberUtils';

export type NavigationProps = StackNavigationProp<
  ParamList,
  'PhotoLoggingScreen'
>;

export const useEditNutritionFact = (props: EditNutritionFactProps) => {
  const branding = useBranding();
  const services = useServices();

  const result = props.result;
  const nutrients = PassioSDK.getNutrientsOfPassioFoodItem(
    result,
    result?.amount?.weight ?? 100
  );

  const passioAmount = props.result?.amount;
  const calories = (nutrients?.calories?.value ?? '').toString();
  const carbs = (nutrients?.carbs?.value ?? '').toString();
  const protein = (nutrients?.protein?.value ?? '').toString();
  const fat = (nutrients?.fat?.value ?? '').toString();
  const barcode = result?.ingredients?.[0]?.metadata?.barcode;
  const iconID = result?.iconId;
  const name = result?.name || result?.ingredients?.[0].name || '';
  const passioWeight = (passioAmount?.weight.value ?? '').toString();
  const passioSelectedQuantity = (
    passioAmount?.selectedQuantity ?? ''
  ).toString();
  const passioSelectedUnit = (passioAmount?.selectedUnit ?? '').toString();

  const [isErrorName, setErrorName] = useState<boolean>(!name);
  const [isErrorCalories, setErrorCalories] = useState<boolean>(!calories);
  const [isErrorCarbs, setErrorCarbs] = useState<boolean>(!carbs);
  const [isErrorProtein, setErrorProtein] = useState<boolean>(!protein);
  const [isErrorFat, setErrorFat] = useState<boolean>(!fat);
  const [isErrorWeight, setErrorWeight] = useState<boolean>(!passioWeight);
  const [isErrorQuantity, setErrorQuantity] = useState<boolean>(
    !passioSelectedQuantity
  );
  const [isErrorServingUnit, seErrorServingUnit] =
    useState<boolean>(!passioSelectedUnit);

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
    const updatedQty = convertNumberInput(servingQtyRef.current);
    const updatedWeight = convertNumberInput(weightRef.current);
    const updatedUnit = servingUnitRef.current.trim().toLowerCase();

    const updatedCalories = convertNumberInput(caloriesRef.current);
    const updatedCarbs = convertNumberInput(carbsRef.current);
    const updatedProtein = convertNumberInput(proteinRef.current);
    const updatedFat = convertNumberInput(fatRef.current);

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

  const onUpdateNutritionUpdate = useCallback(async () => {
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

    const updatedResult = onUpdatePassioFoodItem();

    if (isMissingNutrition(updatedResult)) {
      Alert.alert('Please enter valid macros');
      return;
    }
    const customFoods = await services.dataService.getCustomFoodLogs();
    const existedCustomFood = customFoods?.find(
      (i) => i.barcode === barcodeRef.current
    );

    if (updatedResult) {
      onDone?.(updatedResult, existedCustomFood);
    }
  }, [onDone, onUpdatePassioFoodItem, services.dataService]);

  const onBarcodePress = () => {
    const updatedResult = onUpdatePassioFoodItem();
    if (updatedResult) {
      props.openBarcodeScanner?.(updatedResult);
    }
  };

  const handleBarcodeScanResult = async (scannedBarcode: string) => {
    const foodItem =
      await PassioSDK.fetchFoodItemForProductCode(scannedBarcode);
    if (foodItem) {
      const newNutrients = PassioSDK.getNutrientsOfPassioFoodItem(
        foodItem,
        foodItem?.amount.weight
      );

      if (caloriesRef.current && caloriesRef.current.trim().length === 0) {
        const cal = (newNutrients?.calories?.value ?? '').toString();
        setErrorCalories(inValidNumberInput(cal));
        caloriesTextInputRef?.current?.setNativeProps?.({
          text: formatNumber(cal)?.toString(),
        });
      }

      if (carbsRef.current.trim().length === 0) {
        const newCarbs = (newNutrients?.carbs?.value ?? '').toString();
        setErrorCarbs(inValidNumberInput(newCarbs));
        carbsTextInputRef?.current?.setNativeProps?.({
          text: formatNumber(newCarbs)?.toString(),
        });
      }

      if (proteinRef.current.trim().length === 0) {
        const newProtein = (newNutrients?.protein?.value ?? '').toString();
        setErrorProtein(inValidNumberInput(newProtein));
        proteinTextInputRef?.current?.setNativeProps?.({
          text: formatNumber(newProtein)?.toString(),
        });
      }

      if (fatRef.current.trim().length === 0) {
        const newFat = (newNutrients?.fat?.value ?? '').toString();
        setErrorFat(inValidNumberInput(newFat));
        fatTextInputRef?.current?.setNativeProps?.({
          text: formatNumber(newFat)?.toString(),
        });
      }

      if (servingUnitRef.current.trim().length === 0) {
        const newUnit = foodItem?.amount?.selectedUnit;
        seErrorServingUnit(newUnit.length === 0);
        selectedUnitTextInputRef?.current?.setNativeProps?.({
          text: newUnit,
        });
      }

      if (weightRef.current.trim().length === 0 || weightRef?.current === '0') {
        const newWeight = foodItem?.amount?.weight?.value;
        setErrorWeight(inValidNumberInput(newWeight.toString()));
        weightTextInputRef?.current?.setNativeProps?.({
          text: formatNumber(newWeight)?.toString(),
        });
      }

      if (
        servingQtyRef.current.trim().length === 0 ||
        servingQtyRef?.current === '0'
      ) {
        const newQty = foodItem?.amount?.selectedQuantity;
        setErrorQuantity(inValidNumberInput(newQty.toString()));
        servingQtyTextInputRef?.current?.setNativeProps?.({
          text: formatNumber(newQty)?.toString(),
        });
      }

      if (nameRef.current.trim().length === 0) {
        const newName = foodItem?.name;
        setErrorName(newName.length === 0);

        nameTextInputRef?.current?.setNativeProps?.({
          text: newName ?? '',
        });
      }
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
    isErrorCalories,
    setErrorCalories,
    isErrorCarbs,
    setErrorCarbs,
    isErrorProtein,
    setErrorProtein,
    isErrorFat,
    setErrorFat,
    isErrorQuantity,
    isErrorServingUnit,
    isErrorWeight,
    setErrorWeight,
    setErrorQuantity,
    seErrorServingUnit,
    isErrorName,
    setErrorName,
    handleBarcodeScanResult,
    isCustomFoodAlreadyAdded: props.isCustomFoodAlreadyAdded,
    isInvalid:
      isErrorCalories ||
      isErrorCarbs ||
      isErrorProtein ||
      isErrorFat ||
      isErrorServingUnit ||
      isErrorName ||
      isErrorWeight ||
      isErrorQuantity,
  };
};
