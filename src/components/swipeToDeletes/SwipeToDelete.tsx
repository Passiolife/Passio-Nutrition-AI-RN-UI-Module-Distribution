import React, { useImperativeHandle, useRef } from 'react';
import {
  Animated,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';
import { COLORS } from '../../constants';
import { scaleHeight } from '../../utils';

interface Props extends React.PropsWithChildren {
  onPressDelete: () => void;
  onPressEdit?: () => void;
  swipeableContainer?: ViewStyle;
  marginVertical?: number;
}
interface SwipeToDeleteRef {
  closeSwipe: () => void;
}

export const SwipeToDelete = React.forwardRef<SwipeToDeleteRef, Props>(
  (props: Props, ref: React.Ref<SwipeToDeleteRef>) => {
    const swipeReg = useRef<Swipeable | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        closeSwipe: () => {
          return swipeReg.current?.close();
        },
      }),
      []
    );

    const rightActionMealLogView = (
      _: Animated.AnimatedInterpolation<number>,
      dragX: Animated.AnimatedInterpolation<number>
    ) => {
      const scale = dragX.interpolate({
        inputRange: [-150, 30, 30, 30],
        outputRange: [0, 0, 2, 10],
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
            style={styles.editBtnBackground}
            onPress={() => {
              swipeReg?.current?.close();
              props.onPressEdit?.();
            }}
          >
            <View style={[styles.swipeableButton]}>
              <Text style={styles.swipeableBtnTxt}>Edit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteBtnBackgroundColor}
            onPress={props.onPressDelete}
          >
            <View style={[styles.swipeableButton]}>
              <Text style={styles.swipeableBtnTxt}>Delete</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>
      );
    };

    let swipeableContainer = [
      {
        ...styles.swipeableContainer,
        ...(props.swipeableContainer ? props.swipeableContainer : null),
      },
    ];
    return (
      <GestureHandlerRootView
        style={{ marginVertical: scaleHeight(props.marginVertical ?? 8) }}
      >
        <Swipeable
          ref={swipeReg}
          containerStyle={swipeableContainer}
          childrenContainerStyle={styles.shadowContainer}
          overshootLeft={true}
          renderRightActions={(progressAnimatedValue, dragAnimatedValue) =>
            rightActionMealLogView(progressAnimatedValue, dragAnimatedValue)
          }
        >
          {props.children}
        </Swipeable>
      </GestureHandlerRootView>
    );
  }
);

const styles = StyleSheet.create({
  swipeableContainer: {
    ...Platform.select({
      ios: {},
      android: {
        backgroundColor: 'transparent',
        overflow: 'hidden',
      },
    }),
  },
  shadowContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  actionContainer: {
    flexDirection: 'row',
  },
  swipeableBtnTxt: {
    color: 'white',
    fontWeight: '600',
  },
  swipeableButton: {
    flex: 1,
    minWidth: 85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtnBackgroundColor: {
    backgroundColor: '#009aff',
  },
  deleteBtnBackgroundColor: {
    backgroundColor: '#fd3c2f',
    overflow: 'hidden',
  },
  editBtnBackground: {
    backgroundColor: '#4F46E5',
  },
});
