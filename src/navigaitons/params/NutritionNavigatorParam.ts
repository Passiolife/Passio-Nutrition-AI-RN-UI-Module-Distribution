import type { EditIngredientsScreenProps } from '../../screens/editIngredients';
import type {
  MealLogScreenProps,
  ScanningScreenProps,
  EditFoodLogScreenProps,
  FoodSearchScreenProp,
  RecipeEditorScreenProps,
  MyRecipeScreenProps,
  MyPlanScreenProps,
  HomeScreenScreenProps,
} from '../../screens';
import type { IngredientQuickScanScreenProps } from '../../screens/recipeEditor/RecipesScan/IngredientQuickScanScreen/IngredientQuickScanScreen';
import type {
  BarcodeCustomResult,
  CustomFood,
  CustomRecipe,
  FoodLog,
  MealLabel,
  Nutrient,
  Water,
  Weight,
} from '../../models';
import type { FavoritesScreenProps } from '../../screens/myFavoritess';
import type { VoiceLoggingScreenProps } from '../../screens/voiceLogging';

export type Module =
  | 'QuickScan'
  | 'MealLog'
  | 'Search'
  | 'Other'
  | 'Favorites'
  | 'VoiceLogging'
  | 'MyFood'
  | 'Recipe'
  | 'NutritionFact'
  | 'FoodDetail'
  | 'Barcode'
  | 'ExistedBarcode'
  | 'Ingredient';

export interface HomeBottom {
  screen:
    | 'MealLogScreen'
    | 'HomeScreen'
    | 'ProgressScreen'
    | 'MyPlanScreen'
    | 'Bank';
  params?: any;
}

interface WaterEntryProp {
  onSave: () => void;
  water?: Water;
}
interface WeightEntryProp {
  onSave: () => void;
  weight?: Weight;
}
interface SettingScreenProps {
  onSave?: () => void;
}

interface NutritionScreenProps {
  nutrient: Nutrient[];
  foodLog: FoodLog;
}

export type ImagePickerType = 'camera' | 'gallery';
interface ImagePickerProps {
  onImages: (images: string[]) => void;
  type: ImagePickerType;
  isMultiple?: boolean;
}
export interface AdvisorScreenProps {
  logToDate?: Date | undefined;
  logToMeal?: MealLabel | undefined;
}
export interface FoodCreatorNavProps {
  logToDate?: Date | undefined;
  logToMeal?: MealLabel | undefined;
  foodLog?: CustomFood;
  from?: Module;
  onSave?: (customFood?: CustomFood) => void;
}
export interface MyFoodsScreenNavProps {
  logToDate?: Date | undefined;
  logToMeal?: MealLabel | undefined;
  tab?: 'CustomFood' | 'Recipe';
}
export interface BarcodeScanScreenNavProps {
  onCreateFoodAnyWay?: (result?: BarcodeCustomResult) => void;
  onViewExistingItem?: (result?: BarcodeCustomResult) => void;
  onBarcodePress?: (result?: BarcodeCustomResult) => void;
}
export interface EditRecipeScreenProps {
  recipe: CustomRecipe;
  from: String | Module;
  onSaveLogPress?: (recipe: CustomRecipe) => void;
  onDeleteLogPress?: (recipe: CustomRecipe) => void;
  onCancelPress?: () => void;
}

export interface TakePictureScreenProps {
  logToDate?: Date | undefined;
  logToMeal?: MealLabel | undefined;
  type: 'picture' | 'camera';
  isMultiple?: boolean;
  images?: string[];
}
export type ParamList = {
  MealLogScreen: MealLogScreenProps;
  ScanningScreen: ScanningScreenProps;
  EditFoodLogScreen: EditFoodLogScreenProps;
  EditRecipeScreen: EditRecipeScreenProps;
  ProfileScreen: undefined;
  ProfileScreenApp: undefined;
  DashboardScreen: undefined;
  FoodSearchScreen: FoodSearchScreenProp;
  FavoritesScreen: FavoritesScreenProps;
  EditIngredientScreen: EditIngredientsScreenProps;
  OnboardingScreen: undefined;
  MyRecipeScreen: MyRecipeScreenProps;
  RecipeEditorScreen: RecipeEditorScreenProps;
  IngredientQuickScanScreen: IngredientQuickScanScreenProps;
  MyPlanScreen: MyPlanScreenProps;
  ProgressScreen: undefined;
  BottomNavigation: HomeBottom;
  HomeScreen: HomeScreenScreenProps;
  WaterScreen: undefined;
  WaterEntry: WaterEntryProp;
  WeightScreen: undefined;
  WeightEntry: WeightEntryProp;
  SettingScreen: SettingScreenProps;
  NutritionInformationScreen: NutritionScreenProps;
  VoiceLoggingScreen: VoiceLoggingScreenProps;
  TakePictureScreen: TakePictureScreenProps;
  AdvisorScreen: AdvisorScreenProps;
  ImagePickerScreen: ImagePickerProps;
  FoodCreatorScreen: FoodCreatorNavProps;
  MyFoodsScreen: MyFoodsScreenNavProps;
  BarcodeScanScreen: BarcodeScanScreenNavProps;
};
