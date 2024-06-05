import type { SQLiteDatabase } from 'react-native-sqlite-storage';
import { openDatabase } from 'react-native-sqlite-storage';
import { createTable } from './DBService';

const db_nutrition = 'nutrition.db';

export const getDBConnection = async () => {
  return openDatabase(
    // @ts-ignore (due to avoid prefer local storage operation location)
    { name: db_nutrition, location: 'default' }
  );
};

export var DBHandler = (function () {
  let instance: SQLiteDatabase;

  async function createInstance(): Promise<SQLiteDatabase> {
    const db = await getDBConnection();
    await createTable(db);
    return db;
  }

  return {
    getInstance: async function (): Promise<SQLiteDatabase> {
      if (!instance) {
        instance = await createInstance();
      }
      return instance;
    },
  };
})();
