import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useBranding, type Branding } from '../../../../contexts';
import type { FoodItem } from '../../../../models';
import IngredientItemView from './IngredientItemView';
import { content } from '../../../../constants/Content';
import { BasicButton, Card, Text } from '../../../../components';
import { scaleHeight, scaleWidth } from '../../../../utils';

interface Props {
  foodItems: FoodItem[];
  isShowAll?: boolean;
  onAddIngredients: () => void;
  deleteIngredientsItem: (foodItem: FoodItem) => void;
  navigateToEditIngredientsScreen: (
    foodItem: FoodItem,
    deleteIngredientsItem: (foodItem: FoodItem) => void
  ) => void;
}

export const IngredientsView = ({
  foodItems,
  onAddIngredients,
  deleteIngredientsItem,
  navigateToEditIngredientsScreen,
  isShowAll = false,
}: Props) => {
  const branding = useBranding();
  const styles = ingredientViewStyle(branding);

  const onIngredientClickPress = async (item: FoodItem) => {
    navigateToEditIngredientsScreen(item, deleteIngredientsItem);
  };

  return (
    <View>
      <Card style={styles.container}>
        <TouchableOpacity style={styles.plusTouchOpacity}>
          <Text
            weight="600"
            size="_16px"
            color="text"
            style={[styles.ingredientText]}
          >
            {content.addIngredients}
          </Text>

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
        </TouchableOpacity>

        <>
          {isShowAll || foodItems.length > 1 ? (
            <View>
              <View style={styles.line} />
              <FlatList
                data={foodItems}
                renderItem={({ item }: { item: FoodItem }) => {
                  return (
                    <IngredientItemView
                      deleteIngredientsItem={(foodItem: FoodItem) =>
                        deleteIngredientsItem(foodItem)
                      }
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
      paddingVertical: scaleHeight(16),
      flex: 1,
    },
    line: {
      height: 1,
      marginVertical: scaleHeight(14),
      backgroundColor: border,
    },
    ingredientText: {},
    plusTouchOpacity: {
      flexDirection: 'row',
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
