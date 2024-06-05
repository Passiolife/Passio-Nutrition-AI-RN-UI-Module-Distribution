import React from 'react';
import {
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
  FlatList,
} from 'react-native';
import { QuickSuggestionItemView } from './QuickSuggestionItemView';
import { COLORS } from '../../../constants';
import type { QuickSuggestion } from '../../../models/QuickSuggestion';
import { Text } from '../../../components/texts/Text';

interface Props {
  style?: StyleProp<ViewStyle>;
  onFoodLogEditor: (quickSuggestion: QuickSuggestion) => void;
  onFoodLog: (quickSuggestion: QuickSuggestion) => void;
  quickSuggestedAttributes: Array<QuickSuggestion>;
}

export const QuickSuggestions = ({
  style,
  onFoodLogEditor,
  onFoodLog,
  quickSuggestedAttributes,
}: Props) => {
  const renderFooter = () => {
    return <View style={styles.footer} />;
  };

  return (
    <View style={[styles.itemsContainer, style]}>
      <Text
        weight="600"
        size="_18px"
        color="text"
        style={styles.quickSuggestionTextStyle}
      >
        Quick Suggestions
      </Text>
      <Text
        weight="500"
        size="_14px"
        color="secondaryText"
        style={styles.noQuickSuggestionTitle}
      >
        Drag tray up to view suggestions to log
      </Text>
      {quickSuggestedAttributes && (
        <FlatList
          style={styles.list}
          data={quickSuggestedAttributes}
          numColumns={2}
          ListFooterComponent={renderFooter}
          renderItem={({ item }: { item: QuickSuggestion }) => {
            return (
              <QuickSuggestionItemView
                foodName={item.foodName}
                imageName={item.iconID}
                onFoodLogEditor={() => onFoodLogEditor(item)}
                onFoodLog={() => onFoodLog(item)}
              />
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemsContainer: {
    backgroundColor: 'white',
  },
  footer: {
    height: 120,
  },
  list: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  quickSuggestionTextStyle: {
    alignSelf: 'center',
    marginTop: 4,
    paddingHorizontal: 16,
  },
  noQuickSuggestionTitle: {
    paddingHorizontal: 16,
    marginBottom: 16,
    alignSelf: 'center',
  },
  noQuickSuggestionDescriptions: {
    fontSize: 15,
    alignSelf: 'center',
    textAlign: 'justify',
    fontWeight: '400',
    paddingHorizontal: 32,
    color: COLORS.grey7,
  },
});
