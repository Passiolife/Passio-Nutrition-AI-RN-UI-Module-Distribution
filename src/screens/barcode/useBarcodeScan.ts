import { useCallback, useEffect, useRef, useState } from 'react';
import {
  BarcodeCandidate,
  FoodDetectionConfig,
  FoodDetectionEvent,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { getBarcodeResult } from '../../utils';
import type {
  BarcodeCustomResult,
  CustomFood,
  QuickResult,
} from '../../models';
import { useServices } from '../../contexts';
import type { ParamList } from '../../navigaitons';
import { RouteProp, useRoute } from '@react-navigation/native';
import { BackHandler, NativeEventSubscription } from 'react-native';
import { createPassioFoodItemFromCustomFood } from '../../utils/V3Utils';

export const useBarcodeScan = () => {
  const barcodeRef = useRef<string | undefined>(undefined);
  const services = useServices();
  const { params } = useRoute<RouteProp<ParamList, 'BarcodeScanScreen'>>();

  const [foodDetectEvents, setFoodDetectionEvent] =
    useState<FoodDetectionEvent | null>(null);

  const [quickResult, setPassioQuickResults] =
    useState<BarcodeCustomResult | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [customFoods, setCustomFood] = useState<CustomFood[]>();

  const type = params.type ?? 'customFood';

  const getQuickResults = useCallback(
    async (barcodeCandidate?: BarcodeCandidate) => {
      if (barcodeCandidate && barcodeRef.current === barcodeCandidate.barcode) {
        return null;
      }

      if (barcodeCandidate) {
        return await getBarcodeResult(services.dataService, barcodeCandidate);
      }

      return null;
    },
    [services.dataService]
  );

  const actionTaken = useRef(false);

  useEffect(() => {
    const detection = foodDetectEvents;
    async function init() {
      if (detection) {
        const { candidates } = detection;

        if (candidates) {
          const barcodeCandidate = candidates.barcodeCandidates?.[0];
          if (barcodeCandidate === undefined) {
            return;
          }

          if (barcodeCandidate.barcode === barcodeRef.current) {
            return;
          }

          if (type === 'general') {
            params?.onBarcodeOnly?.(barcodeCandidate.barcode);
            return;
          }

          const existingCustomFood = customFoods?.find(
            (i) => i.barcode === barcodeCandidate.barcode
          );

          let attribute: QuickResult | null =
            await getQuickResults(barcodeCandidate);

          if (attribute?.passioIDAttributes === null) {
            const result: BarcodeCustomResult = {
              name: barcodeCandidate.barcode,
              type: 'Barcode',
              customFood: existingCustomFood,
              barcode: barcodeCandidate.barcode,
              passioIDAttributes: null,
            };
            if (existingCustomFood) {
              setPassioQuickResults(result);
            } else {
              if (actionTaken.current) {
              } else {
                params?.onBarcodePress?.(result);
                actionTaken.current = true;
              }
            }
          } else {
            const result: BarcodeCustomResult = {
              ...attribute,
              name: barcodeCandidate.barcode,
              type: 'Barcode',
              customFood: existingCustomFood,
              barcode: barcodeCandidate.barcode,
            };
            setPassioQuickResults(result);
          }

          setLoading(false);
          barcodeRef.current = barcodeCandidate.barcode;
        }
      }
    }

    if (detection) {
      init();
    }
  }, [customFoods, foodDetectEvents, getQuickResults, params, type]);

  useEffect(() => {
    const config: FoodDetectionConfig = {
      detectBarcodes: true,
      detectPackagedFood: false,
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

          if (barcode !== undefined && barcode === barcodeRef.current) {
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
    function init() {
      services.dataService.getCustomFoodLogs().then((data) => {
        setCustomFood(data);
      });
    }
    init();
  }, [services.dataService]);
  const resetScanning = () => {
    setLoading(true);
    barcodeRef.current = undefined;
    setFoodDetectionEvent(null);
    setPassioQuickResults(null);
  };

  const onCreateCustomWithoutBarcodePress = () => {
    if (quickResult) {
      let passioFoodItem = quickResult.passioIDAttributes;

      if (!passioFoodItem && quickResult.customFood) {
        passioFoodItem = createPassioFoodItemFromCustomFood(
          quickResult.customFood
        );
      }

      params?.onCreateFoodAnyWay?.({
        ...quickResult,
        barcode: undefined,
        customFood: undefined,
        passioIDAttributes: passioFoodItem
          ? {
              ...passioFoodItem,
              ingredients: passioFoodItem?.ingredients?.map((o) => {
                return {
                  ...o,
                  metadata: {
                    ...o.metadata,
                    barcode: undefined,
                  },
                };
              }),
            }
          : undefined,
      });
    }
  };
  const onViewExistingPress = () => {
    if (quickResult) {
      params?.onViewExistingItem?.(quickResult);
    }
  };

  const onBarcodePress = () => {
    if (quickResult) {
      params?.onBarcodePress?.(quickResult);
    }
  };

  useEffect(() => {
    let backHandler: NativeEventSubscription | undefined;
    const backAction = () => {
      params?.onClose?.();
      return false;
    };
    backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => {
      if (backHandler) {
        backHandler.remove();
      }
      params?.onClose?.();
    }; // Cleanup the listener
  }, [params]);

  return {
    quickResult,
    isLoading,
    resetScanning,
    onCreateCustomWithoutBarcodePress,
    onViewExistingPress,
    params,
    onBarcodePress,
    type: params.type ?? 'customFood',
  };
};
