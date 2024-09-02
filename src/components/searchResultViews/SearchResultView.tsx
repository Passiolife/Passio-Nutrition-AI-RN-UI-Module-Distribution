import { FlatList, View } from 'react-native';
import React from 'react';
import { SearchResultItemView, Text } from '..';
import styles from './SearchResultView.style';
import {
  PassioIDEntityType,
  PassioSDK,
  type PassioFoodDataInfo,
  type PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v3';
import type { SearchMyFood } from '../../screens/foodSearch/useFoodSearch';

interface SearchResultViewProps {
  searchResult: Array<PassioFoodDataInfo>;
  myFoodResult: Array<SearchMyFood>;
  handleLoadMore: () => void;
  onPressLog: (item: PassioFoodItem) => void;
  onPressEditor: (item: PassioFoodItem) => void;
  onPressMyFoodLog: (item: SearchMyFood) => void;
  onPressMyFoodLogEditor: (item: SearchMyFood) => void;
}

const SearchResultView = (props: SearchResultViewProps) => {
  const {
    myFoodResult,
    searchResult,
    handleLoadMore,
    onPressEditor,
    onPressLog,
    onPressMyFoodLog,
    onPressMyFoodLogEditor,
  } = props;

  const renderSearchResult = ({ item }: { item: PassioFoodDataInfo }) => {
    return (
      <SearchResultItemView
        onPressEditor={async () => {
          const attr = await PassioSDK.fetchFoodItemForDataInfo(item);
          if (attr) {
            onPressEditor(attr);
          }
        }}
        onPressLog={async () => {
          const attr = await PassioSDK.fetchFoodItemForDataInfo(item);
          if (attr) {
            onPressLog(attr);
          }
        }}
        passioID={item.iconID ?? ''}
        imageName={item.iconID ?? ''}
        name={item.foodName}
        brandName={item.brandName}
        entityType={PassioIDEntityType.group}
      />
    );
  };

  const renderMyFoodItem = ({ item }: { item: SearchMyFood }) => {
    return (
      <SearchResultItemView
        onPressEditor={() => {
          onPressMyFoodLogEditor(item);
        }}
        onPressLog={() => {
          onPressMyFoodLog(item);
        }}
        passioID={item.customFood?.iconID ?? item.customRecipe?.iconID ?? ''}
        imageName={item.customFood?.iconID ?? item.customRecipe?.iconID ?? ''}
        name={item.customFood?.name ?? item.customRecipe?.name ?? ''}
        brandName={
          item.customFood?.brandName ?? item.customRecipe?.brandName ?? ''
        }
        entityType={PassioIDEntityType.group}
        isRecipe={item.customRecipe !== undefined}
      />
    );
  };

  const renderMyFoods = () => {
    return (
      <View>
        {myFoodResult.length > 0 && (
          <>
            <Text weight="600" size="title" style={{ marginStart: 16 }}>
              My Foods
            </Text>
            <FlatList
              data={myFoodResult}
              keyExtractor={(item: SearchMyFood, index: number) =>
                index.toString() +
                (item.customFood?.iconID ?? item.customRecipe?.iconID)
              }
              renderItem={renderMyFoodItem}
              initialNumToRender={10}
              onEndReachedThreshold={0.02}
              contentContainerStyle={styles.contentContainerStyle}
              keyboardShouldPersistTaps="handled"
            />
            <View style={{ height: 24 }} />
          </>
        )}
        <Text
          weight="600"
          size="title"
          style={{ marginStart: 16, marginTop: 0 }}
        >
          Search Results
        </Text>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={searchResult}
        keyExtractor={(_item: PassioFoodDataInfo, index: number) =>
          index.toString()
        }
        renderItem={renderSearchResult}
        ListHeaderComponent={renderMyFoods}
        onEndReached={handleLoadMore}
        contentContainerStyle={styles.contentContainerStyle}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

export default SearchResultView;
