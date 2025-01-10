import { useRef, useState } from 'react';
import { useBranding } from '../../../contexts';
import type { PhotoLoggingResults } from '../usePhotoLogging';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../../navigaitons';
import type { EditNutritionFactRef } from './nutritionFact/EditNutritionFactModal';

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

  const handleBarcodeClick = (oldResult: PhotoLoggingResults) => {
    setResult(oldResult);
    setOpen(false);
    navigation.navigate('BarcodeScanScreen', {
      type: 'general',
      onBarcodeOnly: (item) => {
        setOpen(true);
        navigation.goBack();
        setTimeout(() => {
          editNutritionFactRef?.current?.barcode?.(item);
        }, 500);
      },
      onClose: () => {
        setOpen(true);
        navigation.goBack();
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
