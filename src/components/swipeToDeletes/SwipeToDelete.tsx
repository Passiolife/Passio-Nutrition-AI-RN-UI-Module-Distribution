import React, { useRef } from 'react';
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
  swipeableContainer?: ViewStyle;
}

export const SwipeToDelete: React.FC<Props> = (props) => {
  const swipeableRef = useRef<Swipeable | null>(null);

  const rightActionMealLogView = (
    _: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 50, 50, 50],
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
    <GestureHandlerRootView style={{ marginVertical: scaleHeight(8) }}>
      <Swipeable
        ref={swipeableRef}
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
};

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
    width: 85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBtnBackgroundColor: {
    backgroundColor: '#009aff',
  },
  deleteBtnBackgroundColor: {
    backgroundColor: '#fd3c2f',
  },
});
