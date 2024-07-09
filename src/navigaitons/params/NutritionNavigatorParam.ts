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
  CustomFood,
  MealLabel,
  Nutrient,
  Water,
  Weight,
} from '../../models';
import type { FavoritesScreenProps } from '../../screens/myFavoritess';
import type {
  TakePictureScreenProps,
  VoiceLoggingScreenProps,
} from '../../screens/voiceLogging';

export type Module =
  | 'QuickScan'
  | 'MealLog'
  | 'Search'
  | 'Other'
  | 'Favorites'
  | 'VoiceLogging'
  | 'Ingredient';

export interface HomeBottom {
  screen:
    | 'MealLogScreen'
    | 'HomeScreen'
    | 'ProgressScreen'
    | 'MyPlanScreen'
    | 'Bank';
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
}

export type ImagePickerType = 'camera' | 'gallery';
interface ImagePickerProps {
  onImages: (images: string[]) => void;
  type: ImagePickerType;
}
export interface AdvisorScreenProps {
  logToDate?: Date | undefined;
  logToMeal?: MealLabel | undefined;
}
export interface FoodCreatorNavProps {
  logToDate?: Date | undefined;
  logToMeal?: MealLabel | undefined;
  foodLog?: CustomFood;
}
export interface MyFoodsScreenNavProps {
  logToDate?: Date | undefined;
  logToMeal?: MealLabel | undefined;
}

export type ParamList = {
  MealLogScreen: MealLogScreenProps;
  ScanningScreen: ScanningScreenProps;
  EditFoodLogScreen: EditFoodLogScreenProps;
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
};
