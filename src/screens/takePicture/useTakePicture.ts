import type { ParamList } from '../../navigaitons';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useMemo, useRef, useState } from 'react';
import type BottomSheet from '@gorhom/bottom-sheet';
import { createFoodLogUsingFoodDataInfo } from '../../utils';
import {
  PassioSDK,
  type PassioAdvisorFoodInfo,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useServices } from '../../contexts';
import type { TakePictureRef } from './TakePicture';
import type { SelectPhotosRef } from './SelectPhotos';

export type TakePictureScreenProps = StackNavigationProp<
  ParamList,
  'TakePictureScreen'
>;

export const PHOTO_LIMIT = 7;

export function useTakePicture() {
  const navigation = useNavigation<TakePictureScreenProps>();
  const services = useServices();
  const takePictureRef = useRef<TakePictureRef>(null);
  const selectPhotoRef = useRef<SelectPhotosRef>(null);

  const route = useRoute<RouteProp<ParamList, 'TakePictureScreen'>>();

  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%', '60%'], []);
  const [isFetchingResponse, setFetchResponse] = useState(false);
  const [passioAdvisorFoodInfo, setPassioAdvisorFoodInfo] = useState<
    PassioAdvisorFoodInfo[] | null
  >(null);

  const recognizePictureRemote = useCallback(async (imgs: string[]) => {
    setFetchResponse(true);
    try {
      setPassioAdvisorFoodInfo(null);

      let foodInfoArray: Array<PassioAdvisorFoodInfo[] | null> = [];

      const data = imgs.map(async (item) => {
        const val = await PassioSDK.recognizeImageRemote(
          item.replace('file://', '') ?? ''
        );
        foodInfoArray?.push(val);
      });

      await Promise.all(data);
      let foodInfoArrayFlat = foodInfoArray.flat();
      if (foodInfoArrayFlat && foodInfoArrayFlat?.length > 0) {
        setFetchResponse(false);
        bottomSheetModalRef.current?.expand();
        setPassioAdvisorFoodInfo(foodInfoArrayFlat as PassioAdvisorFoodInfo[]);
      } else {
        bottomSheetModalRef.current?.expand();
      }
    } catch (error) {
    } finally {
      setFetchResponse(false);
    }
  }, []);

  const onLogSelectPress = useCallback(
    async (selected: PassioAdvisorFoodInfo[]) => {
      const foodLogs = await createFoodLogUsingFoodDataInfo(
        selected,
        route.params.logToDate,
        route.params.logToMeal
      );

      for (const item of foodLogs) {
        await services.dataService.saveFoodLog({
          ...item,
        });
      }
      navigation.pop(1);
      navigation.navigate('BottomNavigation', {
        screen: 'MealLogScreen',
      });
    },

    [
      navigation,
      route.params.logToDate,
      route.params.logToMeal,
      services.dataService,
    ]
  );

  const onRetakePress = useCallback(() => {
    if (route.params.type === 'camera') {
      bottomSheetModalRef.current?.close();
      setPassioAdvisorFoodInfo([]);
      takePictureRef.current?.onRetake();
    } else {
      bottomSheetModalRef.current?.close();
      setPassioAdvisorFoodInfo([]);
      selectPhotoRef.current?.onRetake();
    }
  }, [route.params.type]);

  const onCancelPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    recognizePictureRemote,
    snapPoints,
    bottomSheetModalRef,
    selectPhotoRef,
    onLogSelectPress,
    passioAdvisorFoodInfo,
    onRetakePress,
    onCancelPress,
    isFetchingResponse,
    type: route.params.type ?? 'camera',
    takePictureRef,
  };
}
