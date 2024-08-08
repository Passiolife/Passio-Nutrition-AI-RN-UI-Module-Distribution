import type { Water } from './../../../models/Water';
import type { Weight } from '../../../models/Weight';
import {
  DBHandler,
  getFoodLogs,
  saveFoodLog,
  getMealLogsByStartDateAndEndDate,
  saveFavouriteFood,
  getFavoriteFoodItems,
  deleteFoodLog,
  deleteFavoriteFoodLog,
  getRecipes,
  saveRecipe,
  deleteRecipe,
  saveWater,
  getWaterByStartDateAndEndDate,
  saveWeight,
  getWeightByStartDateAndEndDate,
  deleteWaterLog,
  deleteWeightLog,
  getCustomFoods,
  saveCustomFood,
  deleteCustomFood,
  getImage,
  saveImage,
  getCustomFood,
} from '../../../db';
import {
  ActivityLevelType,
  CustomFood,
  CustomImageID,
  Image,
  UnitSystem,
  type FavoriteFoodItem,
  type FoodLog,
  type NutritionProfile,
  type Recipe,
} from '../../../models';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NutritionDataService } from '../NutritionDataService';

const dataService: NutritionDataService = {
  getPatientProfile: () => {
    return Promise.resolve(require('../../../db/patient_profile.json'));
  },
  async saveFoodLog(foodLog: FoodLog): Promise<void> {
    return saveFoodLog(await DBHandler.getInstance(), foodLog);
  },
  async saveCustomFood(foodLog: CustomFood): Promise<void> {
    return saveCustomFood(await DBHandler.getInstance(), foodLog);
  },
  async saveWater(water: Water): Promise<void> {
    return saveWater(await DBHandler.getInstance(), water);
  },
  async saveWeight(weight: Weight): Promise<void> {
    return saveWeight(await DBHandler.getInstance(), weight);
  },

  getFoodLogs: function (): Promise<FoodLog[]> {
    return getFoodLogs();
  },
  getCustomFoodLogs: function (): Promise<CustomFood[]> {
    return getCustomFoods();
  },
  async deleteFoodLog(uuid: string): Promise<void> {
    return deleteFoodLog(await DBHandler.getInstance(), uuid);
  },
  async deleteCustomFood(uuid: string): Promise<void> {
    return deleteCustomFood(await DBHandler.getInstance(), uuid);
  },
  async deleteRecipe(uuid: string): Promise<void> {
    return deleteRecipe(await DBHandler.getInstance(), uuid);
  },
  async deleteFavoriteFoodItem(uuid: string): Promise<void> {
    return deleteFavoriteFoodLog(await DBHandler.getInstance(), uuid);
  },
  async getMealLogs(startDate: Date, endDate: Date): Promise<FoodLog[]> {
    return getMealLogsByStartDateAndEndDate(startDate, endDate);
  },

  async getWaters(startDate: Date, endDate: Date): Promise<Water[]> {
    return getWaterByStartDateAndEndDate(startDate, endDate);
  },

  async deleteWater(uuid: string): Promise<void> {
    return deleteWaterLog(await DBHandler.getInstance(), uuid);
  },

  async deleteWeight(uuid: string): Promise<void> {
    return deleteWeightLog(await DBHandler.getInstance(), uuid);
  },

  async getWeight(startDate: Date, endDate: Date): Promise<Weight[]> {
    return getWeightByStartDateAndEndDate(startDate, endDate);
  },

  async saveFavoriteFoodItem(
    favoriteFoodItem: FavoriteFoodItem
  ): Promise<void> {
    return saveFavouriteFood(await DBHandler.getInstance(), favoriteFoodItem);
  },
  getFavoriteFoodItems: function (): Promise<FavoriteFoodItem[]> {
    return getFavoriteFoodItems();
  },
  saveNutritionProfile: (nutritionProfile): Promise<void> => {
    return AsyncStorage.setItem(
      'nutritionProfile',
      JSON.stringify(nutritionProfile)
    );
  },
  async saveRecipe(recipe: Recipe): Promise<void> {
    return saveRecipe(await DBHandler.getInstance(), recipe);
  },
  getRecipes: function (): Promise<Recipe[]> {
    return getRecipes();
  },
  getImage: function (id: CustomImageID): Promise<Image | undefined> {
    return getImage(id);
  },
  saveImage: async function (image: Image): Promise<CustomImageID> {
    return saveImage(await DBHandler.getInstance(), image);
  },
  getNutritionProfile: (): Promise<NutritionProfile | undefined> => {
    return new Promise<NutritionProfile | undefined>((resolve, reject) => {
      AsyncStorage.getItem('nutritionProfile')
        .then((profileString) => {
          const profile: NutritionProfile | undefined = profileString
            ? JSON.parse(profileString ?? '')
            : {
                age: 26,
                height: 183,
                weight: 60,
                gender: 'male',
                unitLength: UnitSystem.IMPERIAL,
                unitsWeight: UnitSystem.IMPERIAL,
                targetWater: 100,
                targetWeight: 70,
                caloriesTarget: 1300,
                carbsPercentage: 50,
                fatPercentage: 25,
                proteinPercentage: 25,
                activityLevel: ActivityLevelType.active,
              };
          resolve(profile);
        })
        .catch((reason) => {
          reject(reason);
        });
    });
  },
  getCustomFoodLog: function (
    uuID: string
  ): Promise<CustomFood | undefined | null> {
    return getCustomFood(uuID);
  },
};
export default dataService;
