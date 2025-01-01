import { TouchableOpacity, View, Image } from 'react-native';

import { Card } from '../cards';
import { PassioFoodIcon } from '../passio/PassioFoodIcon';
import type { PassioID } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import type { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3/src/sdk/v2';
import React from 'react';
import { stylesObj } from './SearchResultItemView.style';
import { Text } from '../texts';
import { ICONS } from '../../assets';
import { useBranding } from '../../contexts';

interface Props {
  passioID: PassioID;
  imageName: string;
  name: string;
  brandName?: string;
  isRecipe?: boolean;
  onPressEditor: () => void;
  onPressLog: () => void;
  entityType: PassioIDEntityType;
}

const SearchResultItemView = ({
  passioID,
  name,
  onPressEditor,
  onPressLog,
  entityType,
  brandName,
  imageName,
  isRecipe,
}: Props) => {
  const branding = useBranding();
  const styles = stylesObj(branding);
  return (
    <Card style={styles.shadowContainer}>
      <TouchableOpacity style={styles.mealContainer} onPress={onPressEditor}>
        <View>
          <View style={styles.mealImgLayout}>
            <PassioFoodIcon
              passioID={passioID}
              iconID={passioID}
              imageName={imageName}
              style={styles.mealImg}
              entityType={entityType}
            />
          </View>
          {isRecipe && (
            <Image
              source={ICONS.recipe}
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                height: 16,
                width: 16,
              }}
            />
          )}
        </View>
        <View style={styles.mealDetail}>
          <Text weight="600" size="_14px" color="text" style={styles.mealName}>
            {name}
          </Text>
          {brandName && (
            <Text
              weight="400"
              size="_14px"
              color="secondaryText"
              style={styles.brand}
            >
              {brandName}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={onPressLog} style={styles.addFoodIconView}>
          <Image source={ICONS.newAddPlus} style={styles.addFoodIcon} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Card>
  );
};

export default React.memo(SearchResultItemView);
