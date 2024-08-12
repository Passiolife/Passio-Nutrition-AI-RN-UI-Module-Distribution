import type { Water } from 'src/models/Water';
import type {
  CustomFood,
  CustomImageID,
  CustomRecipe,
  Image,
  NutritionProfile,
  Recipe,
} from '../../models';
import type { FoodLog, FavoriteFoodItem } from '../../models';
import type { PatientProfile } from '../../models';
import type { Weight } from '../../models/Weight';

export interface NutritionDataService {
  saveNutritionProfile: (nutritionProfile: NutritionProfile) => Promise<void>;
  getNutritionProfile: () => Promise<NutritionProfile | undefined>;
  saveFoodLog(foodLog: FoodLog): Promise<void>;
  deleteFoodLog(uuID: string): Promise<void>;
  getFoodLogs(): Promise<FoodLog[]>;
  saveCustomFood(food: CustomFood): Promise<void>;
  saveCustomRecipe(food: CustomRecipe): Promise<void>;
  deleteCustomFood(uuID: string): Promise<void>;
  deleteCustomRecipe(uuID: string): Promise<void>;
  getCustomFoodLogs(): Promise<CustomFood[]>;
  getCustomRecipes(): Promise<CustomRecipe[]>;
  getCustomFoodLog(uuID: string): Promise<CustomFood | undefined | null>;
  getCustomRecipe(uuID: string): Promise<CustomRecipe | undefined | null>;
  saveFavoriteFoodItem(favoriteFoodItem: FavoriteFoodItem): Promise<void>;
  getFavoriteFoodItems(): Promise<FavoriteFoodItem[]>;
  deleteFavoriteFoodItem(uuID: string): Promise<void>;
  getMealLogs(startDate: Date, endDate: Date): Promise<FoodLog[]>;
  getPatientProfile(): Promise<PatientProfile>;
  getRecipes(): Promise<Recipe[]>;
  saveRecipe(recipe: Recipe): Promise<void>;
  deleteRecipe(uuID: string): Promise<void>;
  getWaters(startDate: Date, endDate: Date): Promise<Water[]>;
  deleteWater(uuid: string): Promise<void>;
  deleteWeight(uuid: string): Promise<void>;
  saveWater: (water: Water) => Promise<void>;
  getWeight: (startDate: Date, endDate: Date) => Promise<Weight[]>;
  saveWeight: (weight: Weight) => Promise<void>;
  saveImage: (image: Image) => Promise<CustomImageID>;
  getImage: (id: CustomImageID) => Promise<Image | undefined | null>;
}
