import React, { useImperativeHandle, useRef, useState } from 'react';
import {
  View,
  Modal,
  Pressable,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { useBranding } from '../../contexts';
import tutorialStyle from './tutorial.styles';
import { ICONS } from '../../assets';
import { scaleHeight } from '../../utils';

interface TutorialViewProps extends React.PropsWithChildren {
  options?: React.JSX.Element;
  isActive?: boolean;
}

interface FloatingMatrix {
  height?: number;
  width?: number;
  x?: number;
  y?: number;
}

export interface FloatingOptionRef {
  onClose: () => void;
  onOpen: () => void;
}

export const FloatingOption = React.forwardRef(
  (props: TutorialViewProps, ref: React.Ref<FloatingOptionRef> | any) => {
    const [isActive, setActive] = useState(props.isActive);
    const styles = tutorialStyle(useBranding());
    const squareRef = useRef<any>(null);
    const measureRef = useRef<FloatingMatrix>({});

    useImperativeHandle(ref, () => {
      return {
        onClose: () => {
          onClose();
        },
        onOpen: () => {
          onOpenPicker();
        },
      };
    });

    const onOpenPicker = () => {
      measureWindow();
    };

    const onClose = () => {
      setActive(false);
    };

    const measureWindow = () => {
      squareRef?.current?.measureInWindow(
        (fx: number, fy: number, width: number, height: number) => {
          const newMeasure: FloatingMatrix = {
            x: fx,
            y: fy,
            width: width,
            height: height,
          };
          measureRef.current = newMeasure;
          setActive(true);
        }
      );
    };

    return (
      <>
        {!isActive ? (
          <Pressable
            ref={squareRef}
            style={styles.addPlusContainer}
            onPress={() => {
              onOpenPicker();
            }}
          >
            <Image source={ICONS.newAddPlus} style={styles.addPlus} />
          </Pressable>
        ) : (
          <View style={styles.blank} />
        )}
        {isActive && (
          <Modal transparent statusBarTranslucent visible={isActive}>
            <Pressable
              onPress={() => {
                setActive(false);
              }}
              style={styles.background}
            >
              <View
                style={[
                  isActive && {
                    transform: [
                      {
                        translateY:
                          (measureRef.current?.y ?? 0) +
                          (Platform.OS === 'ios' ? scaleHeight(30) : 60),
                      },
                      {
                        translateX: measureRef.current?.x ?? 0,
                      },
                    ],
                  },
                ]}
              >
                <>
                  <View style={styles.addPlusContainer}>
                    <Image
                      source={ICONS.floatingClose}
                      style={styles.addPlus}
                    />
                  </View>
                </>
              </View>

              <View
                style={[
                  styles.optionsContainer,
                  {
                    bottom:
                      Dimensions.get('window').height -
                      (measureRef.current?.y ?? 0) +
                      60,
                  },
                ]}
              >
                <>{props.options}</>
              </View>
            </Pressable>
          </Modal>
        )}
      </>
    );
  }
);
