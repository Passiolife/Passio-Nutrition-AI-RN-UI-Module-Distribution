import { useRef, useCallback, useState, useEffect } from 'react';
import { useBranding } from '../../../../contexts';
import type { EditNutritionFactProps } from './EditNutritionFactModal';
import type {
  PassioFoodItem,
  PassioIngredient,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import type {
  PassioFoodAmount,
  ServingSize,
  ServingUnit,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { Alert, TextInput } from 'react-native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../../../navigaitons';
import {
  convertNumberInput,
  isMissingNutrition,
} from '../../../../utils/V3Utils';
import { Units } from '../../../../screens/foodCreator/data';
import { getNutrientsOfPassioFoodItem } from '../../../../utils/';

export type NavigationProps = StackNavigationProp<
  ParamList,
  'PhotoLoggingScreen'
>;

export const useEditNutritionFact = (props: EditNutritionFactProps) => {
  const branding = useBranding();

  const oldResultRef = props.result;

  const [_result, setResult] = useState(props.result);
  const [servingUnit, setServingUnit] = useState<string>();

  //References
  const caloriesRef = useRef<string | undefined>();
  const iconIDRef = useRef<string | undefined>();
  const carbsRef = useRef<string | undefined>();
  const proteinRef = useRef<string | undefined>();
  const fatRef = useRef<string | undefined>();
  const servingQtyRef = useRef<string | undefined>();
  const weightRef = useRef<string | undefined>();
  const servingUnitRef = useRef<string>('gram');
  const nameRef = useRef<string | undefined>();
  const barcodeRef = useRef<string | undefined>();

  //Error handle
  const [isErrorName, setErrorName] = useState<boolean>();
  const [isErrorCalories, setErrorCalories] = useState<boolean>();
  const [isErrorCarbs, setErrorCarbs] = useState<boolean>();
  const [isErrorProtein, setErrorProtein] = useState<boolean>();
  const [isErrorFat, setErrorFat] = useState<boolean>();
  const [isErrorWeight, setErrorWeight] = useState<boolean>();
  const [isErrorQuantity, setErrorQuantity] = useState<boolean>();
  const [isErrorServingUnit, seErrorServingUnit] = useState<boolean>();
  const { onClose, onDone } = props;

  //Text input references
  const barcodeTextInputRef = useRef<TextInput>(null);
  const nameTextInputRef = useRef<TextInput>(null);
  const caloriesTextInputRef = useRef<TextInput>(null);
  const carbsTextInputRef = useRef<TextInput>(null);
  const fatTextInputRef = useRef<TextInput>(null);
  const proteinTextInputRef = useRef<TextInput>(null);
  const servingQtyTextInputRef = useRef<TextInput>(null);
  const selectedUnitTextInputRef = useRef<TextInput>(null);
  const weightTextInputRef = useRef<TextInput>(null);

  const getPredefineValues = useCallback((passioResult: PassioFoodItem) => {
    const passioAmount = passioResult.amount;
    const referenceNutrients =
      passioResult?.ingredients?.[0].referenceNutrients;
    const nutrients = getNutrientsOfPassioFoodItem(
      passioResult,
      passioResult?.amount?.weight ?? 100
    );

    const name =
      passioResult?.name || passioResult?.ingredients?.[0].name || '';

    const barcode = passioResult?.ingredients?.[0]?.metadata?.barcode;
    const iconID = passioResult?.iconId;
    const passioWeight = (passioAmount?.weight.value ?? '').toString();
    const passioSelectedQuantity = (
      passioAmount?.selectedQuantity ?? ''
    ).toString();
    const passioSelectedUnit = (
      passioAmount?.selectedUnit ?? 'serving'
    ).toString();

    const calories = (
      referenceNutrients?.calories?.value !== undefined
        ? (nutrients?.calories?.value ?? '')
        : ''
    ).toString();

    const carbs = (
      referenceNutrients?.carbs?.value !== undefined
        ? (nutrients?.carbs?.value ?? '')
        : ''
    ).toString();

    const protein = (
      referenceNutrients?.protein?.value !== undefined
        ? (nutrients?.protein?.value ?? '')
        : ''
    ).toString();

    const fat = (
      referenceNutrients?.fat?.value !== undefined
        ? (nutrients?.fat?.value ?? '')
        : ''
    ).toString();

    return {
      calories: calories,
      carbs: carbs,
      protein: protein,
      fat: fat,
      name: name,
      weight: passioWeight,
      qty: passioSelectedQuantity,
      unit: passioSelectedUnit,
      barcode: barcode,
      iconID: iconID,
    };
  }, []);

  useEffect(() => {
    const passioResult = props.result;
    setResult(passioResult);
    const {
      name,
      calories,
      fat,
      protein,
      barcode,
      carbs,
      iconID,
      qty,
      unit,
      weight,
    } = getPredefineValues(props.result);

    nameRef.current = name;
    caloriesRef.current = calories;
    carbsRef.current = carbs;
    fatRef.current = fat;
    proteinRef.current = protein;
    barcodeRef.current = barcode;
    weightRef.current = weight;
    servingQtyRef.current = qty;
    servingUnitRef.current = unit;
    iconIDRef.current = iconID;
    setServingUnit(unit);
    setErrorName(!name);
    setErrorCalories(!calories);
    setErrorCarbs(!carbs);
    setErrorFat(!fat);
    setErrorProtein(!protein);
    seErrorServingUnit(!unit);
    setErrorWeight(!weight);
    setErrorQuantity(!qty);
  }, [getPredefineValues, props.result]);

  const onUpdatePassioFoodItem = useCallback(() => {
    const updatedQty = convertNumberInput(servingQtyRef.current);
    const updatedUnit = servingUnitRef?.current?.trim().toLowerCase();
    const updatedWeight =
      updatedUnit === 'gram' || updatedUnit === 'ml'
        ? updatedQty
        : Number(convertNumberInput(weightRef.current) || 0);

    const updatedCalories = convertNumberInput(caloriesRef.current);
    const updatedCarbs = convertNumberInput(carbsRef.current);
    const updatedProtein = convertNumberInput(proteinRef.current);
    const updatedFat = convertNumberInput(fatRef.current);
    const updatedName = nameRef.current;
    const updatedBarcode = barcodeRef.current;

    let passioFoodItem: PassioFoodItem | undefined | null = props.result ?? {};

    let ingredient: PassioIngredient | undefined =
      props.result?.ingredients?.[0];

    // Applied serving unit
    let servingUnits: ServingUnit[] = [];
    const defaultServingUnit: ServingUnit[] =
      updatedUnit?.toLowerCase?.() !== 'gram'
        ? [
            {
              unit: 'g',
              value: 1,
              unitName: 'gram',
            },
          ]
        : [];

    servingUnits = [
      ...defaultServingUnit,
      {
        unit: 'g',
        unitName: updatedUnit,
        value: updatedWeight / updatedQty,
      },
    ];

    // Applied serving size
    let servingSizes: ServingSize[] = [];
    const defaultServingSize: ServingSize[] =
      updatedUnit.toLowerCase() !== 'gram'
        ? [
            {
              quantity: 100,
              unitName: 'gram',
            },
          ]
        : [];
    servingSizes = [
      ...(defaultServingSize ?? []),
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
        name: updatedName ?? '',
        amount: {
          ...passioFoodItem.amount,
          ...amount,
        },
        ingredients: [
          {
            ...ingredient,
            name: updatedName ?? '',
            metadata: {
              ...ingredient.metadata,
              barcode: updatedBarcode,
            },
            amount: {
              ...ingredient.amount,
              ...amount,
            },
            referenceNutrients: {
              ...ingredient.referenceNutrients,
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
  }, [props.result]);

  const isSamePreviousValue = useCallback(() => {
    const { name, calories, fat, protein, barcode, carbs, qty, unit, weight } =
      getPredefineValues(props.result);
    return (
      nameRef.current === name &&
      barcodeRef.current === barcode &&
      caloriesRef.current === calories &&
      carbsRef.current === carbs &&
      proteinRef.current === protein &&
      fatRef.current === fat &&
      servingQtyRef.current === qty &&
      weightRef.current === weight &&
      servingUnitRef.current === unit
    );
  }, [getPredefineValues, props.result]);

  const onUpdateNutritionUpdate = useCallback(async () => {
    const updatedUnit = servingUnitRef?.current?.trim().toLowerCase();
    const updatedQty = Number(servingQtyRef.current || 0);

    const updatedWeight =
      updatedUnit === 'gram' || updatedUnit === 'ml'
        ? updatedQty
        : Number(weightRef.current || 0);

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

    if (updatedResult) {
      onDone?.(updatedResult, isSamePreviousValue());
    }
  }, [isSamePreviousValue, onDone, onUpdatePassioFoodItem]);

  const onBarcodePress = () => {
    const updatedResult = onUpdatePassioFoodItem();
    if (updatedResult) {
      props.openBarcodeScanner?.(updatedResult);
    }
  };

  const handleBarcodeScanResult = async (barcode: string) => {
    barcodeRef.current = barcode;
  };

  const allUnits = Units.map((item) => {
    return {
      label: item,
      value: item,
    };
  }).filter((i) => i.value !== servingUnitRef.current);

  const servings = [
    {
      label: servingUnitRef.current,
      value: servingUnitRef.current,
    },
    ...allUnits,
  ];

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
      label: nameRef.current,
      barcode: barcodeRef.current,
      iconID: iconIDRef.current,
    },
    servingInfo: {
      weight: weightRef.current,
      servingUnit: servingUnitRef.current,
      servingQty: servingQtyRef.current,
    },
    macro: {
      calories: caloriesRef.current,
      carbs: carbsRef.current,
      protein: proteinRef.current,
      fat: fatRef.current,
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
    setServingUnit,
    servingUnit,
    isErrorServingUnit,
    isErrorWeight,
    setErrorWeight,
    setErrorQuantity,
    seErrorServingUnit,
    servings,
    isErrorName,
    setErrorName,
    handleBarcodeScanResult,
    oldResultRef,
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
