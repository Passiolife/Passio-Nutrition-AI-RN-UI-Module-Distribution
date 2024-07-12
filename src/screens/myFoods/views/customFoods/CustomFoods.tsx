import { FlatList } from 'react-native';

import React from 'react';
import type { CustomFood } from '../../../../models';
import CustomFoodsItem from './views/CustomFoodsItem';
import { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3';

interface Props {
  customFoods: CustomFood[];
  onPressLog?: (food: CustomFood) => void;
  onPressEditor?: (food: CustomFood) => void;
  onPressDelete?: (food: CustomFood) => void;
}

const CustomFoods = ({
  customFoods,
  onPressEditor,
  onPressLog,
  onPressDelete,
}: Props) => {
  const renderCustomFood = ({ item }: { item: CustomFood }) => {
    return (
      <CustomFoodsItem
        passioID={''}
        imageName={''}
        name={item.name}
        brandName={item.brandName}
        userImage={item.userFoodImage}
        onPressLog={() => onPressLog?.(item)}
        onPressEditor={() => onPressEditor?.(item)}
        onPressDelete={() => onPressDelete?.(item)}
        entityType={PassioIDEntityType.barcode}
      />
    );
  };

  return <FlatList data={customFoods} renderItem={renderCustomFood} />;
};
export default React.memo(CustomFoods);
