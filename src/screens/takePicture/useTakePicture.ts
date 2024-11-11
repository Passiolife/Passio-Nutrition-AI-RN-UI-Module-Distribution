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
import type { TakePictureRef } from './views/TakePicture';
import type { SelectPhotosRef } from './views/SelectPhotos';

export type TakePictureScreenProps = StackNavigationProp<
  ParamList,
  'TakePictureScreen'
>;

export const PHOTO_LIMIT = 7;

export interface PicturePassioAdvisorFoodInfo extends PassioAdvisorFoodInfo {
  isSelected?: boolean;
}

export function useTakePicture() {
  const navigation = useNavigation<TakePictureScreenProps>();
  const services = useServices();
  const takePictureRef = useRef<TakePictureRef>(null);
  const selectPhotoRef = useRef<SelectPhotosRef>(null);
  const isSubmitting = useRef<boolean>(false);

  const route = useRoute<RouteProp<ParamList, 'TakePictureScreen'>>();

  const bottomSheetModalRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%', '70%'], []);
  const [isFetchingResponse, setFetchResponse] = useState(false);
  const [isPreparingLog, setPreparingLog] = useState(false);
  const [passioAdvisorFoodInfo, setPassioAdvisorFoodInfo] = useState<
    PicturePassioAdvisorFoodInfo[] | null
  >(null);

  const recognizePictureRemote = useCallback(
    async (imgs: string[]) => {
      if (isFetchingResponse) {
        return;
      }
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
          setPassioAdvisorFoodInfo(
            (foodInfoArrayFlat as PassioAdvisorFoodInfo[]).map((i) => {
              return {
                ...i,
                isSelected: true,
              };
            })
          );
        } else {
          bottomSheetModalRef.current?.expand();
        }
      } catch (error) {
      } finally {
        setFetchResponse(false);
      }
    },
    [isFetchingResponse]
  );

  const onLogSelectPress = useCallback(
    async (selected: PicturePassioAdvisorFoodInfo[]) => {
      if (isSubmitting.current) {
        return;
      }
      isSubmitting.current = true;

      if (isPreparingLog) {
        return;
      }
      setPreparingLog(true);
      const foodLogs = await createFoodLogUsingFoodDataInfo(
        selected.filter((i) => i.isSelected),
        route.params.logToDate,
        route.params.logToMeal
      );

      for (const item of foodLogs) {
        await services.dataService.saveFoodLog({
          ...item,
        });
      }
      setPreparingLog(false);
      navigation.pop(1);
      navigation.navigate('BottomNavigation', {
        screen: 'MealLogScreen',
      });

      isSubmitting.current = false;
    },

    [
      isPreparingLog,
      navigation,
      route.params.logToDate,
      route.params.logToMeal,
      services.dataService,
      isSubmitting,
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
    isPreparingLog,
    isFetchingResponse,
    type: route.params.type ?? 'camera',
    takePictureRef,
  };
}
