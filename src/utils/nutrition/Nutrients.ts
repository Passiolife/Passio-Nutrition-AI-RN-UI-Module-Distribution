import type {
  PassioFoodItem,
  PassioIngredient,
  PassioNutrients,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { DEFAULT_UNIT_MASS, unitConverter } from './NutrientsHelper';
import type { UnitType } from './NutrientsHelper';

export interface UnitMass {
  unit: string;
  value: number;
}

// Defining a class named PassioFoodItemNutrients implementing the PassioNutrients interface

interface IngredientData {
  reference: PassioNutrients;
  value: number;
}
interface FoodNutrients {
  ingredients?: PassioIngredient[];
}

export function getNutrientsReferenceOfPassioFoodItem(
  passioFoodItem: PassioFoodItem
): PassioNutrients {
  return new PassioFoodItemNutrients(passioFoodItem).nutrientsReference();
}

export function getNutrientsOfPassioFoodItem(
  passioFoodItem: PassioFoodItem,
  weight: UnitMass
): PassioNutrients {
  return new PassioFoodItemNutrients(passioFoodItem).nutrients(weight);
}

export class PassioFoodItemNutrients {
  // Property to store the PassioFoodItem instance
  private passioFoodItem: PassioIngredient[];
  // Constructor to initialize the class instance with a PassioFoodItem object
  constructor(item: FoodNutrients) {
    this.passioFoodItem = item.ingredients ?? [];
  }

  // Method to calculate nutrients for the selected size
  nutrientsSelectedSize(): PassioNutrients {
    return this.calculateIngredientsNutritionUsingWeight();
  }

  // Method to calculate nutrients for a specific weight
  nutrients(unitMass: UnitMass): PassioNutrients {
    return this.calculateIngredientsNutritionUsingWeight(unitMass);
  }

  // Method to calculate nutrients for a reference weight
  nutrientsReference(): PassioNutrients {
    return this.calculateIngredientsNutritionUsingWeight({
      unit: 'g',
      value: 100,
    });
  }

  private unitConverter = {
    ['kCal']: 1.0,
    ['kcal']: 1.0,
    ['dag']: 0.01,
    ['kg']: 1.0,
    ['g']: 0.001,
    ['dg']: 0.0001,
    ['cg']: 0.00001,
    ['mg']: 0.000001,
    ['ug']: 0.000000001,
    ['µg']: 0.000000001,
    ['ml']: 0.001,
    ['kj']: 0.239006,
    ['IU']: 0.239006,
    ['iu']: 0.239006,
    ['oz']: 0.035274,
  };

  convertValueIntoGram = (mass?: UnitMass) => {
    if (mass?.value === undefined) {
      return 0;
    }
    const value = unitConverter[(mass?.unit ?? 'g') as UnitType] * 1000;
    return mass.value * value;
  };

  private servingWeight = (item: PassioIngredient): UnitMass => {
    let serving = item.amount.servingUnits?.find(
      (unit) => unit.unitName === item.amount.selectedUnit
    );
    let weight: UnitMass = serving
      ? {
          unit: serving.unit,
          value: serving.value * item.amount.selectedQuantity,
        }
      : DEFAULT_UNIT_MASS;

    return weight;
  };

  private gramsValue(value: number, unit: UnitType): number {
    return value * this.unitConverter[unit] * 1000;
  }

  private plus(previous: UnitMass, add?: UnitMass | null): UnitMass {
    if (add === undefined || add === null) return previous;

    if (add?.unit === previous.unit) {
      return {
        unit: previous.unit,
        value: previous.value ?? 0 + (add.value ?? 0),
      };
    } else {
      return {
        unit: add.unit,
        value:
          this.gramsValue(previous.value ?? 0, add.unit as UnitType) +
          this.gramsValue(add.value ?? 0, add.unit as UnitType),
      };
    }
  }

  private sumOfUnitMass(unitMass?: UnitMass[]): UnitMass {
    // Calculate the sum of the 'value' property using reduce

    if (unitMass === undefined) {
      return DEFAULT_UNIT_MASS;
    }

    let previousValue: UnitMass | null = null;

    unitMass.forEach((currentValue) => {
      previousValue = this.plus(currentValue, previousValue);
    });

    return previousValue ?? DEFAULT_UNIT_MASS;
  }

  private ingredientWeight(): UnitMass {
    const ingredient = [...(this.passioFoodItem ?? [])];
    const units = ingredient?.map(this.servingWeight);
    const selectedWeight = this.sumOfUnitMass(units);
    return selectedWeight;
  }

  private div(first: UnitMass, second: UnitMass): number {
    return (
      this.gramsValue(first.value ?? 0, first.unit as UnitType) /
      this.gramsValue(second.value ?? 0, second.unit as UnitType)
    );
  }

  private scaleValueByAmount(
    currentWeight: UnitMass,
    referenceWeight: UnitMass,
    mass?: UnitMass | null
  ): UnitMass | null | undefined {
    if (mass == null) {
      return null;
    }
    if (mass === undefined) {
      return undefined;
    }

    return {
      unit: mass.unit,
      value:
        (mass.value ?? 0) *
        (this.gramsValue(
          currentWeight.value ?? 0,
          currentWeight.unit as UnitType
        ) /
          this.gramsValue(
            referenceWeight.value ?? 0,
            referenceWeight.unit as UnitType
          )),
    };
  }

  // Private method to calculate nutrients using a given weight
  private calculateIngredientsNutritionUsingWeight(computedWeight?: UnitMass) {
    const currentWeight = this.ingredientWeight();
    const weight = computedWeight ?? currentWeight;
    const ingredients = [...(this.passioFoodItem ?? [])];

    let ingredientNutrients: IngredientData[] | undefined = ingredients?.map(
      (item) => {
        const data: IngredientData = {
          reference: item.referenceNutrients,
          value: this.div(this.servingWeight(item), currentWeight),
        };
        return data;
      }
    );

    let passioNutrients: PassioNutrients = {
      weight: weight ?? currentWeight,
    };

    passioNutrients.vitaminA =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.vitaminA === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.vitaminA?.unit ?? 'IU',
                value: (item.reference.vitaminA?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.alcohol =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.alcohol === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.alcohol?.unit ?? 'g',
                value: (item.reference.alcohol?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.calcium =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.calcium === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.calcium?.unit ?? 'mg',
                value: (item.reference.calcium?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.calories =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.calories === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.calories?.unit ?? 'kcal',
                value: (item.reference.calories?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.carbs =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.carbs === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.carbs?.unit ?? 'g',
                value: (item.reference.carbs?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.cholesterol =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.cholesterol === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.cholesterol?.unit ?? 'mg',
                value: (item.reference.cholesterol?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.fat =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.fat === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.fat?.unit ?? 'g',
                value: (item.reference.fat?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.fibers =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.fibers === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.fibers?.unit ?? 'g',
                value: (item.reference.fibers?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.iodine =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.iodine === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.iodine?.unit ?? 'ug',
                value: (item.reference.iodine?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.iron =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.iron === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.iron?.unit ?? 'mg',
                value: (item.reference.iron?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.magnesium =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.magnesium === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.magnesium?.unit ?? 'mg',
                value: (item.reference.magnesium?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.monounsaturatedFat =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.monounsaturatedFat === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.monounsaturatedFat?.unit ?? 'g',
                value:
                  (item.reference.monounsaturatedFat?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.phosphorus =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.phosphorus === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.phosphorus?.unit ?? 'mg',
                value: (item.reference.phosphorus?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.polyunsaturatedFat =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.polyunsaturatedFat === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.polyunsaturatedFat?.unit ?? 'g',
                value:
                  (item.reference.polyunsaturatedFat?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.potassium =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.potassium === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.potassium?.unit ?? 'mg',
                value: (item.reference.potassium?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.protein =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.protein === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.protein?.unit ?? 'g',
                value: (item.reference.protein?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  item.reference.protein?.value ? unitMas : undefined
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.satFat =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.satFat === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.satFat?.unit ?? 'g',
                value: (item.reference.satFat?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.sodium =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.sodium === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.sodium?.unit ?? 'mg',
                value: (item.reference.sodium?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.sugarAlcohol =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.sugarAlcohol === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.sugarAlcohol?.unit ?? 'g',
                value: (item.reference.sugarAlcohol?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.sugars =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.sugars === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.sugars?.unit ?? 'g',
                value: (item.reference.sugars?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.sugarsAdded =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.sugarsAdded === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.sugarsAdded?.unit ?? 'g',
                value: (item.reference.sugarsAdded?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.transFat =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.transFat === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.transFat?.unit ?? 'g',
                value: (item.reference.transFat?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.vitaminB12 =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.vitaminB12 === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.vitaminB12?.unit ?? 'ug',
                value: (item.reference.vitaminB12?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.vitaminB12Added =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.vitaminB12Added === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.vitaminB12Added?.unit ?? 'ug',
                value:
                  (item.reference.vitaminB12Added?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.vitaminB6 =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.vitaminB6 === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.vitaminB6?.unit ?? 'mg',
                value: (item.reference.vitaminB6?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.vitaminC =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.vitaminC === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.vitaminC?.unit ?? 'mg',
                value: (item.reference.vitaminC?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.vitaminD =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.vitaminD === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.vitaminD?.unit ?? 'ug',
                value: (item.reference.vitaminD?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.vitaminE =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.vitaminE === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.vitaminE?.unit ?? 'mg',
                value: (item.reference.vitaminE?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.vitaminEAdded =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.vitaminEAdded === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.vitaminEAdded?.unit ?? 'mg',
                value: (item.reference.vitaminEAdded?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    //New
    passioNutrients.zinc =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.zinc === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.zinc?.unit ?? 'g',
                value: (item.reference.zinc?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.selenium =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.selenium === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.selenium?.unit ?? 'g',
                value: (item.reference.selenium?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.folicAcid =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.folicAcid === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.folicAcid?.unit ?? 'g',
                value: (item.reference.folicAcid?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.vitaminKPhylloquinone =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.vitaminKPhylloquinone === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.vitaminKPhylloquinone?.unit ?? 'g',
                value:
                  (item.reference.vitaminKPhylloquinone?.value ?? 0) *
                  item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.vitaminKMenaquinone4 =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.vitaminKMenaquinone4 === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.vitaminKMenaquinone4?.unit ?? 'g',
                value:
                  (item.reference.vitaminKMenaquinone4?.value ?? 0) *
                  item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.vitaminKDihydrophylloquinone =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.vitaminKDihydrophylloquinone ===
        undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.vitaminKDihydrophylloquinone?.unit ?? 'g',
                value:
                  (item.reference.vitaminKDihydrophylloquinone?.value ?? 0) *
                  item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.chromium =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.chromium === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.chromium?.unit ?? 'g',
                value: (item.reference.chromium?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );

    passioNutrients.vitaminARAE =
      ingredientNutrients.length === 1 &&
      ingredientNutrients?.[0]?.reference?.vitaminARAE === undefined
        ? undefined
        : this.sumOfUnitMass(
            ingredientNutrients?.map((item) => {
              let unitMas: UnitMass = {
                unit: item.reference.vitaminARAE?.unit ?? 'g',
                value: (item.reference.vitaminARAE?.value ?? 0) * item.value,
              };
              return (
                this.scaleValueByAmount(
                  weight,
                  item.reference.weight,
                  unitMas
                ) ?? DEFAULT_UNIT_MASS
              );
            })
          );
    return passioNutrients;
  }
}
