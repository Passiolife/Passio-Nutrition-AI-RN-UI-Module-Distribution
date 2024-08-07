import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { FavoriteFoodItem } from '../../../models';
import { servingLabel } from '../../../utils/StringUtils';
import { SwipeToDelete } from '../../../components';
import { COLORS } from '../../../constants';
import { PassioFoodIcon } from '../../../components/passio/PassioFoodIcon';
import { ICONS } from '../../../assets';

interface Props {
  foodLog: FavoriteFoodItem;
  onLogItem: (favoriteFoodItem: FavoriteFoodItem) => void;
  onTap: (favoriteFoodItem: FavoriteFoodItem) => void;
  onDeleteFoodLog: (favoriteFoodItem: FavoriteFoodItem) => void;
}

const FavoriteFoodLogView = (props: Props) => {
  const { foodLog } = props;

  return (
    <SwipeToDelete
      onPressDelete={() => props.onDeleteFoodLog(foodLog)}
      onPressEdit={() => props.onTap(foodLog)}
      marginVertical={4}
      swipeableContainer={{ marginHorizontal: 20 }}
      childrenContainerStyle={styles.shadowContainer}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => props.onTap(foodLog)}
      >
        <View style={styles.mealContainer}>
          <View style={styles.mealImgLayout}>
            <PassioFoodIcon
              iconID={foodLog.iconID}
              style={styles.mealImg}
              entityType={foodLog.entityType}
            />
          </View>
          <View style={styles.mealDetail}>
            <Text style={styles.mealName}>{foodLog.name}</Text>
            {servingLabel(foodLog).length > 1 && (
              <Text style={styles.mealSize}>{servingLabel(foodLog)}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => props.onLogItem(foodLog)}>
            <Image source={ICONS.newAddPlus} style={[styles.logItem]} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </SwipeToDelete>
  );
};

export default React.memo(FavoriteFoodLogView);

const styles = StyleSheet.create({
  shadowContainer: {
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 8,
    shadowColor: '#00000029',
    shadowOpacity: 1,
    shadowOffset: {
      width: 1.5,
      height: 2.0,
    },
    shadowRadius: 2.85,
    elevation: 12,
  },
  mealContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealDetail: {
    marginHorizontal: 10,
    flex: 1,
  },
  mealImg: {
    height: 50,
    width: 50,
  },
  mealName: {
    fontWeight: '600',
    fontSize: 15,
    textTransform: 'capitalize',
    color: COLORS.grey7,
  },
  mealSize: {
    color: COLORS.grey7,
    fontSize: 14,
    fontWeight: '400',
  },
  logItem: {
    marginRight: 10,
    width: 24,
    height: 24,
  },
  mealImgLayout: {
    borderRadius: 50,
    overflow: 'hidden',
    height: 50,
    width: 50,
  },
});
