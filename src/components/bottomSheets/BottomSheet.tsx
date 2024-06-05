import React, { useState } from 'react';
import {
  Animated,
  Dimensions,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import {
  type GestureEvent,
  PanGestureHandler,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import { COLORS } from '../../constants';

interface BottomSheetProps extends React.PropsWithChildren {
  style?: StyleProp<ViewStyle>;
  isSticky?: boolean;
  minHeight: number;
  maxHeight: number;
  background?: string;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isSticky,
  children,
  style,
  minHeight,
  maxHeight,
  background = COLORS.white55,
}) => {
  const minimum = Dimensions.get('screen').height - minHeight;
  const maximum = Dimensions.get('screen').height - maxHeight;
  const [translationY, setTranslationY] = useState<number>(minimum);
  const [isVertical, setIsVertical] = useState<boolean>(false);
  const handleGesture = (evt: GestureEvent) => {
    let { absoluteY } = evt.nativeEvent;
    if (typeof absoluteY === 'number') {
      if (absoluteY > maximum) {
        setTranslationY(absoluteY);
      } else if (isVertical) {
        setTranslationY(maximum);
      }
      setIsVertical(absoluteY <= 0 || absoluteY < translationY);
    }
  };
  const onEnded = () => {
    if (isVertical) {
      setTranslationY(maximum);
    } else {
      setTranslationY(minimum);
    }
  };

  const extraBar = isSticky ? 40 : 0;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: translationY - extraBar }],
        },
        {
          backgroundColor: background,
        },
        style,
      ]}
    >
      <GestureHandlerRootView>
        <PanGestureHandler onGestureEvent={handleGesture} onEnded={onEnded}>
          <View>
            <View style={styles.barContainer}>
              <View style={styles.bar} />
            </View>
          </View>
        </PanGestureHandler>
      </GestureHandlerRootView>
      {children}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  main: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'red',
  },
  container: {
    position: 'absolute',
    width: '100%',
    alignSelf: 'center',
    shadowColor: 'black',
    zIndex: 1000,
    shadowOffset: { width: 0, height: 30 },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    padding: 5,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  barContainer: {
    width: '100%',
    justifyContent: 'center',
    height: 60,
  },
  bar: {
    width: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignSelf: 'center',
    borderColor: COLORS.grey3,
  },
});
