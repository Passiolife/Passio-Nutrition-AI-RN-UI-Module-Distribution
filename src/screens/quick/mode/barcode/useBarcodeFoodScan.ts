import { useCallback, useEffect, useRef, useState } from 'react';

import {
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
} from '../../../../utils';
import {
  PassioSDK,
  type BarcodeCandidate,
  type FoodDetectionConfig,
  type FoodDetectionEvent,
  type PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import {
  getBarcodeResult,
  getDetectionCandidate,
  getPassioIDAttribute,
} from '../../../../utils/QuickResultUtils';
import { convertPassioFoodItemToFoodLog } from '../../../../utils/V3Utils';
import type { ScanningScreenNavigationProps } from '../../QuickScanningScreen';

export const useBarcodeFoodScan = () => {
  const services = useServices();
  const navigation = useNavigation<ScanningScreenNavigationProps>();
  const passioQuickResultRef = useRef<QuickResult | null>(null);

  const { params } = useRoute<RouteProp<ParamList, 'ScanningScreen'>>();
  const date = getLogToDate(params.logToDate, params.logToMeal);
  const meal = getMealLog(date, params.logToMeal);

  const [isStopScan, setStopScan] = useState<boolean>(false);
  const [isLodgedFood, setLoggedFood] = useState<boolean>(false);
  const [passioQuickResults, setPassioQuickResults] =
    useState<QuickResult | null>(null);

  const [alternatives, setPassioAlternatives] = useState<QuickResult[] | null>(
    []
  );

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
        return await getBarcodeResult(barcodeCandidate);
      }

      return null;
    },
    [passioQuickResultRef]
  );

  const resetScanning = useCallback(() => {
    passioQuickResultRef.current = null;
    setFoodDetectionEvent(null);
    setPassioQuickResults(null);
    setStopScan(false);
  }, []);

  const onSavedLog = useCallback(
    async (item: FoodLog) => {
      await services.dataService.saveFoodLog(item);
      await recordAnalyticsFoodLogs({
        id: item.refCode ?? '',
        screen: ScreenType.quickScan,
        foodLog: item,
      });
      setStopScan(true);
      setLoggedFood(true);
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
    async (attribute: PassioFoodItem) => {
      if (attribute) {
        setStopScan(true);
        navigation.navigate('EditFoodLogScreen', {
          foodLog: convertPassioFoodItemToFoodLog(attribute, date, meal),
          prevRouteName: 'QuickScan',
          onCancelPress: () => {
            setStopScan(false);
          },
          onSaveLogPress: () => {
            setStopScan(false);
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
        setStopScan(true);
        navigation.navigate('EditFoodLogScreen', {
          foodLog: convertPassioFoodItemToFoodLog(item, date, meal),
          prevRouteName: 'QuickScan',
          onCancelPress: () => {
            setStopScan(false);
          },
          onSaveLogPress: () => {
            setStopScan(false);
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
      onSaveData: (attribute: PassioFoodItem) => {
        onEditFoodLogPress(attribute);
      },
    });
  }, [onEditFoodLogPress, navigation]);

  const onContinueScanningPress = () => {
    setLoggedFood(false);
    setStopScan(false);
    setFoodDetectionEvent(null);
    setPassioQuickResults(null);
    passioQuickResultRef.current = null;
  };
  const onViewDiaryPress = () => {
    navigation.pop(1);
    navigation.navigate('BottomNavigation', {
      screen: 'MealLogScreen',
    });
  };

  useEffect(() => {
    const config: FoodDetectionConfig = {
      detectBarcodes: true,
      detectPackagedFood: false,
      detectVisual: false,
      volumeDetectionMode: 'none',
    };
    let subscription = PassioSDK.startFoodDetection(
      config,
      (detection: FoodDetectionEvent) => {
        if (
          detection &&
          detection?.candidates?.barcodeCandidates &&
          detection.candidates?.barcodeCandidates?.length > 0
        ) {
          const barcode = detection.candidates.barcodeCandidates?.[0]?.barcode;

          if (
            barcode !== undefined &&
            barcode === passioQuickResultRef.current?.barcode
          ) {
            return;
          }

          setFoodDetectionEvent(detection);
        }
      }
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    const detection = foodDetectEvents;
    async function init() {
      if (detection) {
        const { candidates } = detection;

        if (candidates) {
          const detectedCandidate = candidates.detectedCandidates?.[0];
          let attribute: QuickResult | null = await getQuickResults(
            candidates.barcodeCandidates?.[0]
          );

          /** Now Check attribute and alternative */

          if (
            attribute &&
            attribute?.passioID !== passioQuickResultRef.current?.passioID
          ) {
            setPassioQuickResults(attribute);
            passioQuickResultRef.current = attribute;

            /** Alternative */
            const alternative =
              detectedCandidate?.alternatives &&
              detectedCandidate.alternatives.length > 0
                ? detectedCandidate.alternatives
                : candidates.detectedCandidates;

            const candidateAlternatives = alternative
              .map(getDetectionCandidate)
              .filter(
                (item) => item?.passioID !== attribute?.passioID
              ) as QuickResult[];
            setPassioAlternatives(candidateAlternatives);
          }
        }
      }
    }

    if (isStopScan === true) {
      return;
    }

    if (detection) {
      init();
    }
  }, [foodDetectEvents, getQuickResults, isStopScan]);

  return {
    alternatives,
    isLodgedFood,
    isStopScan,
    passioQuickResults,
    onContinueScanningPress,
    onFoodSearchManuallyPress,
    onLogFoodPress,
    onOpenFoodLogEditor,
    onViewDiaryPress,
    resetScanning,
    setStopScan,
  };
};
