import {
  IconSize,
  type PassioID,
  PassioIconView,
} from '@passiolife/nutritionai-react-native-sdk-v3';

import {
  Image,
  ImageSourcePropType,
  type ImageStyle,
  type StyleProp,
} from 'react-native';

import React, { useEffect, useState } from 'react';
import type { PassioIconType } from '../../models';
import {
  CUSTOM_USER_FOOD_PREFIX,
  CUSTOM_USER_NUTRITION_FACT__PREFIX,
  CUSTOM_USER_RECIPE__PREFIX,
} from '../../screens/foodCreator/FoodCreator.utils';
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
  let icon = iconID || passioID || imageName;

  useEffect(() => {
    async function init() {
      if (
        iconID &&
        iconID.startsWith(CUSTOM_USER_FOOD_PREFIX) &&
        iconID.length > CUSTOM_USER_FOOD_PREFIX.length
      ) {
        const image = await dataService.getImage(iconID);
        if (image) {
          setBase64(image.base64);
        }
      } else if (
        iconID &&
        iconID.startsWith(CUSTOM_USER_RECIPE__PREFIX) &&
        iconID.length > CUSTOM_USER_RECIPE__PREFIX.length
      ) {
        const image = await dataService.getImage(iconID);
        if (image) {
          setBase64(image.base64);
        }
      } else if (
        iconID &&
        iconID.startsWith(CUSTOM_USER_NUTRITION_FACT__PREFIX) &&
        iconID.length > CUSTOM_USER_NUTRITION_FACT__PREFIX.length
      ) {
        const image = await dataService.getImage(iconID);
        if (image) {
          setBase64(image.base64);
        }
      }
    }
    init();
  }, [dataService, extra, iconID]);

  return (
    <>
      {base64 ? (
        <Image
          testID="testPassioFoodIconImage"
          style={[props.style]}
          source={{ uri: `data:image/png;base64,${base64}` }}
        />
      ) : icon &&
        !icon.includes(CUSTOM_USER_RECIPE__PREFIX) &&
        !icon.includes(CUSTOM_USER_FOOD_PREFIX) &&
        !icon.includes(CUSTOM_USER_NUTRITION_FACT__PREFIX) ? (
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
          source={
            defaultImage
              ? defaultImage
              : icon?.startsWith(CUSTOM_USER_RECIPE__PREFIX)
                ? ICONS.recipe
                : icon?.startsWith(CUSTOM_USER_NUTRITION_FACT__PREFIX)
                  ? ICONS.foodNutritionFact
                  : ICONS.foodCreator
          }
        />
      )}
    </>
  );
};
