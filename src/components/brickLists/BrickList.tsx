import React, { type ReactElement } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

let { width } = Dimensions.get('window');

interface BrickListProps<ItemT> {
  columns: number;
  rowHeight?: number;
  data: ReadonlyArray<ItemT>;
  renderItem: ({ index, item }: { index: number; item: ItemT }) => ReactElement;
}

export const BrickList = <ItemT extends any>(props: BrickListProps<ItemT>) => {
  const styles = brickListStyle(props);
  return (
    <ScrollView>
      <View style={styles.container}>
        {props.data.map((dataItem, index) => {
          return (
            <View
              key={index}
              style={!props.rowHeight ? styles.relative : styles.fixed}
            >
              {props.renderItem({ item: dataItem, index: index })}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const brickListStyle = <ItemT extends any>(props: BrickListProps<ItemT>) =>
  StyleSheet.create({
    container: {
      width: '100%',
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    relative: { height: width / props.columns },
    fixed: { height: props.rowHeight },
  });
