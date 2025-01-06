import { useRef, useState, useCallback } from 'react';
import { TextInput } from 'react-native';
import { useBranding } from '../../../contexts';
import { PhotoLoggingResults } from '../usePhotoLogging';
import { formatNumber } from '../../../utils/NumberUtils';
import { updateSlider } from '../../../utils/V3Utils';
import { EditServingSizeProps } from './EditServingSizeModal';
import {
  PassioFoodItem,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { SliderRef } from '@react-native-community/slider';

interface Select {
  label: string;
  value: string;
}

export const useEditServing = () => {
  const [result, setResult] = useState<PhotoLoggingResults | undefined>(
    undefined
  );
  const [isOpen, setOpen] = useState(false);
  const [sliderConfig, setSliderConfig] = useState<number[]>([0, 100, 1]);
  const [selectedUnit, setSelectedUnit] = useState('gram');
  const qtyTextInputRef = useRef<TextInput>(null);
  const sliderRef = useRef<SliderRef>(null);
  const branding = useBranding();
  const [weight, setWeight] = useState(0);
  const [quantity, setQty] = useState(0);
  const quantityRef = useRef(0);

  const update = useCallback(
    (qty: string, unit: string, isSlider?: boolean) => {
      let defaultQty =
        result?.passioFoodItem?.amount?.servingSizes?.find(
          (i) => i.unitName === unit
        )?.quantity ||
        result?.foodDataInfo?.nutritionPreview?.servingQuantity ||
        0;
      let defaultWeight =
        result?.passioFoodItem?.amount?.servingUnits?.find(
          (i) => i.unitName === unit
        )?.value ||
        result?.foodDataInfo?.nutritionPreview?.weightQuantity ||
        0;

      // 100 gram - 100 gram
      if (unit === 'gram') {
        defaultWeight = 1;
        defaultQty = 1;
      }

      if (qty.length > 0) {
        setWeight(
          formatNumber((defaultWeight * Number(qty)) / defaultQty) ?? 0
        );
      } else {
        setWeight(0);
      }
      if (isSlider) {
        qtyTextInputRef?.current?.setNativeProps({
          text: formatNumber(Number(qty))?.toString(),
        });
      } else {
        setSliderConfig(updateSlider(Number(qty)));
        sliderRef.current?.updateValue?.(Number(qty));
      }

      quantityRef.current = Number(qty);
    },
    [
      result?.foodDataInfo?.nutritionPreview?.servingQuantity,
      result?.foodDataInfo?.nutritionPreview?.weightQuantity,
      result?.passioFoodItem?.amount?.servingSizes,
      result?.passioFoodItem?.amount?.servingUnits,
    ]
  );

  /* when text input change or slider update */
  const handleQtyUpdate = useCallback(
    (qty: string, isSlider?: boolean) => {
      update(qty, selectedUnit, isSlider);
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
    if (passioFoodItem && result) {
      passioFoodItem = {
        ...passioFoodItem,
        amount: {
          ...passioFoodItem.amount,
          selectedQuantity: Number(quantityRef.current || 0),
          selectedUnit: selectedUnit,
          weight: {
            unit: 'g',
            value: weight,
          },
          weightGrams: weight,
        },
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

  return {
    branding,
    close,
    handleQtyUpdate,
    handleServingChange,
    handleDoneClick,
    isOpen,
    sliderConfig,
    openEditServingPopup,
    qtyTextInputRef,
    sliderRef,
    quantity,
    quantityRef,
    result,
    selectedUnit,
    servingSizes,
    weight,
  };
};
