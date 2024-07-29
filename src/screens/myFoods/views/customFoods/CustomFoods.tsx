import { Alert, FlatList } from 'react-native';

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
  const onDeleteCustomFood = (item: CustomFood) => {
    Alert.alert('Are you sure want to delete this from my food?', undefined, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => onPressDelete?.(item),
        style: 'destructive',
      },
    ]);
  };
  const renderCustomFood = ({ item }: { item: CustomFood }) => {
    return (
      <CustomFoodsItem
        passioID={item.iconID ?? item.iconID ?? item.iconID ?? ''}
        imageName={item.iconID ?? ''}
        name={item.name}
        brandName={item.brandName}
        iconID={item.iconID ?? ''}
        onPressLog={() => onPressLog?.(item)}
        onPressEditor={() => onPressEditor?.(item)}
        onPressDelete={() => onDeleteCustomFood?.(item)}
        entityType={PassioIDEntityType.barcode}
      />
    );
  };

  return <FlatList data={customFoods} renderItem={renderCustomFood} />;
};
export default React.memo(CustomFoods);
