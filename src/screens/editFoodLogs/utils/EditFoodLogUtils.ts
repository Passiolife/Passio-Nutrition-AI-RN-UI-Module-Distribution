import type {
  FoodItem,
  NutrientType,
  ServingUnit,
  Nutrient,
  ServingInfo,
} from '../../../models';
import type { ComputedWeight } from '../../../models/ComputedWeight';

export function maxSliderValue(qty: number): number {
  const sliderMultiplier = 5.0;
  if (qty <= 0) {
    qty = 1;
  }
  if (qty > 100 && qty <= 500) {
    return 500;
  } else if (qty > 0 && qty <= 5) {
    return 5;
  }
  return sliderMultiplier * qty;
}

export function steps(sliderMaxValue: number): number {
  if (sliderMaxValue >= 0 && sliderMaxValue <= 10) {
    return 0.5;
  } else if (sliderMaxValue >= 10 && sliderMaxValue <= 100) {
    return 1;
  } else {
    return 10;
  }
}

export function totalAmountOfNutrient(
  foodItems: FoodItem[],
  nutrientType: NutrientType
): number {
  let totalAmount = 0;
  foodItems.forEach((foodItem) => {
    foodItem.nutrients.forEach((value) => {
      if (value.id === nutrientType) {
        totalAmount = totalAmount + value.amount;
      }
    });
  });
  return totalAmount > 1
    ? Math.floor(totalAmount)
    : parseFloat(totalAmount.toFixed(1));
}

export function calculateMassOfServingUnit(
  servingUnits: ServingUnit[],
  selectedUnit: string
): number {
  let unit = 1;
  servingUnits?.forEach((value) => {
    if (value.unit === selectedUnit) {
      unit = value.mass;
    }
  });
  return unit;
}

export function calculateComputedWeightAmount(
  qty: number,
  servingUnits: ServingUnit[],
  unit: string
) {
  const result = qty * calculateMassOfServingUnit(servingUnits, unit);
  return result < 10 ? result : Math.ceil(result);
}

export function updatingFoodItem(
  servingInfo: ServingInfo,
  foodItems: FoodItem[],
  updatedQty: number,
  updateUnit: string
): FoodItem[] {
  let originWeight = calculateComputedWeightAmount(
    servingInfo.selectedQuantity,
    servingInfo.servingUnits,
    servingInfo.selectedUnit
  );
  if (originWeight === 0) {
    originWeight = 1;
  }
  let newWeight = calculateComputedWeightAmount(
    updatedQty,
    servingInfo.servingUnits,
    updateUnit
  );

  if (newWeight === 0) {
    newWeight = 1;
  }

  let copyFoodItems: FoodItem[] = [];
  foodItems.forEach((foodItem) => {
    let nutrients: Nutrient[] = [];
    foodItem.nutrients.forEach((nutrient: Nutrient) => {
      const amount = (newWeight * nutrient.amount) / originWeight;
      const copyOfNutrient: Nutrient = {
        ...nutrient,
        ...{ amount: amount },
      };
      nutrients.push(copyOfNutrient);
    });
    const copyOfComputedWeight: ComputedWeight = {
      ...foodItem.computedWeight,
      value: newWeight,
    };
    const newFoodItem: FoodItem = {
      ...foodItem,
      selectedQuantity: parseFloat(updatedQty.toString()),
      selectedUnit: updateUnit,
      nutrients: nutrients,
      computedWeight: copyOfComputedWeight,
    };
    copyFoodItems.push(newFoodItem);
  });
  return copyFoodItems;
}
