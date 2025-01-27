import { useRef, useState } from 'react';
import { useBranding } from '../../../contexts';
import type { PhotoLoggingResults } from '../usePhotoLogging';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../../navigaitons';
import type { EditNutritionFactRef } from './nutritionFact/EditNutritionFactModal';
import type { CustomFood } from '../../../models';
import type { PassioFoodItem } from '@passiolife/nutritionai-react-native-sdk-v3';

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

  const applyBarcode = (
    barcode?: string,
    customFood?: CustomFood,
    passioFoodItem?: PassioFoodItem | null
  ) => {
    setOpen(true);
    navigation.goBack();
    setTimeout(() => {
      editNutritionFactRef?.current?.barcode?.(
        barcode || '',
        customFood,
        passioFoodItem
      );
    }, 500);
  };

  const handleBarcodeClick = (oldResult: PhotoLoggingResults) => {
    setResult(oldResult);
    setOpen(false);

    navigation.navigate('BarcodeScanScreen', {
      onViewExistingItem: async (item) => {
        applyBarcode(
          item?.customFood ? '' : item?.barcode,
          item?.customFood,
          item?.passioIDAttributes
        );
      },
      onBarcodePress: (item) => {
        applyBarcode(item?.customFood ? '' : item?.barcode);
      },
      onCreateFoodAnyWay: (item) => {
        applyBarcode(item?.customFood ? '' : item?.barcode);
      },
      onClose: () => {
        setOpen(true);
      },
    });
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
