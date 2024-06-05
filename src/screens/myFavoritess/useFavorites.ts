import {
  useIsFocused,
  useNavigation,
  useRoute,
  type RouteProp,
} from '@react-navigation/native';
import type { FavoriteFoodItem } from '../../models';
import { useBranding, useServices } from '../../contexts';
import {
  createFoodLogFromFavoriteFoodItem,
  getLogToDate,
  getMealLog,
} from '../../utils';
import { useAsyncResource, resourceCache } from 'use-async-resource';
import type { FavoritesScreenNavigationProps } from './MyFavoritesScreen';
import { useEffect } from 'react';
import { getFavoriteFoodItems } from '../../utils/DataServiceHelper';
import type { ParamList } from 'src/navigaitons';
import { ShowToast } from '../../utils';

export function useFavorites() {
  const services = useServices();
  const isFocused = useIsFocused();
  const branding = useBranding();

  const navigation = useNavigation<FavoritesScreenNavigationProps>();
  const route = useRoute<RouteProp<ParamList, 'FavoritesScreen'>>();

  const [favoriteFoodReader, getUpdatedFavoriteFood] = useAsyncResource(
    getFavoriteFoodItems,
    services
  );

  useEffect(() => {
    if (isFocused) {
      resourceCache(getFavoriteFoodItems).clear();
      getUpdatedFavoriteFood(services);
    }
  }, [getUpdatedFavoriteFood, isFocused, services]);

  const date = getLogToDate(route.params.logToDate, route.params.logToMeal);
  const meal = getMealLog(date, route.params.logToMeal);

  const onSaveFoodLogs = async (favoriteFoodItem: FavoriteFoodItem) => {
    await services.dataService.saveFoodLog(
      createFoodLogFromFavoriteFoodItem(favoriteFoodItem, meal, date)
    );
    ShowToast('Log added');
    navigation.pop(1);
    navigation.navigate('BottomNavigation', {
      screen: 'MealLogScreen',
    });
  };

  const onDeleteFavoritePress = async (uuid: string) => {
    await services.dataService.deleteFavoriteFoodItem(uuid);
  };
  const onUpdateFavoritePress = async (favoriteFoodItem: FavoriteFoodItem) => {
    await services.dataService.saveFavoriteFoodItem(favoriteFoodItem);
  };

  const navigateToFavoriteFoodLogEditor = (
    favoriteFoodItem: FavoriteFoodItem
  ) => {
    navigation.push('EditFoodLogScreen', {
      foodLog: favoriteFoodItem,
      prevRouteName: 'Favorites',
      onSaveLogPress: (foodLog) => {
        onUpdateFavoritePress({
          ...favoriteFoodItem,
          ...foodLog,
          meal: meal,
        });
      },
      onDeleteLogPress: (foodLog) => {
        onDeleteFavoritePress(foodLog.uuid);
      },
    });
  };

  return {
    favoriteFoodLogs: favoriteFoodReader(),
    branding,
    onSaveFoodLogs,
    navigateToFavoriteFoodLogEditor,
  };
}
