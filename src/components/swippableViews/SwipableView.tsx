import React, { useRef } from 'react';
import {
  Animated,
  Platform,
  type StyleProp,
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

interface Props extends React.PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  onDeletePress: () => void;
  onEditPress: () => void;
}

export const SwipeableView: React.FC<Props> = ({
  children,
  style,
  onDeletePress,
  onEditPress,
}) => {
  const swipeableRef = useRef<Swipeable | null>(null);

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
            swipeableRef.current?.close();
            onEditPress();
          }}
        >
          <View style={[styles.swipeableButton, styles.editBtnBackgroundColor]}>
            <Text style={styles.swipeableBtnTxt}>Edit</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            swipeableRef.current?.close();
            onDeletePress();
          }}
        >
          <View
            style={[styles.swipeableButton, styles.deleteBtnBackgroundColor]}
          >
            <Text style={styles.swipeableBtnTxt}>Delete</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeableRef}
        containerStyle={[styles.swipeableContainer, style]}
        childrenContainerStyle={styles.swipeableShadowContainer}
        overshootLeft={true}
        renderRightActions={rightActionMealLogView}
      >
        {children}
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    ...Platform.select({
      ios: {
        marginTop: 0,
        shadowOffset: { width: 0, height: 1 },
        shadowColor: 'gray',
        paddingVertical: 5,
        shadowOpacity: 0.5,
        elevation: 3,
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
        padding: 10,
        marginHorizontal: 4,
        flex: 1,
      },
      android: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.white,
        padding: 10,
        justifyContent: 'space-between',
        marginHorizontal: 4,
      },
    }),
  },
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
    backgroundColor: 'rgba(79, 70, 229, 1)',
  },
  deleteBtnBackgroundColor: {
    backgroundColor: '#fd3c2f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionContainer: {
    flexDirection: 'row',
  },
  deleteBtnWidth: {
    width: 100,
  },
});
