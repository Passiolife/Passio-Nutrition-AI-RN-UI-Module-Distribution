import { TouchableOpacity, View, Image, StyleSheet, Alert } from 'react-native';

import type { PassioID } from '@passiolife/nutritionai-react-native-sdk-v3';
import type { PassioIDEntityType } from '@passiolife/nutritionai-react-native-sdk-v3';
import React, { useRef } from 'react';
import { ICONS } from '../../../../../assets';
import { PassioFoodIcon } from '../../../../../components/passio/PassioFoodIcon';
import { Text } from '../../../../../components/texts/Text';
import {
  Card,
  SwipeToDelete,
  SwipeToDeleteRef,
} from '../../../../../components';
import { COLORS } from '../../../../../constants';
import { scaled } from '../../../../../utils';

interface Props {
  passioID: PassioID;
  iconID: string;
  name: string;
  brandName?: string;
  onFoodDetailPress: () => void;
  onEditCustomRecipePress: () => void;
  onPressDelete: () => void;
  onPressLog: () => void;
  entityType: PassioIDEntityType;
}

const CustomRecipeItem = ({
  name,
  onFoodDetailPress,
  onEditCustomRecipePress,
  onPressLog,
  onPressDelete,
  entityType,
  iconID,
}: Props) => {
  const swipeReg = useRef<SwipeToDeleteRef | null>(null);

  const onDeletePress = () => {
    Alert.alert('Are you sure want to delete this from my recipe?', undefined, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          onPressDelete?.();
          swipeReg?.current?.closeSwipe();
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <Card style={styles.shadowContainer}>
      <SwipeToDelete
        onPressDelete={onDeletePress}
        marginVertical={0}
        ref={swipeReg}
        onPressEdit={() => {
          swipeReg?.current?.closeSwipe();
          onEditCustomRecipePress?.();
        }}
      >
        <TouchableOpacity
          style={styles.mealContainer}
          onPress={onFoodDetailPress}
        >
          <View style={styles.mealImgLayout}>
            <PassioFoodIcon
              iconID={iconID}
              style={styles.mealImg}
              entityType={entityType}
            />
          </View>
          <View style={styles.mealDetail}>
            <Text
              weight="600"
              size="_14px"
              color="text"
              style={styles.mealName}
            >
              {name}
            </Text>
          </View>
          <TouchableOpacity onPress={onPressLog} style={styles.addFoodIconView}>
            <Image source={ICONS.newAddPlus} style={styles.addFoodIcon} />
          </TouchableOpacity>
        </TouchableOpacity>
      </SwipeToDelete>
    </Card>
  );
};
const styles = StyleSheet.create({
  shadowContainer: {
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: COLORS.white,
    // SHADOW
    flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.06)',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.9,
    shadowRadius: 3.2,
    elevation: 4,
  },
  mealContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 8,
  },
  mealDetail: {
    marginHorizontal: 10,
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
  },
  brand: {
    textTransform: 'capitalize',
  },
  mealImg: {
    height: 40,
    width: 40,
  },
  mealName: {
    textTransform: 'capitalize',
  },
  mealImgLayout: {
    borderRadius: 40,
    overflow: 'hidden',
    alignItems: 'center',
    height: 40,
    width: 40,
  },
  addFoodIcon: {
    ...scaled(24),
  },
  addFoodIconView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default React.memo(CustomRecipeItem);
