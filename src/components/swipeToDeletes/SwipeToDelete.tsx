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
import { scaleHeight } from '../../utils';
import type { Branding } from '../../contexts';
import { useBranding } from '../../contexts';

interface Props extends React.PropsWithChildren {
  onPressDelete: () => void;
  onPressEdit?: () => void;
  swipeableContainer?: ViewStyle;
  childrenContainerStyle?: ViewStyle;
  marginVertical?: number;
  action1?: string;
}
export interface SwipeToDeleteRef {
  closeSwipe: () => void;
}

export const SwipeToDelete = React.forwardRef<SwipeToDeleteRef, Props>(
  (props: Props, ref: React.Ref<SwipeToDeleteRef>) => {
    const swipeReg = useRef<Swipeable | null>(null);

    const branding = useBranding();
    const styles = stylesObj(branding);

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
              <Text style={styles.swipeableBtnTxt}>
                {props.action1 ?? 'Edit'}
              </Text>
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
          childrenContainerStyle={[
            styles.shadowContainer,
            props.childrenContainerStyle,
          ]}
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

const stylesObj = ({ primaryColor, error, card }: Branding) =>
  StyleSheet.create({
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
      backgroundColor: card,
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
      backgroundColor: primaryColor,
    },
    deleteBtnBackgroundColor: {
      backgroundColor: error,
      overflow: 'hidden',
    },
    editBtnBackground: {
      backgroundColor: primaryColor,
    },
  });
