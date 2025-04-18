import { useCallback, useEffect, useRef, useState } from 'react';

import {
  useIsFocused,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/core';
import { useServices } from '../../../../contexts';
import type { FoodLog, QuickResult } from '../../../../models';
import { ScreenType } from '../../../../models/ScreenType';
import type { ParamList } from '../../../../navigaitons';
import {
  recordAnalyticsFoodLogs,
  getLogToDate,
  getMealLog,
  createFoodLogUsingFoodDataInfo,
} from '../../../../utils';
import {
  PassioSDK,
  type BarcodeCandidate,
  type FoodDetectionConfig,
  type FoodDetectionEvent,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import {
  getBarcodeResult,
  getPassioIDAttribute,
} from '../../../../utils/QuickResultUtils';
import { convertPassioFoodItemToFoodLog } from '../../../../utils/V3Utils';
import type { ScanningScreenNavigationProps } from '../../QuickScanningScreen';
import { convertDateToDBFormat } from '../../../../utils/DateFormatter';
import type { ItemAddedToDairyViewModalRef } from '../../../../components';
import { getCustomFoodUUID } from '../../../../screens/foodCreator/FoodCreator.utils';
import { Platform } from 'react-native';

export const useBarcodeFoodScan = () => {
  const services = useServices();
  const navigation = useNavigation<ScanningScreenNavigationProps>();
  const passioQuickResultRef = useRef<QuickResult | null>(null);
  const barcodeRef = useRef<string | undefined>(undefined);
  const isSubmitting = useRef<boolean>(false);
  const isFocused = useIsFocused();

  const { params } = useRoute<RouteProp<ParamList, 'ScanningScreen'>>();
  const date = getLogToDate(params.logToDate, params.logToMeal);
  const meal = getMealLog(date, params.logToMeal);

  const itemAddedToDairyViewModalRef =
    useRef<ItemAddedToDairyViewModalRef>(null);
  const [isLodgedFood, setLoggedFood] = useState<boolean>(false);
  const [passioQuickResults, setPassioQuickResults] =
    useState<QuickResult | null>(null);

  const [foodDetectEvents, setFoodDetectionEvent] =
    useState<FoodDetectionEvent | null>(null);

  const getQuickResults = useCallback(
    async (barcodeCandidate?: BarcodeCandidate) => {
      if (
        barcodeCandidate &&
        passioQuickResultRef.current?.barcode === barcodeCandidate.barcode
      ) {
        return null;
      }

      if (barcodeCandidate) {
        return await getBarcodeResult(services.dataService, barcodeCandidate);
      }

      return null;
    },
    [services.dataService]
  );

  const resetScanning = useCallback(() => {
    passioQuickResultRef.current = null;
    setFoodDetectionEvent(null);
    setPassioQuickResults(null);
  }, []);

  const onSavedLog = useCallback(
    async (item: FoodLog) => {
      if (isSubmitting.current) {
        return;
      }
      isSubmitting.current = true;

      await services.dataService.saveFoodLog(item);
      await recordAnalyticsFoodLogs({
        id: item.refCode ?? '',
        screen: ScreenType.quickScan,
        foodLog: item,
      });
      setLoggedFood(true);
      isSubmitting.current = false;
      itemAddedToDairyViewModalRef?.current?.open();
    },
    [services.dataService]
  );

  //  it's call when user swipe the scanning result card.
  const onLogFoodPress = useCallback(
    async (result: QuickResult) => {
      const item = await getPassioIDAttribute(result);
      if (item) {
        const createdFoodLog = convertPassioFoodItemToFoodLog(item, date, meal);
        await onSavedLog(createdFoodLog);
      }
    },
    [date, meal, onSavedLog]
  );

  const onEditFoodLogPress = useCallback(
    async (foodLog?: FoodLog) => {
      if (foodLog) {
        foodLog.meal = meal;
        foodLog.eventTimestamp = convertDateToDBFormat(date);

        navigation.navigate('EditFoodLogScreen', {
          foodLog: foodLog,
          prevRouteName: 'QuickScan',
          onCancelPress: () => {},
          onSaveLogPress: () => {
            setLoggedFood(true);
          },
        });
      }
    },
    [date, meal, navigation]
  );

  // Convert PassioIDAttributes to foodLog
  const onOpenFoodLogEditor = useCallback(
    async (result: QuickResult) => {
      const item = await getPassioIDAttribute(result);

      if (item) {
        const foodLog = convertPassioFoodItemToFoodLog(item, date, meal);
        navigation.navigate('EditFoodLogScreen', {
          prevRouteName: 'QuickScan',
          foodLog: foodLog,
          onCancelPress: () => {},
          onSaveLogPress: () => {
            setLoggedFood(true);
          },
        });
      }
    },
    [date, meal, navigation]
  );

  const onFoodSearchManuallyPress = useCallback(async () => {
    navigation.navigate('FoodSearchScreen', {
      from: 'Other',
      onSaveData: (logItem: FoodLog) => {
        onEditFoodLogPress(logItem);
      },
    });
  }, [onEditFoodLogPress, navigation]);

  const onContinueScanningPress = () => {
    setLoggedFood(false);
    setFoodDetectionEvent(null);
    setPassioQuickResults(null);
    passioQuickResultRef.current = null;
    barcodeRef.current = undefined;
    itemAddedToDairyViewModalRef?.current?.close();
  };
  const onViewDiaryPress = () => {
    navigation.pop(1);
    navigation.navigate('BottomNavigation', {
      screen: 'MealLogScreen',
    });
  };

  const onTakePhoto = () => {
    const barcode = barcodeRef?.current;
    if (Platform.OS === 'android') {
      PassioSDK.stopCamera();
    }
    resetScanning();
    navigation.navigate('NutritionFactScanScreen', {
      barcode: barcode,
      onSaveLog: async (item) => {
        const foodRecords = await createFoodLogUsingFoodDataInfo(
          [item],
          services,
          undefined,
          undefined
        );
        let foodRecord = foodRecords?.[0];
        const customFood = item.customFood;
        if (foodRecord) {
          const customFoodUUID: string =
            customFood?.uuid || getCustomFoodUUID();
          foodRecord.refCode = customFoodUUID;
          foodRecord.refCustomFoodID = customFoodUUID;
          services.dataService.saveCustomFood({
            ...foodRecord,
            uuid: customFoodUUID,
            barcode: foodRecord?.foodItems?.[0]?.barcode,
          });
          onSavedLog(foodRecord);
        }
      },
    });
  };

  useEffect(() => {
    const detection = foodDetectEvents;
    async function init() {
      if (detection) {
        const { candidates } = detection;

        if (candidates) {
          let attribute: QuickResult | null = await getQuickResults(
            candidates.barcodeCandidates?.[0]
          );
          /** Now Check attribute and alternative */

          if (attribute) {
            setPassioQuickResults(attribute);
            passioQuickResultRef.current = attribute;
          }
        }

        barcodeRef.current =
          detection.candidates?.barcodeCandidates?.[0]?.barcode;
      }
    }

    if (detection) {
      init();
    }
  }, [foodDetectEvents, getQuickResults]);

  useEffect(() => {
    const config: FoodDetectionConfig = {
      detectBarcodes: true,
      detectPackagedFood: false,
      detectVisual: false,
    };

    async function delay() {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    const subscription = listener();

    function listener() {
      if (!isFocused) {
        return null;
      }
      delay();
      return PassioSDK.startFoodDetection(
        config,
        (detection: FoodDetectionEvent) => {
          if (
            detection &&
            detection?.candidates?.barcodeCandidates &&
            detection.candidates?.barcodeCandidates?.length > 0
          ) {
            const barcode =
              detection.candidates.barcodeCandidates?.[0]?.barcode;

            if (barcode !== undefined && barcode === barcodeRef?.current) {
              return;
            }
            setFoodDetectionEvent(detection);
          }
        }
      );
    }

    return () => {
      subscription?.remove();
    };
  }, [isFocused]);

  return {
    isLodgedFood,
    itemAddedToDairyViewModalRef,
    passioQuickResults,
    onContinueScanningPress,
    onFoodSearchManuallyPress,
    onLogFoodPress,
    onOpenFoodLogEditor,
    onViewDiaryPress,
    resetScanning,
    onTakePhoto,
  };
};
