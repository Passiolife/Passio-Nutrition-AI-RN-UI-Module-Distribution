import React, { useImperativeHandle, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';
import Modal from 'react-native-modal';

import { BasicButton, Card, Text } from '../../../components';
import { useBranding } from '../../../contexts';

interface Props {
  onCreatePress?: (isUpdateUponCreating: boolean, isRecipe?: boolean) => void;
  onEditPress?: (isUpdateUponCreating: boolean, isRecipe?: boolean) => void;
}

export interface AlertCustomFoodRef {
  onShow: (
    refCustomFoodID?: string,
    isRecipe?: boolean,
    isHideLog?: boolean
  ) => void;
  onHide: () => void;
}

const AlertCustomFood = React.forwardRef<AlertCustomFoodRef, Props>(
  (
    { onCreatePress, onEditPress }: Props,
    ref: React.Ref<AlertCustomFoodRef>
  ) => {
    const [isVisible, setVisibility] = useState(false);
    const [isRecipe, setRecipe] = useState(false);
    const [isHideLog, setHideLog] = useState(false);
    const [isUpdateUponCreating, setUpdateUponCreating] = useState(true);
    const [refCustomFoodID, setRefCustomFoodID] = useState<string | undefined>(
      undefined
    );
    const branding = useBranding();

    useImperativeHandle(
      ref,
      () => ({
        onShow: (code, isRecipes = false, isHide = false) => {
          setVisibility(true);
          setRefCustomFoodID(code);
          setRecipe(isRecipes);
          setHideLog(isHide);
          setUpdateUponCreating(!isHide);
        },
        onHide: () => setVisibility(false),
      }),
      []
    );

    if (!isVisible) return null;

    const handleCreatePress = () => {
      onCreatePress?.(isUpdateUponCreating, isRecipe);
      setVisibility(false);
    };

    const handleEditPress = () => {
      onEditPress?.(isUpdateUponCreating, isRecipe);
      setVisibility(false);
    };

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
                  ? 'Do you want to create a new user recipe based on this one, or edit the existing recipe?'
                  : 'Do you want to create a new user food based on this one, or edit the existing user food?'
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
              text="Cancel"
              secondary
            />
            {refCustomFoodID && (
              <BasicButton
                onPress={handleEditPress}
                style={styles.button}
                small
                text="Edit"
              />
            )}
            <BasicButton
              onPress={handleCreatePress}
              style={styles.button}
              small
              text="Create"
            />
          </View>
          {!isHideLog && (
            <View style={styles.buttonContainer}>
              <Text>Update log upon creating?</Text>
              <Switch
                thumbColor={branding.white}
                trackColor={{ true: branding.primaryColor }}
                style={styles.switch}
                value={isUpdateUponCreating}
                onValueChange={setUpdateUponCreating}
              />
            </View>
          )}
        </Card>
      </Modal>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  card: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 8,
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    marginVertical: 3,
    textAlign: 'center',
  },
  description: {
    marginVertical: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  buttonContainers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  switch: {
    marginHorizontal: 8,
  },
});

export default AlertCustomFood;
