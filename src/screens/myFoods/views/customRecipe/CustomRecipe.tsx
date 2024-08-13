import { FlatList } from 'react-native';

import React from 'react';
import type { CustomRecipe } from '../../../../models';
import CustomRecipeItem from './views/CustomRecipeItem';
import { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3';
import { useMyCustomRecipe } from './useMyCustomRecipe';
import { BasicButton, RecipeOptions } from '../../../../components';
import { EmptyView } from '../../../../components/empty';

const CustomRecipe = () => {
  const {
    customRecipes,
    recipeOptionsRef,
    onCreateNewRecipePress,
    onFoodSearch,
    onFoodDetailPress,
    onEditCustomRecipePress,
    onDeletePress,
    onLogPress,
  } = useMyCustomRecipe();

  const renderCustomRecipe = ({ item }: { item: CustomRecipe }) => {
    return (
      <CustomRecipeItem
        passioID={item.iconID ?? ''}
        name={item.name}
        brandName={item.brandName}
        iconID={item.iconID ?? ''}
        onPressLog={() => onLogPress?.(item)}
        onFoodDetailPress={() => onFoodDetailPress?.(item)}
        onEditCustomRecipePress={() => onEditCustomRecipePress?.(item)}
        onPressDelete={() => onDeletePress?.(item)}
        entityType={PassioIDEntityType.item}
      />
    );
  };

  return (
    <>
      {customRecipes === undefined ||
        (customRecipes?.length === 0 && (
          <EmptyView title={''} description={'There is no custom recipe'} />
        ))}
      <FlatList data={customRecipes} renderItem={renderCustomRecipe} />
      <BasicButton
        text="Create New Recipe"
        style={{
          marginVertical: 24,
          marginHorizontal: 16,
        }}
        onPress={onCreateNewRecipePress}
      />
      <RecipeOptions ref={recipeOptionsRef} onTextSearch={onFoodSearch} />
    </>
  );
};

export default React.memo(CustomRecipe);
