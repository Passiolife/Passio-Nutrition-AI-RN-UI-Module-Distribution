import React, { useImperativeHandle, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

import { BasicButton, Card, Text } from '../../../components';
import Modal from 'react-native-modal';
import { useBranding } from '../../../contexts';
interface Props {
  onCreatePress?: (isUpdateUponCreating: boolean, isRecipe?: boolean) => void;
  onEditPress?: (isUpdateUponCreating: boolean, isRecipe?: boolean) => void;
}

export interface AlertCustomFoodRef {
  onShow: (refCustomFoodID?: string, isRecipe?: boolean) => void;
  onHide: () => void;
}
export const AlertCustomFood = React.forwardRef<AlertCustomFoodRef, Props>(
  (
    { onCreatePress, onEditPress }: Props,
    ref: React.Ref<AlertCustomFoodRef>
  ) => {
    const [isVisible, setVisibility] = useState(false);
    const [isRecipe, setRecipe] = useState(false);
    const [isUpdateUponCreating, setUpdateUponCreating] = useState(true);
    const [refCustomFoodID, setRefCustomFoodID] = useState<string | undefined>(
      undefined
    );
    const branding = useBranding();

    useImperativeHandle(
      ref,
      () => ({
        onShow: (code, isRecipes) => {
          setVisibility(true);
          setRefCustomFoodID(code);
          setRecipe(isRecipes ?? false);
        },
        onHide: () => {
          setVisibility(false);
        },
      }),
      []
    );
    if (!isVisible) {
      return <></>;
    }
    return (
      <Modal
        backdropOpacity={0.4}
        isVisible={isVisible}
        style={styles.container}
      >
        <Card style={styles.card}>
          <View style={styles.contentContainer}>
            <Text weight="700" size="_20px" style={styles.title}>
              {isRecipe ? 'Create User Recipe' : 'Create User Food?'}
            </Text>
            <Text color="gray500" weight="400" style={styles.description}>
              {refCustomFoodID
                ? isRecipe
                  ? 'Do you want to create a new user recipe based off this one, or edit the existing recipe?'
                  : 'Do you want to create a new user food based off this one, or edit the existing user food?'
                : isRecipe
                  ? 'You are about to create a user recipe from this food'
                  : 'You are about to create a user food from this food'}
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
            {refCustomFoodID && (
              <BasicButton
                onPress={() => {
                  onEditPress?.(isUpdateUponCreating, isRecipe);
                  setVisibility(false);
                }}
                style={styles.button}
                small
                text={'Edit'}
              />
            )}
            <BasicButton
              onPress={() => {
                onCreatePress?.(isUpdateUponCreating, isRecipe);
                setVisibility(false);
              }}
              style={styles.button}
              small
              text={'Create'}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Text>Update log upon creating?</Text>
            <Switch
              thumbColor={branding.white}
              trackColor={{
                true: branding.primaryColor,
              }}
              style={{ marginHorizontal: 8 }}
              value={isUpdateUponCreating}
              onValueChange={setUpdateUponCreating}
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

export default AlertCustomFood;
