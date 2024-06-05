import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../constants';
import { content } from '../../../constants/Content';
export const FavoriteEmptyView = () => {
  const render = () => {
    return (
      <>
        <View style={styles.content}>
          <Text style={styles.textTitle}>{content.yourFavoritesIsEmpty}</Text>
          <Text style={styles.textMessage}>
            {content.addFavoritesFromYourFoodLogOrScanNewFoodItems}
          </Text>
        </View>
      </>
    );
  };
  return render();
};
const styles = StyleSheet.create({
  content: {
    flexDirection: 'column',
    paddingHorizontal: 36,
    alignContent: 'center',
    flex: 1,
    marginBottom: 100,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  textTitle: {
    color: COLORS.grey7,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 8,
  },
  textMessage: {
    color: COLORS.grey7,
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 16,
    paddingVertical: 0,
  },
});
