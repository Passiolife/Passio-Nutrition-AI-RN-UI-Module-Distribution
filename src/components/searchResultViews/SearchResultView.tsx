import { FlatList } from 'react-native';
import React from 'react';
import { SearchResultItemView } from '..';
import styles from './SearchResultView.style';
import {
  PassioIDEntityType,
  PassioSDK,
  type PassioFoodDataInfo,
  type PassioFoodItem,
} from '@passiolife/nutritionai-react-native-sdk-v3';

interface SearchResultViewProps {
  searchResult: Array<PassioFoodDataInfo>;
  handleLoadMore: () => void;
  onPressLog: (item: PassioFoodItem) => void;
  onPressEditor: (item: PassioFoodItem) => void;
}

const SearchResultView = (props: SearchResultViewProps) => {
  const { searchResult, handleLoadMore, onPressEditor, onPressLog } = props;

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

  return (
    <FlatList
      data={searchResult}
      keyExtractor={(_item: PassioFoodDataInfo, index: number) =>
        index.toString()
      }
      renderItem={renderSearchResult}
      initialNumToRender={10}
      onEndReachedThreshold={0.02}
      onEndReached={handleLoadMore}
      contentContainerStyle={styles.contentContainerStyle}
      keyboardShouldPersistTaps="handled"
    />
  );
};

export default SearchResultView;
