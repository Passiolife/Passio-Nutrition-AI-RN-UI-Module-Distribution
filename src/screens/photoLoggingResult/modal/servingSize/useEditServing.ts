import { useRef, useState, useCallback } from 'react';
import type { TextInput } from 'react-native';
import { useBranding } from '../../../../contexts';
import type { PhotoLoggingResults } from '../../usePhotoLogging';
import {
  formatNumber,
  validateQuantityInput,
} from '../../../../utils/NumberUtils';
import { updateSlider } from '../../../../utils/V3Utils';
import type { EditServingSizeProps } from './EditServingSizeModal';
import type {
  PassioFoodAmount,
  PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import type Slider from '@react-native-community/slider';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../../../navigaitons';
import {
  getNutrientsOfPassioFoodItem,
  getNutrientsReferenceOfPassioFoodItem,
} from '../../../../utils';

interface Select {
  label: string;
  value: string;
}

export type NavigationProps = StackNavigationProp<
  ParamList,
  'PhotoLoggingScreen'
>;

export const useEditServing = (props: EditServingSizeProps) => {
  const result = props.result;

  const name = result.passioFoodItem?.name || '';
  const iconID = result.passioFoodItem?.iconId;
  const passioAmount = props.result.passioFoodItem?.amount;
  const qtyTextInputRef = useRef<TextInput>(null);
  const sliderRef = useRef<Slider>(null);
  const branding = useBranding();

  const [selectedUnit, setSelectedUnit] = useState(passioAmount?.selectedUnit);
  const [weight, setWeight] = useState(passioAmount?.weight?.value);
  const [quantity, setQty] = useState(passioAmount?.selectedQuantity);
  const quantityRef = useRef(passioAmount?.selectedQuantity);
  const [sliderConfig, setSliderConfig] = useState<number[]>(
    updateSlider(Number(passioAmount?.selectedQuantity))
  );

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
        setWeight(Number(formatNumber(defaultWeight * Number(qty)) ?? 0 ?? 0));
      } else {
        setWeight(0);
      }
      if (isSlider) {
        const numQty = Number(qty);
        qtyTextInputRef?.current?.setNativeProps({
          text: formatNumber(numQty)?.toString(),
        });
        quantityRef.current = numQty;
        setQty(Number(numQty));
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
      update(validateQuantityInput(qty), selectedUnit ?? 'gram', isSlider);
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

  const servingSizes: Select[] =
    result?.passioFoodItem?.amount?.servingSizes?.map((item) => {
      const option: Select = {
        label: item.unitName,
        value: item.unitName,
      };
      return option;
    }) ?? [];

  const updatePassioFoodItem = () => {
    let passioFoodItem: PassioFoodItem | undefined = result?.passioFoodItem;
    const ingredients = passioFoodItem?.ingredients;

    if (passioFoodItem && result && ingredients) {
      const amount: PassioFoodAmount = {
        ...passioFoodItem.amount,
        selectedQuantity: Number(quantityRef.current || 0),
        selectedUnit: selectedUnit ?? 'gram',
        weight: {
          unit: 'g',
          value: weight ?? 0,
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
              getNutrientsReferenceOfPassioFoodItem(passioFoodItem),
          },
        ],
      };
    }

    if (passioFoodItem) {
      const photoLogging = {
        ...result,
        passioFoodItem: passioFoodItem,
        nutrients: getNutrientsOfPassioFoodItem(
          passioFoodItem,
          passioFoodItem.amount.weight
        ),
      } as PhotoLoggingResults;
      return photoLogging;
    } else {
      return undefined;
    }
  };

  const handleDoneClick = () => {
    const updatedResult = updatePassioFoodItem();
    if (updatedResult) {
      props?.onUpdateFoodItem?.(updatedResult);
    }
  };

  const handleNutritionFactClick = () => {
    const updatedResult = updatePassioFoodItem();
    if (updatedResult) {
      props?.openNutritionFactModificationPopup?.(updatedResult);
    }
  };

  return {
    branding,
    handleQtyUpdate,
    handleServingChange,
    qtyTextInputRef,
    sliderRef,
    quantity,
    selectedUnit,
    servingSizes,
    weight,
    sliderConfig,
    handleDoneClick,
    handleNutritionFactClick,
    name,
    iconID,
  };
};
