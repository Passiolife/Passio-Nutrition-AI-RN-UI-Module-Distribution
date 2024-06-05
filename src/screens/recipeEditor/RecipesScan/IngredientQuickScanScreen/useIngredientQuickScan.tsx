import {
  type FoodDetectionConfig,
  type FoodDetectionEvent,
  type PassioIDAttributes,
  PassioSDK,
} from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { useEffect, useRef, useState } from 'react';

import type { FoodItem } from '../../../../models';
import { convertPassioIDAttributesToFoodItem } from '../../../../utils';

export function useIngredientQuickScan() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [foodItem, setFoodItem] = useState<FoodItem | null>(null);
  const [isContinueScanning, setContinueScanning] = useState(true);
  const [passioIdAttributes, setPassioIDAttributes] =
    useState<PassioIDAttributes | null>(null);

  const [passioResult, setPassioResult] = useState<PassioIDAttributes | null>(
    null
  );
  const passioIDAttributesRef = useRef<PassioIDAttributes | null>(null);

  // Detect object from using startFoodDetection
  useEffect(() => {
    const config: FoodDetectionConfig = {
      detectBarcodes: true,
      detectPackagedFood: true,
    };

    const subscription = PassioSDK.startFoodDetection(
      config,
      async (detection: FoodDetectionEvent) => {
        const { candidates } = detection;
        if (
          candidates !== undefined &&
          ((candidates.detectedCandidates &&
            candidates.detectedCandidates.length > 0) ||
            (candidates.packagedFoodCode &&
              candidates.packagedFoodCode.length > 0) ||
            (candidates.barcodeCandidates &&
              candidates.barcodeCandidates.length > 0))
        ) {
          let attribute: PassioIDAttributes | null = null;
          if (candidates.barcodeCandidates?.[0] !== undefined) {
            const barcode = candidates.barcodeCandidates?.[0];
            attribute = await PassioSDK.fetchAttributesForBarcode(
              barcode.barcode
            );
          } else if (candidates.packagedFoodCode?.[0] !== undefined) {
            const packagedFoodCode = candidates.packagedFoodCode[0];
            attribute =
              await PassioSDK.fetchPassioIDAttributesForPackagedFood(
                packagedFoodCode
              );
          } else if (candidates.detectedCandidates?.[0] !== undefined) {
            const passioID = candidates.detectedCandidates[0].passioID;

            if (passioID === passioIDAttributesRef.current?.passioID) {
              return;
            }

            attribute = await PassioSDK.getAttributesForPassioID(passioID);
          }
          if (
            attribute &&
            attribute?.passioID !== passioIDAttributesRef.current?.passioID
          ) {
            setPassioIDAttributes(null);
            setPassioResult(attribute);
            passioIDAttributesRef.current = attribute;
          }
        }
      }
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (!isContinueScanning || isEditModalOpen) {
      return;
    }

    if (passioResult) {
      setPassioIDAttributes(passioResult);
    }
  }, [isContinueScanning, isEditModalOpen, passioResult]);

  //  it's call when user tap on closed icon.
  const onClosed = () => {
    resetScanning();
  };

  const resetScanning = () => {
    setPassioIDAttributes(null);
    setPassioResult(null);
    setContinueScanning(true);
  };

  //  it's call when user tap to alternate item cell.
  const onAlternateItemCall = async (
    passioIDAttributes: PassioIDAttributes
  ) => {
    setPassioIDAttributes(passioIDAttributes);
    setContinueScanning(false);
  };

  // Convert PassioIDAttributes to foodLog
  const onOpenFoodLogEditor = async (attr: PassioIDAttributes) => {
    setFoodItem(convertPassioIDAttributesToFoodItem(attr));
    setIsEditModalOpen(true);
  };

  const startContinueScanning = () => {
    setContinueScanning(true);
  };

  const editModalDismiss = () => {
    setIsEditModalOpen(false);
    setFoodItem(null);
  };

  return {
    onAlternateItemCall,
    onOpenFoodLogEditor,
    passioIdAttributes,
    isEditModalOpen,
    onClosed,
    foodItem,
    startContinueScanning,
    editModalDismiss,
    resetScanning,
  };
}
