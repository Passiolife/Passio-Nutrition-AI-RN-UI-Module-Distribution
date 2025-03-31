import { PassioSDK } from '@passiolife/nutritionai-react-native-sdk-v3';
import { useRef, useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import type { PhotoLoggingBarcodeRef } from '../photoLoggingResult/modal/PhotoLoggingEditorModal';
import type { PhotoLoggingResults } from '../photoLoggingResult/usePhotoLogging';
import type {
  ItemAddedToDairyViewModalRef,
  NutritionNotFoundModalRef,
} from '../../components';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ParamList } from '../../navigaitons';
import {
  createBlankPassioFoodITem,
  isMissingNutrition,
} from '../../utils/V3Utils';

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
  const introductionNutritionModalRef = useRef<NutritionNotFoundModalRef>(null);

  const [url, setURL] = useState<string | undefined>(undefined);
  const [initializeCamera, setInitializeCamera] = useState(false);

  const recognizePictureRemote = async (assets: string[]) => {
    try {
      setType('scanning');
      const scannedURL = assets?.[0]?.replace('file://', '');
      setURL(scannedURL ?? undefined);
      const item = await PassioSDK.recognizeNutritionFactsRemote(
        scannedURL ?? '',
        'RES_512'
      );
      if (item) {
        if (isMissingNutrition(item)) {
          nutritionNotFoundModalRef?.current?.open();
        } else {
          editNutritionFactRef?.current?.openNutritionFact({
            passioFoodItem: {
              ...item,
              name: item.name,
              ingredients: item.ingredients?.map((i) => {
                return {
                  ...i,
                  metadata: {
                    ...i.metadata,
                    barcode: i.metadata?.barcode ?? params.barcode,
                  },
                };
              }),
            },
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
      params.onSaveLog?.(result);
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
    const passioFoodItem = createBlankPassioFoodITem(params.barcode);
    editNutritionFactRef?.current?.open({
      uuID: '',
      portionSize: '',
      weightGrams: 0,
      passioFoodItem: passioFoodItem,
      nutrients: PassioSDK.getNutrientsOfPassioFoodItem(
        passioFoodItem,
        passioFoodItem.amount.weight
      ),
      recognisedName: '',
      assets: url,
      resultType: 'nutritionFacts',
    });
  };

  useEffect(() => {
    // This operation is necessary to handle two camera instances: one is released in the barcode screen, and the other is initialized in this screen. These steps are essential to avoid reinitializing the camera.
    setTimeout(
      () => {
        setInitializeCamera(true);
      },
      Platform.OS === 'ios' ? 100 : 100
    );
  }, []);

  const onOkayPress = () => {
    introductionNutritionModalRef.current?.close();
  };

  useEffect(() => {
    introductionNutritionModalRef?.current?.open();
  }, []);

  return {
    recognizePictureRemote,
    editNutritionFactRef,
    onUpdateFoodItem,
    itemAddedToDairyViewModalRef,
    introductionNutritionModalRef,
    onOkayPress,
    onTryAgain,
    nutritionNotFoundModalRef,
    onEnterManually,
    onViewDiaryPress,
    onCancelPress,
    setType,
    url,
    type,
    initializeCamera,
  };
};
