import React, { useState, useRef, useImperativeHandle } from 'react';
import { View, Modal, Pressable, Platform } from 'react-native';
import { useBranding } from '../../contexts';
import tutorialStyle from './picker.styles';
import { Card } from '../cards';
import { scaleWidth, screenHeight } from '../../utils';

interface PickerProps extends React.PropsWithChildren {
  top?: boolean;
  bottom?: boolean;
  options: React.JSX.Element;
  extraWidth?: number;
  isCenter?: boolean;
}
export interface PickerRef {
  onClose: () => void;
  onOpen: () => void;
}

interface Matrix {
  height?: number;
  width?: number;
  x?: number;
  y?: number;
}

export const Picker = React.forwardRef(
  (props: PickerProps, ref: React.Ref<PickerRef> | any) => {
    const [isActive, setActive] = useState(false);
    const styles = tutorialStyle(useBranding());
    const squareRef = useRef<any>(null);
    const measureRef = useRef<Matrix>({});

    useImperativeHandle(ref, () => {
      return {
        onClose: () => {
          setActive(false);
        },
        onOpen: () => {
          setActive(true);
        },
      };
    });

    const measureWindow = () => {
      squareRef?.current?.measureInWindow(
        (fx: number, fy: number, width: number, height: number) => {
          const newMeasure: Matrix = {
            x: fx,
            y: props.isCenter ? screenHeight / 2 : fy,
            width: width,
            height: height,
          };
          measureRef.current = newMeasure;
          setActive(true);
        }
      );
    };

    const onOpenPicker = () => {
      measureWindow();
    };

    const onClose = () => {
      setActive(false);
    };

    return (
      <>
        <Pressable onPress={onOpenPicker} ref={squareRef} style={{ flex: 1 }}>
          {props.children}
        </Pressable>
        {isActive && (
          <Modal transparent statusBarTranslucent visible={isActive}>
            <Pressable onPress={onClose} style={styles.background}>
              <View
                style={[
                  isActive && {
                    transform: [
                      {
                        translateY:
                          (measureRef.current?.y ?? 0) +
                          (Platform.OS === 'ios'
                            ? 0
                            : (measureRef.current?.height ?? 0) - 4),
                      },
                      {
                        translateX:
                          measureRef.current?.x ?? 0 - (props.extraWidth ?? 0),
                      },
                    ],
                    width: measureRef.current?.width ?? 0,
                  },
                ]}
              >
                <Card
                  style={[
                    styles.optionMainContainer,
                    { maxHeight: 300 },
                    {
                      width:
                        (measureRef.current?.width ??
                          0 + (props.extraWidth ?? 0)) - scaleWidth(12),
                    },
                  ]}
                >
                  {props.options}
                </Card>
              </View>
            </Pressable>
          </Modal>
        )}
      </>
    );
  }
);
