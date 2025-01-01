import React from 'react';
import type { FoodItem, MealLabel } from '../../models';
import type { ParamList } from '../../navigaitons';
import type { StackNavigationProp } from '@react-navigation/stack';
import { useFavorites } from './useFavorites';
import { FlatList, StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants';
import { FavoriteEmptyView } from './index';
import type { FavoriteFoodItem } from '../../models';
import FavoriteFoodLogView from './views/FavoriteFoodLogView';
import withLoading from '../../utils/withLoading';
import { ProgressLoadingView } from '../../components';
import type { Branding } from '../../contexts';

export type FavoritesScreenNavigationProps = StackNavigationProp<
  ParamList,
  'FavoritesScreen'
>;
export interface FavoritesScreenProps {
  logToDate?: Date;
  logToMeal?: MealLabel;
  from?: 'Recipe' | 'Other';
  addIngredient?: (foodItem: FoodItem) => void;
}

const MyFavoritesScreen = () => {
  const {
    branding,
    favoriteFoodLogs,
    navigateToFavoriteFoodLogEditor,
    onDeleteFavoritePress,
    onSaveFoodLogs,
  } = useFavorites();

  const styles = myFavoritesStyle(branding);

  return (
    <View style={styles.content}>
      {favoriteFoodLogs == null ? (
        <ProgressLoadingView />
      ) : favoriteFoodLogs.length > 0 ? (
        <View style={styles.flatListContainer}>
          <FlatList
            data={favoriteFoodLogs}
            renderItem={({ item }: { item: FavoriteFoodItem }) => {
              return (
                <FavoriteFoodLogView
                  foodLog={item}
                  onDeleteFoodLog={(fav) => onDeleteFavoritePress(fav.uuid)}
                  onLogItem={onSaveFoodLogs}
                  onTap={(foodItem) =>
                    navigateToFavoriteFoodLogEditor(foodItem, false)
                  }
                  onEditItem={(foodItem) =>
                    navigateToFavoriteFoodLogEditor(foodItem, true)
                  }
                />
              );
            }}
            keyExtractor={(item) => item.uuid}
            extraData={favoriteFoodLogs}
          />
        </View>
      ) : (
        <FavoriteEmptyView />
      )}
    </View>
  );
};

const myFavoritesStyle = ({ backgroundColor }: Branding) =>
  StyleSheet.create({
    content: {
      flexDirection: 'column',
      paddingTop: 10,
      flex: 1,
    },
    headerIconImg: {
      width: 24,
      height: 24,
    },
    headerText: {
      fontSize: 16,
      lineHeight: 19,
      color: COLORS.white,
      textTransform: 'capitalize',
    },
    flatListContainer: {
      flex: 1,
      backgroundColor: backgroundColor,
    },
  });

export default withLoading(MyFavoritesScreen);
