import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  TouchableOpacity,
  Animated,
} from 'react-native';
import type { FoodItem } from '../../../../models/FoodItem';
import { caloriesTextForFoodItem } from '../../../../utils/StringUtils';
import { COLORS } from '../../../../constants';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
import { DeleteIngredientAlert } from '../../alerts/DeleteIngredientAlert';
import { content } from '../../../../constants/Content';
import { PassioFoodIcon } from '../../../../components/passio/PassioFoodIcon';
import { round, round2Digit } from '../../../../utils/V3Utils';

interface Props {
  foodItem: FoodItem;
  onPress: (foodItem: FoodItem) => void;
  deleteIngredientsItem: (foodItem: FoodItem) => void;
}

const IngredientView = (props: Props) => {
  const { foodItem, onPress } = props;
  const swipeableRef = useRef<Swipeable | null>(null);

  const onPressDelete = () => {
    DeleteIngredientAlert({
      onClose(): void {},
      onDelete(): void {
        props.deleteIngredientsItem(foodItem);
      },
    });
    swipeableRef.current?.close();
  };

  const rightActionMealLogView = (
    _: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-155, 50, 50, 90],
      outputRange: [0, 90, 2, 10],
    });

    return (
      <Animated.View
        style={[
          styles.actionContainer,
          {
            transform: [{ translateX: scale }],
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            onPress(foodItem);
          }}
        >
          <View style={[styles.swipeableButton, styles.editBtnBackgroundColor]}>
            <Text style={styles.swipeableBtnTxt}>{content.edit}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPressDelete}>
          <View
            style={[styles.swipeableButton, styles.deleteBtnBackgroundColor]}
          >
            <Text style={styles.swipeableBtnTxt}>{content.delete}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        containerStyle={styles.swipeableContainer}
        childrenContainerStyle={styles.swipeableShadowContainer}
        overshootLeft={true}
        renderRightActions={(progressAnimatedValue, dragAnimatedValue) =>
          rightActionMealLogView(progressAnimatedValue, dragAnimatedValue)
        }
      >
        <TouchableOpacity
          style={styles.mealContainer}
          onPress={() => {
            onPress(foodItem);
          }}
          activeOpacity={1}
        >
          <View style={styles.mealImgLayout}>
            <PassioFoodIcon
              iconID={foodItem.iconId}
              style={styles.mealImg}
              entityType={foodItem.entityType}
            />
          </View>
          <View style={styles.mealDetail}>
            <Text style={styles.mealName} numberOfLines={2}>
              {foodItem.name}
            </Text>
            {/* <Text style={styles.mealSize}>{servingLabel(foodItem)}</Text> */}

            <Text
              style={styles.mealSize}
            >{`${round2Digit(foodItem.selectedQuantity)} ${foodItem.selectedUnit} (${round(foodItem.computedWeight.value)} ${foodItem.computedWeight.unit})`}</Text>
          </View>
          <Text style={styles.rightArrowIcon}>
            {caloriesTextForFoodItem(foodItem, content.calories)}
          </Text>
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

export default React.memo(IngredientView);

const styles = StyleSheet.create({
  mealContainer: {
    flexDirection: 'row',
    alignContent: 'space-around',
  },
  mealImgLayout: {
    flexShrink: 0,
    borderRadius: 50,
    overflow: 'hidden',
    height: 50,
    width: 50,
  },
  mealDetail: {
    marginHorizontal: 10,
    flex: 1,
  },
  rightArrowIcon: {
    flexShrink: 0,
    height: 24,
    alignSelf: 'center',
    tintColor: COLORS.grey8,
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
  detailView: {
    justifyContent: 'space-between',
  },
  // SWIPEABLE STYLE
  swipeableBtnTxt: {
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
  swipeableButton: {
    width: 75,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  editBtnBackgroundColor: {
    backgroundColor: '#009aff',
  },
  deleteBtnBackgroundColor: {
    backgroundColor: '#fd3c2f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeableContainer: {
    ...Platform.select({
      ios: {
        marginTop: 0,
      },
      android: {
        marginTop: 0,
        paddingVertical: 5,
        backgroundColor: 'transparent',
        overflow: 'hidden',
      },
    }),
  },
  swipeableShadowContainer: {
    ...Platform.select({
      ios: {
        backgroundColor: 'white',
        paddingHorizontal: 10,
        marginVertical: 5,
        marginHorizontal: 4,
        flex: 1,
      },
      android: {
        backgroundColor: COLORS.white,
        marginVertical: 5,
        paddingHorizontal: 10,
        marginHorizontal: 4,
      },
    }),
  },
  actionContainer: {
    flexDirection: 'row',
  },
  deleteBtnWidth: {
    width: 100,
  },
});
