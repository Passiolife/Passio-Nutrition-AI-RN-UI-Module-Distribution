import { FlatList } from 'react-native';

import React from 'react';
import type { CustomFood } from '../../../../models';
import CustomFoodsItem from './views/CustomFoodsItem';
import { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3';
import { useMyCustomFoods } from './useMyCustomFoods';
import { BasicButton } from '../../../../components';
import { EmptyView } from '../../../../components/empty';

const CustomFoods = () => {
  const {
    customFoods,
    onCreateFoodPress,
    onEditFoodCreatorPress,
    onFoodDetailPress,
    onDeletePress,
    onLogPress,
  } = useMyCustomFoods();

  const renderCustomFood = ({ item }: { item: CustomFood }) => {
    return (
      <CustomFoodsItem
        passioID={item.iconID ?? item.iconID ?? item.iconID ?? ''}
        name={item.name}
        brandName={item.brandName}
        iconID={item.iconID ?? ''}
        onPressLog={() => onLogPress?.(item)}
        onFoodDetailPress={() => onFoodDetailPress?.(item)}
        onEditFoodCreatorPress={() => onEditFoodCreatorPress?.(item)}
        onPressDelete={() => onDeletePress?.(item)}
        entityType={PassioIDEntityType.barcode}
      />
    );
  };

  return (
    <>
      {customFoods === undefined ||
        (customFoods?.length === 0 && (
          <EmptyView title={''} description={'There is no custom food'} />
        ))}
      <FlatList data={customFoods} renderItem={renderCustomFood} />
      <BasicButton
        text="Create New Food"
        style={{
          marginVertical: 24,
          marginHorizontal: 16,
        }}
        onPress={onCreateFoodPress}
      />
    </>
  );
};
export default React.memo(CustomFoods);
