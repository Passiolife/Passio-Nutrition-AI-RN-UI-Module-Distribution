import React, { useRef } from 'react';
import {
  StyleSheet,
  View,
  Platform,
  TouchableOpacity,
  Animated,
} from 'react-native';
import type { FoodItem } from '../../../../models/FoodItem';
import { COLORS } from '../../../../constants';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
import { DeleteIngredientAlert } from '../../alerts/DeleteIngredientAlert';
import { content } from '../../../../constants/Content';
import { PassioFoodIcon } from '../../../../components/passio/PassioFoodIcon';
import { round, round2Digit } from '../../../../utils/V3Utils';
import { Text } from '../../../../components';
import { totalAmountOfNutrientWithoutRound } from '../../utils';
import { NumberRound } from '../../../../utils/NumberUtils';

interface Props {
  foodItem: FoodItem;
  onPress: (foodItem: FoodItem) => void;
  deleteIngredientsItem: (foodItem: FoodItem) => void;
  enabled?: boolean;
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
        enabled={props.enabled ?? true}
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
            <Text
              size="secondlyTitle"
              color="text"
              weight="600"
              style={styles.mealName}
            >
              {foodItem.name}
            </Text>
            {/* <Text style={styles.mealSize}>{servingLabel(foodItem)}</Text> */}

            <Text
              size="secondlyTitle"
              color="gray500"
              weight="400"
              style={styles.mealSize}
            >{`${round2Digit(foodItem.selectedQuantity)} ${foodItem.selectedUnit} (${round(foodItem.computedWeight.value)} ${foodItem.computedWeight.unit})`}</Text>
          </View>
          <Text
            size="secondlyTitle"
            color="text"
            weight="400"
            style={styles.rightArrowIcon}
          >
            {NumberRound(
              totalAmountOfNutrientWithoutRound([foodItem], 'calories')
            ) + ' kcal'}
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
    justifyContent: 'center',
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
    alignSelf: 'center',
    flex: 1,
  },
  rightArrowIcon: {
    alignSelf: 'center',
  },

  mealImg: {
    height: 50,
    width: 50,
  },
  mealName: {
    textTransform: 'capitalize',
  },
  mealSize: {},
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
    marginVertical: 8,
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
        marginHorizontal: 4,
        flex: 1,
      },
      android: {
        backgroundColor: COLORS.white,
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
