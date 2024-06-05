import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ActionPlanType } from '../models';
import type { AnalyticsFoodLogs } from '../models/PassioAnalytics';

const storeData = async (key: string, value: any) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(AsyncStorage.setItem(key, value));
    } catch (e) {
      reject(e);
    }
  });
};

export class AsyncStorageHelper {
  static async checkOnBoardingCompleted() {
    try {
      const value = await AsyncStorage.getItem('hasCompletedOnboarding');
      return value !== null;
    } catch (e) {
      return false;
    }
  }

  static setOnBoardingCompleted() {
    return storeData('hasCompletedOnboarding', '1');
  }

  static setAnalyticsFoodLogs(analyticsFoodLogs: AnalyticsFoodLogs[]) {
    return storeData('analyticsFoodLogs', JSON.stringify(analyticsFoodLogs));
  }

  static async getAnalyticsFoodLogs() {
    const value = await AsyncStorage.getItem('analyticsFoodLogs');
    return value ? (JSON.parse(value) as AnalyticsFoodLogs[]) : [];
  }

  static setLoggedInDate() {
    return storeData('loggedInDate', new Date().toISOString());
  }

  static async getLoggedInDate() {
    try {
      const value = await AsyncStorage.getItem('loggedInDate');
      return value !== null ? new Date(value) : null;
    } catch (e) {
      return null;
    }
  }

  static setActionPlan(actionPlan: ActionPlanType | null) {
    return storeData('actionPlan', actionPlan);
  }

  static async getActionPlan(): Promise<ActionPlanType | null> {
    try {
      const value = await AsyncStorage.getItem('actionPlan');
      return value as ActionPlanType | null;
    } catch (e) {
      return null;
    }
  }
}
