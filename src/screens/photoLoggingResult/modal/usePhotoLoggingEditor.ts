import { useRef, useState } from 'react';
import { useBranding } from '../../../contexts';
import type { PhotoLoggingResults } from '../usePhotoLogging';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../../navigaitons';
import type { EditNutritionFactRef } from './nutritionFact/EditNutritionFactModal';
import { BarcodeCustomResult } from 'src/models';
import { createFoodLogByCustomFood } from '../../../screens/foodCreator/FoodCreator.utils';
import { convertPassioFoodItemToFoodLog } from '../../../utils/V3Utils';

export type PhotoLoggingEditType =
  | 'nutrient'
  | 'serving'
  | 'edit-serving-to-nutrient';

export type NavigationProps = StackNavigationProp<
  ParamList,
  'PhotoLoggingScreen'
>;

export const usePhotoLoggingEditor = () => {
  const navigation = useNavigation<NavigationProps>();
  const [result, setResult] = useState<PhotoLoggingResults | undefined>(
    undefined
  );
  const [isOpen, setOpen] = useState(false);
  const editNutritionFactRef = useRef<EditNutritionFactRef>(null);
  const branding = useBranding();
  const [editType, setEditType] = useState<PhotoLoggingEditType>('serving');

  const openEditServingPopup = (item: PhotoLoggingResults) => {
    setOpen(true);
    setResult(item);
  };

  const handleNutritionFactCloseClick = () => {
    if (editType === 'edit-serving-to-nutrient') {
      setEditType('serving');
    } else {
      releaseEditor();
    }
  };

  const applyBarcode = (barcode?: string) => {
    setOpen(true);
    navigation.goBack();
    setTimeout(() => {
      editNutritionFactRef?.current?.barcode?.(barcode || '');
    }, 500);
  };

  const handleBarcodeClick = (oldResult: PhotoLoggingResults) => {
    setResult(oldResult);
    setOpen(false);

    navigation.navigate('BarcodeScanScreen', {
      onViewExistingItem: (item) => {
        if (item?.customFood) {
          // If the user clicks on the "View Food Item", they're navigated to the food details screen of that custom food.
          // Might be in this case they navigate to the new create food detail screen.
          onNavigateToEditFoodScreen(item);
        } else {
          // custom food doesn't exist
          // . If the user clicks on the "View Food Item", they're navigated to the food details screen of that food item
          onNavigateToEditFoodScreen(item);
        }
      },
      onBarcodePress: (item) => {
        applyBarcode(item?.customFood ? '' : item?.barcode);
      },
      onCreateFoodAnyWay: (item) => {
        applyBarcode(item?.customFood ? '' : item?.barcode);
      },
      onClose: () => {
        setOpen(true);
        navigation.goBack();
      },
    });
  };

  const onNavigateToEditFoodScreen = (item?: BarcodeCustomResult) => {
    if (item?.customFood) {
      navigation.push('EditFoodLogScreen', {
        foodLog: createFoodLogByCustomFood(
          item.customFood,
          undefined,
          undefined
        ),
        customFood: item.customFood,
        prevRouteName: 'ExistedBarcode',
        onSaveLogPress: () => {},
      });
    } else {
      if (item?.passioIDAttributes) {
        const barcodeFoodLog = convertPassioFoodItemToFoodLog(
          item.passioIDAttributes,
          undefined,
          undefined
        );
        navigation.push('EditFoodLogScreen', {
          foodLog: barcodeFoodLog,
          prevRouteName: 'Barcode',
          onSaveLogPress: () => {},
        });
      }
    }
  };

  const releaseEditor = () => {
    setOpen(false);
    setResult(undefined);
  };

  return {
    branding,
    editNutritionFactRef,
    editType,
    isOpen,
    handleBarcodeClick,
    handleNutritionFactCloseClick,
    openEditServingPopup,
    releaseEditor,
    result,
    setEditType,
    setOpen,
    setResult,
  };
};
