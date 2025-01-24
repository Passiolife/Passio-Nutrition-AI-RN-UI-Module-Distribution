import type {
  CustomFood,
  CustomImageID,
  CustomRecipe,
  FavoriteFoodItem,
  FoodLog,
  Image,
  Recipe,
  Water,
} from './../models';
import {
  ROW_BARCODE,
  ROW_BASE_64,
  ROW_BRAND_NAME,
  ROW_COMPUTED_WEIGHT,
  ROW_CONSUMED,
  ROW_DAY,
  ROW_ENTITY_TYPE,
  ROW_EVENT_TIME_STAMP,
  ROW_FOOD_ITEMS,
  ROW_ICON_ID,
  ROW_IMAGE_NAME,
  ROW_INGREDIENTS,
  ROW_LONG_NAME,
  ROW_MEAL,
  ROW_NAME,
  ROW_PASSIOID,
  ROW_REF_CODE,
  ROW_REF_CUSTOM_FOOD_ID,
  ROW_SELECTED_QUANTITY,
  ROW_SELECTED_UNIT,
  ROW_SERVING_SIZES,
  ROW_SERVING_UNITS,
  ROW_TIME,
  ROW_TOTAL_SERVINGS,
  ROW_USER_FOOD_IMAGE,
  ROW_UUID,
  ROW_WEIGHT,
  TABLE_CUSTOM_FOOD_LOGS,
  TABLE_CUSTOM_RECIPE_LOGS,
  TABLE_FAVOURITE_FOOD_LOGS,
  TABLE_FOOD_LOGS,
  TABLE_IMAGES,
  TABLE_RECIPE,
  TABLE_WATER,
  TABLE_WEIGHT,
} from './DBConstant';
import { DBHandler } from './DBHandler';
import type { ResultSet, SQLiteDatabase } from 'react-native-sqlite-storage';
import type { Weight } from 'src/models/Weight';

// Ok to allow console logging here as this is not production code
/* eslint-disable no-console */

// Save Food logs into local storage
export const saveFoodLog = async (
  db: SQLiteDatabase,
  foodLog: FoodLog
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT or REPLACE INTO  ${TABLE_FOOD_LOGS} (${ROW_UUID}, ${ROW_NAME}, ${ROW_MEAL}, ${ROW_IMAGE_NAME}, ${ROW_ENTITY_TYPE}, ${ROW_EVENT_TIME_STAMP},${ROW_REF_CODE},${ROW_REF_CUSTOM_FOOD_ID},${ROW_LONG_NAME}, ${ROW_USER_FOOD_IMAGE}, ${ROW_ICON_ID}, ${ROW_FOOD_ITEMS},${ROW_SERVING_SIZES},${ROW_SERVING_UNITS},${ROW_PASSIOID},${ROW_SELECTED_UNIT},${ROW_SELECTED_QUANTITY},${ROW_COMPUTED_WEIGHT}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.transaction((tx) => {
      tx.executeSql(
        insertQuery,
        [
          foodLog.uuid,
          foodLog.name,
          foodLog.meal,
          foodLog.longName,
          foodLog.entityType,
          foodLog.eventTimestamp,
          foodLog.refCode,
          foodLog.refCustomFoodID,
          foodLog.longName,
          undefined,
          foodLog.iconID,
          JSON.stringify(foodLog.foodItems),
          JSON.stringify(foodLog.servingSizes),
          JSON.stringify(foodLog.servingUnits),
          undefined,
          foodLog.selectedUnit,
          foodLog.selectedQuantity,
          JSON.stringify(foodLog.computedWeight),
        ],
        () => {
          resolve();
        },
        (_, error) => {
          console.error(`Failed to save food logs ${error}`);
          reject(error);
        }
      );
    });
  });
};

