import {
  enablePromise,
  type SQLError,
  type SQLiteDatabase,
  type Transaction,
} from 'react-native-sqlite-storage';
import {
  ROW_CONSUMED,
  ROW_DAY,
  ROW_ENTITY_TYPE,
  ROW_EVENT_TIME_STAMP,
  ROW_FOOD_ITEMS,
  ROW_IMAGE_NAME,
  ROW_INGREDIENTS,
  ROW_MEAL,
  ROW_NAME,
  ROW_PASSIOID,
  ROW_SELECTED_QUANTITY,
  ROW_SELECTED_UNIT,
  ROW_SERVING_SIZES,
  ROW_SERVING_UNITS,
  ROW_TIME,
  ROW_TOTAL_SERVINGS,
  ROW_UUID,
  ROW_WEIGHT,
  TABLE_FAVOURITE_FOOD_LOGS,
  TABLE_FOOD_LOGS,
  TABLE_RECIPE,
  TABLE_WATER,
  TABLE_WEIGHT,
} from './DBConstant';

const table_food_log = TABLE_FOOD_LOGS;
const table_favourite_food_log = TABLE_FAVOURITE_FOOD_LOGS;
const table_recipe = TABLE_RECIPE;

enablePromise(true);

export const createTable = async (db: SQLiteDatabase): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.transaction(
      function (txn) {
        txn.executeSql(
          `CREATE TABLE IF NOT EXISTS ${table_food_log} (${ROW_UUID} TEXT PRIMARY KEY, ${ROW_NAME} TEXT, ${ROW_MEAL} TEXT, ${ROW_FOOD_ITEMS} TEXT, ${ROW_SERVING_SIZES} TEXT, ${ROW_SERVING_UNITS} TEXT, ${ROW_ENTITY_TYPE} TEXT, ${ROW_IMAGE_NAME} TEXT, ${ROW_PASSIOID} TEXT, ${ROW_SELECTED_UNIT} TEXT, ${ROW_SELECTED_QUANTITY} TEXT, ${ROW_EVENT_TIME_STAMP} TEXT
      )`,
          []
        );

        txn.executeSql(
          `CREATE TABLE IF NOT EXISTS ${table_favourite_food_log} (${ROW_UUID} TEXT PRIMARY KEY, ${ROW_NAME} TEXT, ${ROW_MEAL} TEXT, ${ROW_FOOD_ITEMS} TEXT, ${ROW_SERVING_SIZES} TEXT, ${ROW_SERVING_UNITS} TEXT, ${ROW_ENTITY_TYPE} TEXT, ${ROW_IMAGE_NAME} TEXT, ${ROW_PASSIOID} TEXT, ${ROW_SELECTED_UNIT} TEXT, ${ROW_SELECTED_QUANTITY} TEXT
      )`,
          []
        );

        txn.executeSql(
          `CREATE TABLE IF NOT EXISTS ${table_recipe} (${ROW_UUID} TEXT PRIMARY KEY, ${ROW_NAME} TEXT, ${ROW_TOTAL_SERVINGS} TEXT, ${ROW_INGREDIENTS} TEXT)`,
          []
        );

        txn.executeSql(
          `CREATE TABLE IF NOT EXISTS ${TABLE_WATER} (${ROW_UUID} TEXT PRIMARY KEY, ${ROW_CONSUMED} TEXT, ${ROW_DAY} TEXT, ${ROW_TIME} TEXT)`,
          []
        );

        txn.executeSql(
          `CREATE TABLE IF NOT EXISTS ${TABLE_WEIGHT} (${ROW_UUID} TEXT PRIMARY KEY, ${ROW_WEIGHT} TEXT, ${ROW_DAY} TEXT, ${ROW_TIME} TEXT)`,
          []
        );
      },
      (error: SQLError) => {
        reject(error);
      },
      (_: Transaction) => {
        resolve();
      }
    );
  });
};
