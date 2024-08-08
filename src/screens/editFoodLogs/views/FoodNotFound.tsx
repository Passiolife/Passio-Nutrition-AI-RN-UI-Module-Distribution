import React, { useImperativeHandle, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { BasicButton, Card, Text } from '../../../components';
import Modal from 'react-native-modal';
interface Props {
  onCreatePress?: (isUpdateUponCreating?: boolean) => void;
}

export interface FoodNotFoundRef {
  onShow: (refCustomFoodID?: string) => void;
  onHide: () => void;
}
export const FoodNotFound = React.forwardRef<FoodNotFoundRef, Props>(
  ({ onCreatePress }: Props, ref: React.Ref<FoodNotFoundRef>) => {
    const [isVisible, setVisibility] = useState(false);

    useImperativeHandle(
      ref,
      () => ({
        onShow: () => {
          setVisibility(true);
        },
        onHide: () => {
          setVisibility(false);
        },
      }),
      []
    );

    return (
      <Modal
        backdropOpacity={0.4}
        isVisible={isVisible}
        style={styles.container}
      >
        <Card style={styles.card}>
          <View style={styles.contentContainer}>
            <Text weight="700" size="_20px" style={styles.title}>
              Food Not Found
            </Text>
            <Text color="gray500" weight="400" style={styles.description}>
              The custom food you are trying to edit no longer exists. You can
              continue to create a new one.
            </Text>
          </View>
          <View style={styles.buttonContainers}>
            <BasicButton
              onPress={() => setVisibility(false)}
              style={styles.button}
              small
              text={'Cancel'}
              secondary
            />
            <BasicButton
              onPress={() => {
                onCreatePress?.();
                setVisibility(false);
              }}
              style={styles.button}
              small
              text={'Create'}
            />
          </View>
        </Card>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 8,
    alignContent: 'center',

    alignSelf: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 32,
    width: 32,
    marginVertical: 8,
  },
  title: {
    marginVertical: 3,
    textAlign: 'center',
  },
  description: {
    marginBottom: 16,
    marginVertical: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
  },
  buttonContainers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'space-around',
    marginVertical: 16,
  },
  iconContainer: {
    alignItems: 'center',
    flex: 1,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
});

export default FoodNotFound;
