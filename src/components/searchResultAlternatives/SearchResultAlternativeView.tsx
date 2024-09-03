import { FlatList, Pressable } from 'react-native';
import React from 'react';
import { Card, Text } from '..';
import searchResultAlternativeViewStyle from './SearchResultAlternativeView.style';
import { View } from 'react-native';

interface Props {
  alternatives: Array<string>;
  onPressAlternative: (item: string) => void;
}

const SearchResultAlternativeView = (props: Props) => {
  const { alternatives, onPressAlternative } = props;
  const styles = searchResultAlternativeViewStyle();

  const renderItem = ({ item }: { item: string }) => {
    return (
      <Card style={styles.card}>
        <Pressable
          style={styles.container}
          onPress={() => onPressAlternative(item)}
        >
          <Text weight={'500'} color={'text'} style={styles.text}>
            {item}
          </Text>
        </Pressable>
      </Card>
    );
  };

  return (
    <View>
      <FlatList
        data={alternatives}
        horizontal
        keyExtractor={(_item: string, index: number) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainerStyle}
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default SearchResultAlternativeView;