export const saveCustomFood = async (
  db: SQLiteDatabase,
  foodLog: CustomFood
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT or REPLACE INTO  ${TABLE_CUSTOM_FOOD_LOGS} (${ROW_UUID}, ${ROW_NAME}, ${ROW_IMAGE_NAME}, ${ROW_ENTITY_TYPE}, ${ROW_BARCODE}, ${ROW_BRAND_NAME}, ${ROW_USER_FOOD_IMAGE}, ${ROW_ICON_ID}, ${ROW_COMPUTED_WEIGHT}, ${ROW_FOOD_ITEMS},${ROW_SERVING_SIZES},${ROW_SERVING_UNITS},${ROW_SELECTED_UNIT},${ROW_SELECTED_QUANTITY}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    db.transaction((tx) => {
      tx.executeSql(
        insertQuery,
        [
          foodLog.uuid,
          foodLog.name,
          undefined,
          foodLog.entityType,
          foodLog.barcode,
          foodLog.brandName,
          foodLog.userFoodImage,
          foodLog.iconID,
          JSON.stringify(foodLog.computedWeight),
          JSON.stringify(foodLog.foodItems),
          JSON.stringify(foodLog.servingSizes),
          JSON.stringify(foodLog.servingUnits),
          foodLog.selectedUnit,
          foodLog.selectedQuantity,
        ],
        () => {
          resolve(foodLog.uuid);
        },
        (_, error) => {
          console.error(`Failed to save food logs ${error}`);
          reject(error);
        }
      );
    });
  });
};

export const saveCustomRecipe = async (
  db: SQLiteDatabase,
  foodLog: CustomRecipe
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT or REPLACE INTO  ${TABLE_CUSTOM_RECIPE_LOGS} (${ROW_UUID}, ${ROW_NAME}, ${ROW_IMAGE_NAME}, ${ROW_ENTITY_TYPE}, ${ROW_BARCODE}, ${ROW_BRAND_NAME}, ${ROW_USER_FOOD_IMAGE}, ${ROW_ICON_ID}, ${ROW_COMPUTED_WEIGHT}, ${ROW_FOOD_ITEMS},${ROW_SERVING_SIZES},${ROW_SERVING_UNITS},${ROW_SELECTED_UNIT},${ROW_SELECTED_QUANTITY}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
    db.transaction((tx) => {
      tx.executeSql(
        insertQuery,
        [
          foodLog.uuid,
          foodLog.name,
          undefined,
          foodLog.entityType,
          foodLog.barcode,
          foodLog.brandName,
          foodLog.userFoodImage,
          foodLog.iconID,
          JSON.stringify(foodLog.computedWeight),
          JSON.stringify(foodLog.foodItems),
          JSON.stringify(foodLog.servingSizes),
          JSON.stringify(foodLog.servingUnits),
          foodLog.selectedUnit,
          foodLog.selectedQuantity,
        ],
        () => {
          resolve(foodLog.uuid);
        },
        (_, error) => {
          console.error(`Failed to save food logs ${error}`);
          reject(error);
        }
      );
    });
  });
};

