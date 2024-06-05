import {
  PassioSDK,
  type BarcodeCandidate,
  type DetectedCandidate,
  type PackagedFoodCode,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import type { QuickResult } from '../models';

export const getBarcodeResult = async (barcodeCandidate?: BarcodeCandidate) => {
  if (barcodeCandidate) {
    const result = await PassioSDK.fetchFoodItemForProductCode(
      barcodeCandidate.barcode
    );
    if (result) {
      const attribute: QuickResult = {
        passioID: result.refCode ?? '',
        name: result.name,
        passioIDAttributes: result,
        type: 'Barcode',
        barcode: barcodeCandidate.barcode,
      };
      return attribute;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const getPackageFoodResult = async (
  packagedFoodCode?: PackagedFoodCode
) => {
  if (packagedFoodCode) {
    const result =
      await PassioSDK.fetchFoodItemForProductCode(packagedFoodCode);
    if (result) {
      const attribute: QuickResult = {
        passioID: result.refCode ?? '',
        name: result.name,
        type: 'PackageFood',
        passioIDAttributes: result,
        packageFood: packagedFoodCode,
      };
      return attribute;
    } else {
      return null;
    }
  } else {
    return null;
  }
};

export const getDetectionCandidate = (
  detectedCandidate?: DetectedCandidate
) => {
  if (detectedCandidate) {
    const attribute: QuickResult = {
      passioID: detectedCandidate.passioID,
      name: detectedCandidate.foodName ?? '',
      type: 'Candidate',
    };
    return attribute;
  } else {
    return null;
  }
};

export const getPassioIDAttribute = async (result: QuickResult) => {
  if (result.passioIDAttributes) {
    return result.passioIDAttributes;
  } else {
    if (result.passioID) {
      const attribute = await PassioSDK.fetchFoodItemForPassioID(
        result.passioID
      );
      return attribute;
    } else {
      return null;
    }
  }
};
