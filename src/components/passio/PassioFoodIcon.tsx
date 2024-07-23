import {
  IconSize,
  type PassioID,
  PassioIconView,
} from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import { Image, type ImageStyle, type StyleProp } from 'react-native';

import React, { useEffect, useState } from 'react';
import type { PassioIconType } from '../../models';
import { CUSTOM_USER_FOOD } from '../../screens/foodCreator/FoodCreator.utils';
import { useServices } from '../../contexts';

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
  const { passioID, imageName, size, iconID } = props;
  const [base64, setBase64] = useState('');
  const { dataService } = useServices();

  useEffect(() => {
    async function init() {
      if (iconID && iconID.includes(CUSTOM_USER_FOOD)) {
        const image = await dataService.getImage(iconID);
        if (image) {
          setBase64(image.base64);
        }
      }
    }
    init();
  }, [dataService, iconID]);

  return (
    <>
      {base64 ? (
        <Image
          testID="testPassioFoodIconImage"
          style={[props.style]}
          source={{ uri: `data:image/png;base64,${base64}` }}
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
