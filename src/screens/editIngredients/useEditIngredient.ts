import type { EditIngredientsScreenProps } from '..';
import type { FoodItem } from '../../models';
import type { PassioIDAttributes } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { convertPassioIDAttributesToFoodItem } from '../../utils';
import { useState } from 'react';

export function useEditIngredient(props: EditIngredientsScreenProps) {
  const [foodItem, updateFoodItem] = useState<FoodItem | undefined>(
    props?.foodItem
  );
  const [isOpenChangeNameAlert, openChangeNameAlert] = useState<boolean>(false);

  const onSwitchAlternative = async (attributes: PassioIDAttributes) => {
    if (attributes.foodItem !== undefined) {
      updateFoodItem(convertPassioIDAttributesToFoodItem(attributes));
    }
  };

  return {
    foodItem,
    isOpenChangeNameAlert,
    openChangeNameAlert,
    updateFoodItem,
    onSwitchAlternative,
  };
}
