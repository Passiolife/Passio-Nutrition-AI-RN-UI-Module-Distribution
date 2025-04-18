import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useBranding, type Branding } from '../../../../contexts';
import type { FoodItem } from '../../../../models';
import IngredientItemView from './IngredientItemView';
import { BasicButton, Card, Text } from '../../../../components';
import { scaleHeight, scaleWidth } from '../../../../utils';
import { ICONS } from '../../../../assets';

interface Props {
  foodItems: FoodItem[];
  isShowAll?: boolean;
  enable?: boolean;
  referenceCode?: string;
  onAddIngredients?: () => void;
  deleteIngredientsItem?: (foodItem: FoodItem) => void;
  navigateToEditIngredientsScreen?: (
    foodItem: FoodItem,
    deleteIngredientsItem?: (foodItem: FoodItem) => void
  ) => void;
  type?: 'EditRecipe' | 'Other';
}

export const IngredientsView = ({
  foodItems,
  onAddIngredients,
  deleteIngredientsItem,
  navigateToEditIngredientsScreen,
  isShowAll = false,
  enable = true,
  type = 'Other',
}: Props) => {
  const branding = useBranding();
  const styles = ingredientViewStyle(branding);

  const onIngredientClickPress = async (item: FoodItem) => {
    navigateToEditIngredientsScreen?.(item, deleteIngredientsItem);
  };

  return (
    <View>
      <Card style={styles.container}>
        <View style={styles.plusTouchOpacity}>
          <Text
            weight="600"
            size="title"
            color="text"
            style={[styles.ingredientText]}
          >
            {type === 'EditRecipe' ? 'Add Ingredient' : 'Ingredients'}
          </Text>
          {type === 'EditRecipe' ? (
            <TouchableOpacity onPress={onAddIngredients}>
              <Image
                source={ICONS.newAddPlus}
                style={{
                  height: 24,
                  width: 24,
                }}
              />
            </TouchableOpacity>
          ) : (
            <>
              {foodItems.length > 1 ? (
                <BasicButton
                  onPress={onAddIngredients}
                  text={'Edit recipe'}
                  style={{ paddingVertical: 0 }}
                />
              ) : (
                <BasicButton
                  onPress={onAddIngredients}
                  text={'Make custom recipe'}
                  style={{ paddingVertical: 0 }}
                />
              )}
            </>
          )}
        </View>

        <>
          {isShowAll || foodItems.length > 1 ? (
            <View>
              <View style={styles.line} />
              <View
                style={{
                  height: 10,
                }}
              />
              <FlatList
                data={foodItems}
                renderItem={({ item }: { item: FoodItem }) => {
                  return (
                    <IngredientItemView
                      deleteIngredientsItem={(foodItem: FoodItem) =>
                        deleteIngredientsItem?.(foodItem)
                      }
                      enabled={enable}
                      foodItem={item}
                      onPress={onIngredientClickPress}
                    />
                  );
                }}
                keyExtractor={(__: FoodItem, index: Number) => index.toString()}
                extraData={foodItems}
              />
            </View>
          ) : null}
        </>
      </Card>
    </View>
  );
};

const ingredientViewStyle = ({ border }: Branding) =>
  StyleSheet.create({
    container: {
      marginTop: scaleHeight(16),
      paddingVertical: scaleHeight(8),
      flex: 1,
    },
    line: {
      backgroundColor: border,
    },
    ingredientText: {},
    plusTouchOpacity: {
      flexDirection: 'row',
      paddingVertical: 8,
      alignItems: 'center',
      paddingHorizontal: scaleWidth(13),
      alignContent: 'space-between',
      justifyContent: 'space-between',
    },
    plusIcon: {
      width: 24,
      height: 24,
    },
  });
