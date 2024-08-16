import { SafeAreaView, View } from 'react-native';
import {
  SearchHeader,
  SearchResultAlternativeView,
  SearchResultView,
} from '../../components';

import type { MealLabel } from '../../models';
import type { Module, ParamList } from '../../navigaitons';
import { ProgressLoadingView } from '../../components/loader';
import React from 'react';
import type { StackNavigationProp } from '@react-navigation/stack';
import { searchStyle } from './FoodSearch.styles';
import { useFoodSearch } from './useFoodSearch';
import type { PassioFoodItem } from '@passiolife/nutritionai-react-native-sdk-v3';

export type FoodSearchScreenNavigationProps = StackNavigationProp<
  ParamList,
  'FoodSearchScreen'
>;

export interface FoodSearchScreenProp {
  logToDate?: Date | undefined;
  logToMeal?: MealLabel | undefined;
  onSaveData?: (item: PassioFoodItem) => void;
  onEditFoodData?: (item: PassioFoodItem) => void;
  from: Module;
}

export const FoodSearchScreen = () => {
  const {
    alternatives,
    branding,
    loading,
    results,
    searchQuery,
    cancelPress,
    cleanSearch,
    onSearchFood,
    onSearchItemPress,
  } = useFoodSearch();

  const styles = searchStyle(branding);

  return (
    <View style={styles.body}>
      <View style={styles.statusBarLayout} />
      <SafeAreaView style={styles.container}>
        <SearchHeader
          searchQuery={searchQuery}
          onChangeSearchInput={onSearchFood}
          clearSearchInput={cleanSearch}
          onPressCancleBtn={cancelPress}
          autoFocusForSearchInput={true}
        />
        <View style={styles.mainContainer}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ProgressLoadingView />
            </View>
          ) : results.length ? (
            <>
              <View style={styles.gap} />
              <SearchResultAlternativeView
                alternatives={alternatives}
                onPressAlternative={onSearchFood}
              />
              <View style={styles.gap} />
              <SearchResultView
                searchResult={results}
                handleLoadMore={() => {}}
                onPressLog={(item) => onSearchItemPress(item, false)}
                onPressEditor={(item) => onSearchItemPress(item, true)}
              />
            </>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
};
