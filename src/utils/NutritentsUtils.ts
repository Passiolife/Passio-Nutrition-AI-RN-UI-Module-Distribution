import type { Nutrient, NutrientType } from '../models';

export const mergeNutrients = (nutrientsArray: Nutrient[]): Nutrient[] => {
  const mergedMap = new Map<NutrientType, Nutrient>();
  // sortByNutrientType.forEach((type) => {
  //   mergedMap.set(type, {
  //     amount: 0,
  //     id: type,
  //     unit: nutrientUnits[type],
  //   });
  // });

  for (const nutrient of nutrientsArray) {
    const { id, amount, unit } = nutrient;

    if (mergedMap.has(id)) {
      // Nutrient with the same name already exists, add their values
      const existingNutrient = mergedMap.get(id);
      if (existingNutrient && amount !== undefined) {
        (existingNutrient.amount =
          // eslint-disable-next-line no-sequences
          (existingNutrient.amount ?? 0) + (amount ?? 0)),
          (existingNutrient.unit = unit);
        existingNutrient.id = id;
      }
    } else {
      // Nutrient with this name doesn't exist yet, add it to the map
      mergedMap.set(id, {
        ...nutrient,
        amount: amount ? amount : 0,
        id: id ? id : 'alcohol',
        unit: unit ? unit : 'g',
      });
    }
  }

  // Convert the map back to an array
  const mergedArray = Array.from(mergedMap.values());
  return mergedArray;
};
