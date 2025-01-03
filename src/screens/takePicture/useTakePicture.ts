import type { ParamList } from '../../navigaitons';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useCallback, useRef } from 'react';
import { type PassioAdvisorFoodInfo } from '@passiolife/nutritionai-react-native-sdk-v3';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
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
  const takePictureRef = useRef<TakePictureRef>(null);
  const selectPhotoRef = useRef<SelectPhotosRef>(null);

  const route = useRoute<RouteProp<ParamList, 'TakePictureScreen'>>();

  const recognizePictureRemote = useCallback(
    async (imgs: string[]) => {
      navigation.replace('PhotoLoggingScreen', {
        images: imgs,
        logToDate: route.params.logToDate,
        logToMeal: route.params.logToMeal,
      });
    },
    [navigation, route.params.logToDate, route.params.logToMeal]
  );

  return {
    type: route.params.type ?? 'camera',
    recognizePictureRemote,
    selectPhotoRef,
    takePictureRef,
  };
}
