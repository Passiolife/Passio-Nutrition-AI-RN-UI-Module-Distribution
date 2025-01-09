import { useRef, useState, useCallback } from 'react';
import { TextInput } from 'react-native';
import { useBranding } from '../../../contexts';
import { PhotoLoggingResults } from '../usePhotoLogging';
import {
  formatNumber,
  validateQuantityInput,
} from '../../../utils/NumberUtils';
import { updateSlider } from '../../../utils/V3Utils';
import { EditServingSizeProps } from './EditServingSizeModal';
import {
  PassioFoodAmount,
  PassioFoodItem,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamList } from '../../../navigaitons';
import { EditNutritionFactRef } from './EditNutritionFactModal';

interface Select {
  label: string;
  value: string;
}

export type NavigationProps = StackNavigationProp<
  ParamList,
  'PhotoLoggingScreen'
>;

export const useEditServing = () => {
  const navigation = useNavigation<NavigationProps>();
  const [result, setResult] = useState<PhotoLoggingResults | undefined>(
    undefined
  );
  const [isOpen, setOpen] = useState(false);
  const [sliderConfig, setSliderConfig] = useState<number[]>([0, 100, 1]);
  const [selectedUnit, setSelectedUnit] = useState('gram');
  const qtyTextInputRef = useRef<TextInput>(null);
  const sliderRef = useRef<Slider>(null);
  const editNutritionFactRef = useRef<EditNutritionFactRef>(null);
  const branding = useBranding();
  const [weight, setWeight] = useState(0);
  const [quantity, setQty] = useState(0);
  const quantityRef = useRef(0);
  const [editType, setEditType] = useState<
    'serving' | 'nutrient' | 'nutrient_with_serving'
  >('serving');

  const update = useCallback(
    (qty: string, unit: string, isSlider?: boolean) => {
      let defaultWeight =
        result?.passioFoodItem?.amount?.servingUnits?.find(
          (i) => i.unitName === unit
        )?.value ||
        result?.foodDataInfo?.nutritionPreview?.weightQuantity ||
        0;

      // 100 gram - 100 gram
      if (unit === 'gram') {
        defaultWeight = 1;
      }

      if (qty.length > 0) {
        setWeight(formatNumber(defaultWeight * Number(qty)) ?? 0);
      } else {
        setWeight(0);
      }
      if (isSlider) {
        const numQty = Number(qty);
        qtyTextInputRef?.current?.setNativeProps({
          text: formatNumber(numQty)?.toString(),
        });
      } else {
        setQty(Number(qty));
        setSliderConfig(updateSlider(Number(qty)));
        // sliderRef.current?.props?.onValueChange?.(Number(qty));
      }

      quantityRef.current = Number(qty);
    },
    [
      result?.foodDataInfo?.nutritionPreview?.weightQuantity,
      result?.passioFoodItem?.amount?.servingUnits,
    ]
  );

  /* when text input change or slider update */
  const handleQtyUpdate = useCallback(
    (qty: string, isSlider?: boolean) => {
      update(validateQuantityInput(qty), selectedUnit, isSlider);
    },
    [selectedUnit, update]
  );

  /* when serving size update */
  const handleServingChange = useCallback(
    (servingChange: Select) => {
      setSelectedUnit(servingChange.value);
      update(
        servingChange.value === 'gram' ? '100' : '1',
        servingChange.value,
        false
      );
      qtyTextInputRef?.current?.setNativeProps({
        text: servingChange.value === 'gram' ? '100' : '1',
      });
    },
    [update]
  );

  const openEditServingPopup = (item: PhotoLoggingResults) => {
    const defaultWeight =
      item.passioFoodItem?.amount?.weightGrams ||
      item.foodDataInfo?.nutritionPreview?.weightQuantity ||
      0;
    const defaultQty =
      item.passioFoodItem?.amount?.selectedQuantity ||
      item.foodDataInfo?.nutritionPreview?.servingQuantity ||
      0;

    const unit =
      item.passioFoodItem?.amount?.selectedUnit ||
      item.foodDataInfo?.nutritionPreview?.servingUnit;
    setSelectedUnit(unit ?? 'gram');
    setWeight(defaultWeight);
    setQty(defaultQty);
    quantityRef.current = defaultQty;
    setSliderConfig(updateSlider(Number(defaultQty)));
    setOpen(true);
    setResult(item);
  };

  const close = () => {
    reset();
    setOpen(false);
  };

  const servingSizes: Select[] =
    result?.passioFoodItem?.amount?.servingSizes?.map((item) => {
      const option: Select = {
        label: item.unitName,
        value: item.unitName,
      };
      return option;
    }) ?? [];

  const handleDoneClick = (props: EditServingSizeProps) => {
    let passioFoodItem: PassioFoodItem | undefined = result?.passioFoodItem;
    const ingredients = passioFoodItem?.ingredients;

    if (passioFoodItem && result && ingredients) {
      const amount: PassioFoodAmount = {
        ...passioFoodItem.amount,
        selectedQuantity: Number(quantityRef.current || 0),
        selectedUnit: selectedUnit,
        weight: {
          unit: 'g',
          value: weight,
        },
        weightGrams: weight,
      };
      passioFoodItem = {
        ...passioFoodItem,
        amount: amount,
      };

      passioFoodItem = {
        ...passioFoodItem,
        ingredients: [
          {
            ...ingredients?.[0],
            amount,
            referenceNutrients:
              PassioSDK.getNutrientsReferenceOfPassioFoodItem(passioFoodItem),
          },
        ],
      };

      props?.onUpdateFoodItem?.({
        ...result,
        passioFoodItem: passioFoodItem,
        nutrients: PassioSDK.getNutrientsOfPassioFoodItem(
          passioFoodItem,
          passioFoodItem.amount.weight
        ),
      });
      setOpen(false);
    }
  };

  const reset = () => {
    // setEditType('serving');
    setResult(undefined);
  };
  const onEditServingBackPress = () => {
    setEditType('nutrient');
  };

  const onBarcodeOpen = () => {
    setOpen(false);
    navigation.navigate('BarcodeScanScreen', {
      type: 'general',
      onBarcodeOnly: (item) => {
        setOpen(true);
        navigation.goBack();
        setTimeout(() => {
          editNutritionFactRef?.current?.barcode?.(item);
        }, 500);
      },
      onClose: () => {
        setOpen(true);
        navigation.goBack();
      },
    });
  };

  return {
    branding,
    close,
    editType,
    handleDoneClick,
    handleQtyUpdate,
    handleServingChange,
    isOpen,
    onEditServingBackPress,
    onBarcodeOpen,
    editNutritionFactRef,
    openEditServingPopup,
    qtyTextInputRef,
    quantity,
    quantityRef,
    result,
    selectedUnit,
    servingSizes,
    setEditType,
    setOpen,
    setResult,
    sliderConfig,
    sliderRef,
    weight,
  };
};
