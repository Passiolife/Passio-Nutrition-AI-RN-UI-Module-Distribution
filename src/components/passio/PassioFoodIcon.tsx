import {
  IconSize,
  type PassioID,
  PassioIconView,
} from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { Image, type ImageStyle, type StyleProp } from 'react-native';

import React from 'react';
import type { PassioIconType } from '../../models';

interface Props {
  style?: StyleProp<ImageStyle>;
  passioID?: PassioID;
  imageName?: string;
  userFoodImage?: string;
  iconID?: string;
  size?: IconSize;
  entityType?: PassioIconType;
}

/*
  PassioFoodIcon: RENDER FOOD IMAGE From Server
  */
export const PassioFoodIcon = (props: Props) => {
  const { passioID, imageName, size, userFoodImage, iconID } = props;
  return (
    <>
      {userFoodImage ? (
        <Image
          testID="testPassioFoodIconImage"
          style={[props.style]}
          source={{ uri: `data:image/png;base64,${userFoodImage}` }}
        />
      ) : (
        <PassioIconView
          testID="testPassioFoodIconImage"
          style={[props.style]}
          config={{
            passioID: iconID ?? imageName ?? passioID ?? '',
            iconSize: size ?? IconSize.PX90,
          }}
        />
      )}
    </>
  );
};
