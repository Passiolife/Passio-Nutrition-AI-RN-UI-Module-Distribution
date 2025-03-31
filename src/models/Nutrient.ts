export interface Nutrient {
  id: NutrientType;
  amount: number;
  unit: string;
}
export type NutrientUnit = 'cal' | 'kcal' | 'g' | 'mg' | 'μg' | 'IU' | 'ml';

export type NutrientType =
  | 'calories'
  | 'carbs'
  | 'fat'
  | 'calcium'
  | 'protein'
  | 'transFat'
  | 'monounsaturatedFat'
  | 'polyunsaturatedFat'
  | 'cholesterol'
  | 'sodium'
  | 'sugars'
  | 'satFat'
  | 'vitaminD'
  | 'calcium'
  | 'iron'
  | 'potassium'
  | 'vitaminA'
  | 'vitaminC'
  | 'alcohol'
  | 'sugarAlcohol'
  | 'vitaminB12'
  | 'vitaminB12Added'
  | 'vitaminB6'
  | 'vitaminE'
  | 'vitaminEAdded'
  | 'magnesium'
  | 'phosphorus'
  | 'zinc'
  | 'selenium'
  | 'folicAcid'
  | 'vitaminKPhylloquinone'
  | 'vitaminKMenaquinone4'
  | 'vitaminKDihydrophylloquinone'
  | 'chromium'
  | 'fibers'
  | 'sugarsAdded'
  | 'weight'
  | 'iodine'
  | 'vitaminARAE';

export const unitForNutrient = (id: NutrientType) => nutrientUnits[id];

export const nutrientUnits: Record<NutrientType, NutrientUnit> = {
  calories: 'kcal',
  carbs: 'g',
  fat: 'g',
  protein: 'g',
  satFat: 'g',
  transFat: 'g',
  monounsaturatedFat: 'g',
  polyunsaturatedFat: 'g',
  cholesterol: 'mg',
  sodium: 'mg',
  sugars: 'g',
  sugarsAdded: 'g',
  vitaminD: 'μg',
  calcium: 'mg',
  iron: 'mg',
  potassium: 'mg',
  vitaminA: 'IU',
  vitaminC: 'mg',
  alcohol: 'g',
  sugarAlcohol: 'g',
  vitaminB12: 'μg',
  vitaminB12Added: 'μg',
  vitaminB6: 'mg',
  vitaminE: 'mg',
  vitaminEAdded: 'mg',
  magnesium: 'mg',
  phosphorus: 'mg',
  iodine: 'μg',
  zinc: 'mg',
  selenium: 'μg',
  folicAcid: 'μg',
  vitaminKPhylloquinone: 'μg',
  vitaminKMenaquinone4: 'μg',
  vitaminKDihydrophylloquinone: 'μg',
  fibers: 'g',
  chromium: 'μg',
  vitaminARAE: 'μg',
  weight: 'g',
};

export const nutrientName: Record<NutrientType, String> = {
  calories: 'Calories',
  satFat: 'Saturated Fat',
  carbs: 'Carbs',
  fat: 'Fat',
  protein: 'Protein',
  transFat: 'TransFat',
  monounsaturatedFat: 'Monounsaturated Fat',
  polyunsaturatedFat: 'Polyunsaturated Fat',
  cholesterol: 'Cholesterol',
  sodium: 'Sodium',
  sugars: 'Total Sugar',
  sugarsAdded: 'Added Sugar',
  vitaminD: 'Vitamin D',
  calcium: 'Calcium',
  iron: 'Iron',
  potassium: 'Potassium',
  vitaminA: 'Vitamin A',
  vitaminC: 'Vitamin C',
  alcohol: 'Alcohol',
  sugarAlcohol: 'Sugar Alcohol',
  vitaminB12: 'Vitamin B12',
  vitaminB12Added: 'Vitamin B12 Added',
  vitaminB6: 'Vitamin B6',
  vitaminE: 'Vitamin E',
  vitaminEAdded: 'Vitamin E',
  magnesium: 'Magnesium',
  phosphorus: 'Phosphorus',
  iodine: 'Iodine',
  zinc: 'Zinc',
  selenium: 'Selenium',
  folicAcid: 'Folic Acid',
  vitaminKPhylloquinone: 'Vitamin K Phylloquinone',
  vitaminKMenaquinone4: 'Vitamin K Menaquinone',
  vitaminKDihydrophylloquinone: 'Vitamin K Dihydrophylloquinone',
  chromium: 'Chromium',
  fibers: 'Dietary Fibers',
  weight: 'weight',
  vitaminARAE: 'Vitamin A RAE',
};

export const recommendedNutrient: Record<NutrientType, number> = {
  ['calories']: 0,
  ['carbs']: 0,
  ['fat']: 0,
  ['protein']: 0,
  ['satFat']: 20,
  ['transFat']: 0,
  ['monounsaturatedFat']: 22,
  ['polyunsaturatedFat']: 44,
  ['cholesterol']: 300,
  ['calcium']: 1000,
  ['sodium']: 2300,
  ['fibers']: 28,
  ['sugars']: 50,
  ['sugarsAdded']: 0,
  ['vitaminD']: 20,
  ['iron']: 18,
  ['potassium']: 4700,
  ['vitaminA']: 3000,
  ['vitaminC']: 90,
  ['alcohol']: 0,
  ['sugarAlcohol']: 0,
  ['vitaminB12']: 2.4,
  ['vitaminB12Added']: 0,
  ['vitaminB6']: 1.7,
  ['vitaminE']: 15,
  ['vitaminEAdded']: 0,
  ['magnesium']: 420,
  ['phosphorus']: 0,
  ['iodine']: 150,
  zinc: 0,
  selenium: 0,
  folicAcid: 0,
  weight: 0,
  vitaminKPhylloquinone: 0,
  vitaminKMenaquinone4: 0,
  vitaminKDihydrophylloquinone: 0,
  vitaminARAE: 0,
  chromium: 0,
};

export const sortByNutrientType: NutrientType[] = [
  'satFat',
  'transFat',
  'cholesterol',
  'sodium',
  'fibers',
  'sugars',
  'sugarsAdded',
  'vitaminD',
  'calcium',
  'iron',
  'potassium',
  'polyunsaturatedFat',
  'monounsaturatedFat',
  'magnesium',
  'iodine',
  'vitaminB6',
  'vitaminB12',
  'vitaminE',
  'vitaminA',
  'vitaminARAE',
  'vitaminC',
  'zinc',
  'selenium',
  'folicAcid',
  'chromium',
  'fibers',
];