export const saveImage = async (
  db: SQLiteDatabase,
  image: Image
): Promise<CustomImageID> => {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT or REPLACE INTO  ${TABLE_IMAGES} (${ROW_UUID}, ${ROW_BASE_64}) VALUES (?,?)`;

    db.transaction((tx) => {
      tx.executeSql(
        insertQuery,
        [image.id, image.base64],
        () => {
          resolve(image.id);
        },
        (_, error) => {
          console.error(`Failed to save image ${error}`);
          reject(error);
        }
      );
    });
  });
};
export const getImage = async (
  id: CustomImageID
): Promise<Image | undefined> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await DBHandler.getInstance();
      const results = await db.executeSql(
        `SELECT * FROM ${TABLE_IMAGES} WHERE ${ROW_UUID} = ?`,
        [id]
      );
      resolve(convertResultToImage(results)?.[0]);
    } catch (error) {
      console.warn(
        `Failed to get image  ${JSON.stringify(error)} ========= ${id}`
      );
      reject(`Failed to get image ${error} ========= ${id}`);
      throw error;
    }
  });
};

// Delete Food logs into local storage
export const deleteFoodLog = async (
  db: SQLiteDatabase,
  uuId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE from ${TABLE_FOOD_LOGS} where ${ROW_UUID} = "${uuId}"`;
    db.transaction((tx) => {
      tx.executeSql(
        deleteQuery,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Delete Food logs into local storage
export const deleteCustomFood = async (
  db: SQLiteDatabase,
  uuId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE from ${TABLE_CUSTOM_FOOD_LOGS} where ${ROW_UUID} = "${uuId}"`;
    db.transaction((tx) => {
      tx.executeSql(
        deleteQuery,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Delete Food logs into local storage
export const deleteCustomRecipe = async (
  db: SQLiteDatabase,
  uuId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE from ${TABLE_CUSTOM_RECIPE_LOGS} where ${ROW_UUID} = "${uuId}"`;
    db.transaction((tx) => {
      tx.executeSql(
        deleteQuery,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Delete Favorite Food logs into local storage
export const deleteFavoriteFoodLog = async (
  db: SQLiteDatabase,
  uuId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE from ${TABLE_FAVOURITE_FOOD_LOGS} where ${ROW_UUID} = "${uuId}"`;
    db.transaction((tx) => {
      tx.executeSql(
        deleteQuery,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Save Favorite Food logs into local storage

export const saveFavouriteFood = async (
  db: SQLiteDatabase,
  foodLog: FavoriteFoodItem
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT or REPLACE INTO  ${TABLE_FAVOURITE_FOOD_LOGS} (${ROW_UUID}, ${ROW_NAME}, ${ROW_MEAL}, ${ROW_IMAGE_NAME}, ${ROW_ENTITY_TYPE}, ${ROW_EVENT_TIME_STAMP},${ROW_REF_CODE},${ROW_REF_CUSTOM_FOOD_ID},${ROW_LONG_NAME}, ${ROW_USER_FOOD_IMAGE}, ${ROW_ICON_ID}, ${ROW_FOOD_ITEMS},${ROW_SERVING_SIZES},${ROW_SERVING_UNITS},${ROW_PASSIOID},${ROW_SELECTED_UNIT},${ROW_SELECTED_QUANTITY}) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    db.transaction((tx) => {
      tx.executeSql(
        insertQuery,
        [
          foodLog.uuid,
          foodLog.name,
          foodLog.meal,
          foodLog.longName,
          foodLog.entityType,
          foodLog.eventTimestamp,
          foodLog.refCode,
          foodLog.refCustomFoodID,
          foodLog.longName,
          undefined,
          foodLog.iconID,
          JSON.stringify(foodLog.foodItems),
          JSON.stringify(foodLog.servingSizes),
          JSON.stringify(foodLog.servingUnits),
          undefined,
          foodLog.selectedUnit,
          foodLog.selectedQuantity,
        ],
        () => {
          resolve();
        },
        (_, error) => {
          console.error(`Failed to save food logs ${error}`);
          reject(error);
        }
      );
    });
  });
};

// Get Food Logs List from local storage
export const getFoodLogs = async (): Promise<FoodLog[]> => {
  try {
    const db = await DBHandler.getInstance();
    const results = await db.executeSql(`SELECT * FROM ${TABLE_FOOD_LOGS}`);
    return convertResultToFoodLog(results);
  } catch (error) {
    console.error(`Failed to get food logs ${error}`);
    throw error;
  }
};

// Get Food Logs List from local storage
export const getCustomFoods = async (): Promise<CustomFood[]> => {
  try {
    const db = await DBHandler.getInstance();
    const results = await db.executeSql(
      `SELECT * FROM ${TABLE_CUSTOM_FOOD_LOGS}`
    );
    return convertResultToFoodLog(results);
  } catch (error) {
    console.error(`Failed to get food logs ${error}`);
    throw error;
  }
};
// Get Food Logs List from local storage
export const getCustomRecipes = async (): Promise<CustomRecipe[]> => {
  try {
    const db = await DBHandler.getInstance();
    const results = await db.executeSql(
      `SELECT * FROM ${TABLE_CUSTOM_RECIPE_LOGS}`
    );
    return convertResultToFoodLog(results);
  } catch (error) {
    console.error(`Failed to get food logs ${error}`);
    throw error;
  }
};

// Get Favorite Food Logs from favorite_food_table
export const getFavoriteFoodItems = async (): Promise<FavoriteFoodItem[]> => {
  try {
    const db = await DBHandler.getInstance();
    const results = await db.executeSql(
      `SELECT * FROM ${TABLE_FAVOURITE_FOOD_LOGS}`
    );
    return convertResultToFoodLog(results);
  } catch (error) {
    console.error(`Failed to get favorite food logs ${error}`);
    throw error;
  }
};

export const getMealLogsByStartDateAndEndDate = async (
  startDate: Date,
  endDate: Date
): Promise<FoodLog[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await DBHandler.getInstance();
      const results = await db.executeSql(
        `SELECT * FROM ${TABLE_FOOD_LOGS} where ${ROW_EVENT_TIME_STAMP} >= "${startDate.toISOString()}"
      AND ${ROW_EVENT_TIME_STAMP} <= "${endDate.toISOString()}";`
      );
      resolve(convertResultToFoodLog(results));
    } catch (error) {
      console.error(
        `Failed to get food logs ${error} ========= ${startDate}-${endDate}`
      );
      reject(
        `Failed to get food logs ${error} ========= ${startDate}-${endDate}`
      );
      throw error;
    }
  });
};

export const getWaterByStartDateAndEndDate = async (
  startDate: Date,
  endDate: Date
): Promise<Water[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await DBHandler.getInstance();

      const results = await db.executeSql(
        `SELECT * FROM ${TABLE_WATER} where ${ROW_DAY} >= "${startDate.toISOString()}"
      AND ${ROW_DAY} <= "${endDate.toISOString()}";`
      );

      resolve(convertResultToWaters(results));
    } catch (error) {
      console.error(
        `Failed to get water logs ${error} ${startDate}-${endDate}`
      );
      reject(`Failed to get water logs ${error} ${startDate}-${endDate}`);
      throw error;
    }
  });
};

// Delete Favorite Food logs into local storage
export const deleteWaterLog = async (
  db: SQLiteDatabase,
  uuId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE from ${TABLE_WATER} where ${ROW_UUID} = "${uuId}"`;
    db.transaction((tx) => {
      tx.executeSql(
        deleteQuery,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Delete Favorite Food logs into local storage
export const deleteWeightLog = async (
  db: SQLiteDatabase,
  uuId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE from ${TABLE_WEIGHT} where ${ROW_UUID} = "${uuId}"`;

    db.transaction((tx) => {
      tx.executeSql(
        deleteQuery,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

export const getWeightByStartDateAndEndDate = async (
  startDate: Date,
  endDate: Date
): Promise<Weight[]> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await DBHandler.getInstance();

      const results = await db.executeSql(
        `SELECT * FROM ${TABLE_WEIGHT} 
         WHERE ${ROW_DAY} >= "${startDate.toISOString()}" 
         AND ${ROW_DAY} <= "${endDate.toISOString()}"
         ORDER BY ${ROW_DAY} DESC;`
      );

      resolve(convertResultToWeights(results));
    } catch (error) {
      console.error(
        `Failed to get weight logs ${error} ${startDate}-${endDate}`
      );
      reject(`Failed to get weight logs ${error} ${startDate}-${endDate}`);
      throw error;
    }
  });
};

export const getLatestWeightDB = async (): Promise<Weight | null> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await DBHandler.getInstance();
      const results = await db.executeSql(
        `SELECT * FROM ${TABLE_WEIGHT}
         ORDER BY ${ROW_DAY} DESC
         LIMIT 1;`
      );
      resolve(convertResultToWeights(results)?.[0] || null);
    } catch (error) {
      console.error(`Failed to get weight logs ${error}`);
      reject(`Failed to get weight logs ${error}`);
    }
  });
};

export function convertResultToFoodLog(results: [ResultSet]): FoodLog[] {
  const items: FoodLog[] = [];
  results.forEach((result) => {
    for (let index = 0; index < result.rows.length; index++) {
      items.push(result.rows.item(index));
    }
  });
  items.forEach((value) => {
    value.selectedQuantity = parseFloat(value.selectedQuantity.toString());
    value.foodItems = JSON.parse(value.foodItems.toString());
    value.servingUnits = JSON.parse(value.servingUnits.toString());
    value.servingSizes = JSON.parse(value.servingSizes.toString());
    value.computedWeight = JSON.parse(
      (value.computedWeight ?? '{}').toString()
    );
  });
  return items;
}
export function convertResultToImage(results: [ResultSet]): Image[] {
  const items: Image[] = [];
  results.forEach((result) => {
    for (let index = 0; index < result.rows.length; index++) {
      items.push(result.rows.item(index));
    }
  });
  return items;
}

export function convertResultToFavoriteFoodItem(
  results: [ResultSet]
): FavoriteFoodItem[] {
  const items: FavoriteFoodItem[] = [];
  results.forEach((result) => {
    for (let index = 0; index < result.rows.length; index++) {
      items.push(result.rows.item(index));
    }
  });
  items.forEach((value) => {
    value.selectedQuantity = parseFloat(value.selectedQuantity.toString());
    value.foodItems = JSON.parse(value.foodItems.toString());
    value.servingUnits = JSON.parse(value.servingUnits.toString());
    value.servingSizes = JSON.parse(value.servingSizes.toString());
  });
  return items;
}

export function convertResultToWaters(results: [ResultSet]): Water[] {
  const items: Water[] = [];
  results.forEach((result) => {
    for (let index = 0; index < result.rows.length; index++) {
      items.push(result.rows.item(index));
    }
  });
  items.forEach((value) => {
    value.uuid = value.uuid.toString();
    value.day = value.day.toString();
    value.time = value.time.toString();
    value.consumed = value.consumed.toString();
  });
  return items;
}

export function convertResultToWeights(results: [ResultSet]): Weight[] {
  const items: Weight[] = [];
  results.forEach((result) => {
    for (let index = 0; index < result.rows.length; index++) {
      items.push(result.rows.item(index));
    }
  });
  items.forEach((value) => {
    value.uuid = value.uuid.toString();
    value.day = value.day.toString();
    value.time = value.time.toString();
    value.weight = value.weight.toString();
  });
  return items;
}

// save recipe
export const saveRecipe = async (
  db: SQLiteDatabase,
  recipe: Recipe
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT or REPLACE INTO  ${TABLE_RECIPE} (${ROW_UUID}, ${ROW_NAME}, ${ROW_TOTAL_SERVINGS}, ${ROW_INGREDIENTS}) VALUES (?,?,?,?)`;
    db.transaction((tx) => {
      tx.executeSql(
        insertQuery,
        [
          recipe.uuid,
          recipe.name,
          recipe.totalServings,
          JSON.stringify(recipe.ingredients),
        ],
        () => {
          resolve();
        },
        (_, error) => {
          console.error(`Failed to save recipe ${error}`);
          reject(error);
        }
      );
    });
  });
};

// Delete Recipe logs into local storage
export const deleteRecipe = async (
  db: SQLiteDatabase,
  uuId: string
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const deleteQuery = `DELETE from ${TABLE_RECIPE} where ${ROW_UUID} = "${uuId}"`;
    db.transaction((tx) => {
      tx.executeSql(
        deleteQuery,
        [],
        () => {
          resolve();
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  });
};

// Get recipes
export const getRecipes = async (): Promise<Recipe[]> => {
  try {
    const db = await DBHandler.getInstance();
    const results = await db.executeSql(`SELECT * FROM ${TABLE_RECIPE}`);
    return convertResultToRecipe(results);
  } catch (error) {
    console.error(`Failed to get food logs ${error}`);
    throw error;
  }
};

export function convertResultToRecipe(results: [ResultSet]): Recipe[] {
  const items: Recipe[] = [];
  results.forEach((result) => {
    for (let index = 0; index < result.rows.length; index++) {
      items.push(result.rows.item(index));
    }
  });
  items.forEach((value) => {
    value.ingredients = JSON.parse(value.ingredients.toString());
  });
  return items;
}

// Save Water into local storage
export const saveWater = async (
  db: SQLiteDatabase,
  water: Water
): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('saved', water);

    const insertQuery = `INSERT or REPLACE INTO  ${TABLE_WATER} (${ROW_UUID}, ${ROW_CONSUMED}, ${ROW_DAY}, ${ROW_TIME}) VALUES (?,?,?,?)`;
    db.transaction((tx) => {
      tx.executeSql(
        insertQuery,
        [
          water.uuid,
          water.consumed.toString(),
          water.day.toString(),
          water.time.toString(),
        ],
        () => {
          resolve();
        },
        (transaction, error) => {
          console.error(`Failed to save water logs ${error}`, transaction);
          reject(error);
        }
      );
    });
  });
};

export const saveWeight = async (
  db: SQLiteDatabase,
  weight: Weight
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT or REPLACE INTO  ${TABLE_WEIGHT} (${ROW_UUID}, ${ROW_WEIGHT}, ${ROW_DAY}, ${ROW_TIME}) VALUES (?,?,?,?)`;
    db.transaction((tx) => {
      tx.executeSql(
        insertQuery,
        [weight.uuid, weight.weight, weight.day, weight.time],
        () => {
          resolve();
        },
        (_, error) => {
          console.error(`Failed to save weight logs ${error}`);
          reject(error);
        }
      );
    });
  });
};

// Get Food Logs List from local storage
export const getWaters = async (): Promise<Water[]> => {
  try {
    const db = await DBHandler.getInstance();
    const results = await db.executeSql(`SELECT * FROM ${TABLE_WATER}`);
    return convertResultToWaters(results);
  } catch (error) {
    console.error(`Failed to get waters logs ${error}`);
    throw error;
  }
};
export const getCustomFood = async (
  uuid: string
): Promise<CustomFood | null | undefined> => {
  try {
    const db = await DBHandler.getInstance();
    const results = await db.executeSql(
      `SELECT * FROM ${TABLE_CUSTOM_FOOD_LOGS} WHERE ${ROW_UUID} = ?`,
      [uuid]
    );

    return convertResultToFoodLog(results)?.[0] ?? null;
  } catch (error) {
    const errorMessage = `Failed to get custom food logs: ${error} - UUID: ${uuid}`;
    console.error(errorMessage);
    return null;
  }
};

export const getCustomRecipe = async (
  uuid: string
): Promise<CustomRecipe | null | undefined> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await DBHandler.getInstance();
      const results = await db.executeSql(
        `SELECT * FROM ${TABLE_CUSTOM_RECIPE_LOGS} WHERE ${ROW_UUID} = ?`,
        [uuid]
      );

      resolve(convertResultToFoodLog(results)?.[0]);
    } catch (error) {
      console.error(
        `Failed to get custom food logs ${error} ========= ${uuid}-${uuid}`
      );
      reject(
        `Failed to get custom food logs ${error} ========= ${uuid}-${uuid}`
      );
      throw error;
    }
  });
};
