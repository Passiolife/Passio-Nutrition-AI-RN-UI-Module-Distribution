import {
  IconSize,
  type PassioID,
  PassioIconView,
} from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';

import {
  Image,
  ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
} from 'react-native';

import React, { useEffect, useState } from 'react';
import type { PassioIconType } from '../../models';
import { CUSTOM_USER_FOOD } from '../../screens/foodCreator/FoodCreator.utils';
import { useServices } from '../../contexts';
import { ICONS } from '../../assets';

interface Props {
  style?: StyleProp<ImageStyle>;
  passioID?: PassioID;
  imageName?: string;
  userFoodImage?: string;
  iconID?: string;
  extra?: string;
  size?: IconSize;
  entityType?: PassioIconType;
  defaultImage?: ImageSourcePropType | undefined;
}

/*
  PassioFoodIcon: RENDER FOOD IMAGE From Server
  */

export const PassioFoodIcon = (props: Props) => {
  const { passioID, imageName, size, iconID, extra, defaultImage } = props;
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
  }, [dataService, iconID, extra]);

  let icon = iconID || passioID || imageName;

  return (
    <>
      {base64 ? (
        <Image
          testID="testPassioFoodIconImage"
          style={[props.style]}
          source={{ uri: `data:image/png;base64,${base64}` }}
        />
      ) : icon ? (
        <PassioIconView
          testID="testPassioFoodIconImage"
          style={[props.style]}
          config={{
            passioID: icon ?? '',
            iconSize: size ?? IconSize.PX90,
          }}
        />
      ) : (
        <Image
          testID="testPassioFoodIconImage"
          style={[
            {
              height: 24,
              width: 24,
            },
            props.style,
          ]}
          source={defaultImage ?? ICONS.FoodEditImage}
        />
      )}
    </>
  );
};
