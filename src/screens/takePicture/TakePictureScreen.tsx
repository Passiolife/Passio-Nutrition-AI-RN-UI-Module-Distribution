import React from 'react';
import { useTakePicture } from './useTakePicture';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';
import { TakePicture } from './views/TakePicture';
import { SelectPhotos } from './views/SelectPhotos';

export const TakePictureScreen = gestureHandlerRootHOC(() => {
  const { type, recognizePictureRemote, selectPhotoRef, takePictureRef } =
    useTakePicture();

  const animatedIndex = useSharedValue<number>(0);

  return (
    <>
      {type === 'camera' ? (
        <TakePicture
          recognizePictureRemote={recognizePictureRemote}
          animatedIndex={animatedIndex}
          ref={takePictureRef}
          isMultiple
        />
      ) : (
        <SelectPhotos
          recognizePictureRemote={recognizePictureRemote}
          ref={selectPhotoRef}
          isMultiple
        />
      )}
    </>
  );
});
