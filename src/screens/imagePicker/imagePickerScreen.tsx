import React from 'react';
import { useSharedValue } from 'react-native-reanimated';
import { TakePicture } from '../takePicture/views/TakePicture';
import { RouteProp, useRoute } from '@react-navigation/native';
import type { ParamList } from '../../navigaitons';
import { SelectPhotos } from '../takePicture/views/SelectPhotos';

export const ImagePickerScreen = () => {
  const animatedIndex = useSharedValue<number>(0);
  const { params } = useRoute<RouteProp<ParamList, 'ImagePickerScreen'>>();

  return params.type === 'camera' ? (
    <TakePicture
      recognizePictureRemote={params.onImages}
      animatedIndex={animatedIndex}
    />
  ) : (
    <SelectPhotos recognizePictureRemote={params.onImages} />
  );
};
