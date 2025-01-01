import React, { useState, useEffect } from 'react';
import { FlatList, Image, TouchableOpacity } from 'react-native';
import { View, Modal, Pressable } from 'react-native';
import { Text } from '../texts';
import { useBranding } from '../../contexts';
import tutorialStyle from './tutorial.styles';
import { Card } from '../cards';

interface TutorialViewProps extends React.PropsWithChildren {
  isStepActive: boolean;
  top?: boolean;
  bottom?: boolean;
  options: Options[];
  onClose: () => void;
}

interface TutorialMatrix {
  height?: number;
  width?: number;
  x?: number;
  y?: number;
}

export interface Options {
  icon?: number;
  title: string;
  onPress: () => void;
}

export const TutorialView = (props: TutorialViewProps) => {
  const { isStepActive } = props;
  const [isActive, setActive] = useState(isStepActive);
  const styles = tutorialStyle(useBranding());

  useEffect(() => {
    setActive(isStepActive);
  }, [isStepActive]);

  const [matrix, setMatrix] = useState<TutorialMatrix>();

  const handleChildLayout = (e: any) => {
    e.target.measure(
      (
        _x: number,
        _y: number,
        width: number,
        height: number,
        pageX: number,
        pageY: number
      ) => {
        setMatrix({
          height: height,
          width: width,
          x: pageX,
          y: pageY,
        });
      }
    );
  };

  const renderItem = ({ item }: { item: Options }) => {
    const { onPress, title, icon } = item;
    return (
      <TouchableOpacity onPress={onPress} style={styles.optionContainer}>
        {icon && (
          <Image source={icon} style={[styles.optionIcon, styles.iconColor]} />
        )}
        <Text weight="500" size="_16px" color="text" style={styles.optionTitle}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <View onLayout={handleChildLayout}>{props.children}</View>
      {isActive && matrix && (
        <Modal transparent statusBarTranslucent visible={isActive}>
          <Pressable
            onPress={() => {
              setActive(false);
              props.onClose();
            }}
            style={styles.background}
          >
            <View
              style={[
                isActive && {
                  transform: [
                    {
                      translateY: matrix.y ?? 0,
                    },
                    {
                      translateX: matrix.x ?? 0,
                    },
                  ],
                  width: matrix.width ?? 0,
                  height: matrix.height ?? 0,
                },
              ]}
            >
              <>{props.children}</>
            </View>
            <Card
              style={[
                styles.optionMainContainer,
                {
                  transform: [
                    {
                      translateY: (matrix.y ?? 0) - 30,
                    },
                  ],
                },
              ]}
            >
              <FlatList
                data={props.options}
                renderItem={renderItem}
                style={{ maxHeight: 300 }}
                keyExtractor={(__: Options) => __.title.toString()}
              />
            </Card>
          </Pressable>
        </Modal>
      )}
    </>
  );
};
