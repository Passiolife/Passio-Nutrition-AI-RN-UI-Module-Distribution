import React, { useCallback, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, View } from 'react-native';

import type { FoodLog, MealLabel } from '../../../models';
// import { COLORS } from '../../../constants';
import MealLogItemView from './MealLogItemView';
import { Card, Text } from '../../../components';
import { scaleHeight, scaleWidth } from '../../../utils';
import { ICONS } from '../../../assets';
import { useBranding, type Branding } from '../../../contexts';

interface Data {
  title: MealLabel;
  data: FoodLog[];
}

const RenderItem = ({
  item,
  navigateToEditFoodLog,
  onDelete,
}: {
  item: Data;
  navigateToEditFoodLog: (foodLog: FoodLog) => void;
  onDelete: (foodLog: FoodLog) => void;
}) => {
  const navigateToEditFootLogScreen = useCallback(
    (food: FoodLog) => {
      navigateToEditFoodLog(food);
    },
    [navigateToEditFoodLog]
  );

  const renderFoodItem = ({ item: fItem }: { item: FoodLog }) => {
    return (
      <MealLogItemView
        foodLog={fItem}
        onPress={() => navigateToEditFootLogScreen(fItem)}
        onDeleteFoodLog={() => onDelete(fItem)}
      />
    );
  };
  const styles = mealLogViewStyle(useBranding());

  const [expandable, setExpandable] = useState(item.data.length > 0);
  return (
    <Card style={styles.cardContainer}>
      <Pressable
        onPress={() => {
          if (item.data.length === 0) {
            return;
          }
          setExpandable(!expandable);
        }}
        style={styles.heder}
      >
        <Text weight={'600'} size="title" color="text" style={styles.title}>
          {item.title}
        </Text>
        <Image
          source={expandable && item.data.length > 0 ? ICONS.down : ICONS.up}
          style={[
            styles.upDown,
            {
              opacity: item.data.length === 0 ? 0.2 : 1,
            },
          ]}
        />
      </Pressable>
      {expandable && item.data.length > 0 && (
        <>
          <View style={styles.line} />
          <FlatList
            data={item.data}
            renderItem={renderFoodItem}
            keyExtractor={(__: FoodLog) => __.uuid.toString()}
          />
        </>
      )}
    </Card>
  );
};

interface Props {
  isAddEnable: boolean | false;
  foodLogs: Array<FoodLog> | [];
  onDeleteFoodLog: (foodLog: FoodLog) => void;
  navigateToEditFoodLog: (foodLog: FoodLog) => void;
}

const MealLogsView = (props: Props) => {
  const sections: Data[] = (
    ['breakfast', 'lunch', 'dinner', 'snack'] as MealLabel[]
  ).map((item) => {
    const data: Data = {
      title: item,
      data: props.foodLogs.filter((foodItem) => foodItem.meal === item),
    };
    return data;
  });

  return (
    <FlatList
      data={sections}
      renderItem={({ item }) => (
        <RenderItem
          item={item}
          onDelete={props.onDeleteFoodLog}
          navigateToEditFoodLog={props.navigateToEditFoodLog}
        />
      )}
      keyExtractor={(__: Data) => __.title.toString()}
    />
  );
};

const mealLogViewStyle = ({ border }: Branding) =>
  StyleSheet.create({
    title: {
      textTransform: 'capitalize',
      flex: 1,
    },
    upDown: {
      height: scaleHeight(24),
      width: scaleWidth(24),
    },
    heder: {
      flexDirection: 'row',
      paddingVertical: scaleHeight(12),
      paddingHorizontal: scaleHeight(12),
    },
    cardContainer: {
      marginHorizontal: scaleWidth(4),
      marginBottom: scaleHeight(12),
    },
    line: {
      height: scaleHeight(1),
      backgroundColor: border,
    },
  });

export default React.memo(MealLogsView);
