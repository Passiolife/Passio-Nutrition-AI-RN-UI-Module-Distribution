import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3';
import { useRef, useState } from 'react';
import { Alert } from 'react-native';
import { PhotoLoggingBarcodeRef } from '../photoLoggingResult/modal/PhotoLoggingEditorModal';
import { PhotoLoggingResults } from '../photoLoggingResult/usePhotoLogging';
import {
  ItemAddedToDairyViewModalRef,
  NutritionNotFoundModalRef,
} from '../../components';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ParamList } from '../../navigaitons';
import { isMissingNutrition } from '../../utils/V3Utils';

export type NutritionFactScreenType = 'camera' | 'scanning' | 'scanned';

export type NutritionFactsScannerProps = StackNavigationProp<
  ParamList,
  'NutritionFactScanScreen'
>;

export const useNutritionFactsScanner = () => {
  const navigation = useNavigation<NutritionFactsScannerProps>();
  const { params } =
    useRoute<RouteProp<ParamList, 'NutritionFactScanScreen'>>();
  const [type, setType] = useState<NutritionFactScreenType>('camera');
  const editNutritionFactRef = useRef<PhotoLoggingBarcodeRef>(null);
  const itemAddedToDairyViewModalRef =
    useRef<ItemAddedToDairyViewModalRef>(null);
  const nutritionNotFoundModalRef = useRef<NutritionNotFoundModalRef>(null);

  const [url, setURL] = useState<string | undefined>(undefined);

  const recognizePictureRemote = async (assets: string[]) => {
    try {
      setType('scanning');
      const scannedURL = assets?.[0]?.replace('file://', '');
      setURL(scannedURL ?? undefined);
      const item = await PassioSDK.recognizeNutritionFactsRemote(
        scannedURL ?? ''
      );
      if (item) {
        if (isMissingNutrition()) {
          nutritionNotFoundModalRef?.current?.open();
        } else {
          editNutritionFactRef?.current?.openNutritionFact({
            passioFoodItem: item,
            uuID: '',
            portionSize: '',
            weightGrams: item.amount.weight.value,
            assets: scannedURL,
            recognisedName: '',
            resultType: 'nutritionFacts',
          });
        }
      } else {
        nutritionNotFoundModalRef?.current?.open();
      }

      setType('scanned');
    } catch (error) {
      Alert.alert(JSON.stringify(error));
    }
  };

  const onUpdateFoodItem = (result: PhotoLoggingResults) => {
    if (result.passioFoodItem) {
      params.onSaveLog?.(result.passioFoodItem);
      navigation.goBack();
    }
  };

  const onViewDiaryPress = () => {
    itemAddedToDairyViewModalRef?.current?.close();
    navigation.navigate('BottomNavigation', {
      screen: 'MealLogScreen',
    });
  };
  const onCancelPress = () => {
    navigation.goBack();
  };
  const onTryAgain = () => {
    nutritionNotFoundModalRef?.current?.close();
    setType('camera');
  };
  const onEnterManually = () => {
    nutritionNotFoundModalRef?.current?.close();
    editNutritionFactRef?.current?.open({
      uuID: '',
      portionSize: '',
      weightGrams: 0,
      passioFoodItem: {
        amount: {
          weight: {
            unit: 'g',
            value: 100,
          },
          selectedUnit: 'gram',
          servingSizes: [
            {
              quantity: 100,
              unitName: 'gram',
            },
          ],
          servingUnits: [
            {
              unit: 'gram',
              value: 100,
              unitName: 'gram',
            },
          ],
          selectedQuantity: 100,
        },
        refCode: '',
        name: '',
        iconId: '',
        ingredientWeight: {
          unit: 'gram',
          value: 100,
        },
        id: '',
      },
      recognisedName: '',
      assets: url,
      resultType: 'nutritionFacts',
    });
  };
  return {
    recognizePictureRemote,
    editNutritionFactRef,
    onUpdateFoodItem,
    itemAddedToDairyViewModalRef,
    onTryAgain,
    nutritionNotFoundModalRef,
    onEnterManually,
    onViewDiaryPress,
    onCancelPress,
    setType,
    url,
    type,
  };
};
