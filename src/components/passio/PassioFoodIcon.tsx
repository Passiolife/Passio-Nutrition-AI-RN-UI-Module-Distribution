import {
  IconSize,
  type PassioID,
  PassioIconView,
} from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import type { ImageStyle, StyleProp } from 'react-native';

import React from 'react';
import type { PassioIconType } from '../../models';

interface Props {
  style?: StyleProp<ImageStyle>;
  passioID?: PassioID;
  imageName?: string;
  size?: IconSize;
  entityType: PassioIconType;
}

/*
  PassioFoodIcon: RENDER FOOD IMAGE From Server
  */
export const PassioFoodIcon = (props: Props) => {
  const { passioID, imageName, size } = props;
  return (
    <PassioIconView
      testID="testPassioFoodIconImage"
      style={[props.style]}
      config={{
        passioID: imageName ?? passioID ?? '',
        iconSize: size ?? IconSize.PX90,
      }}
    />
  );
};
