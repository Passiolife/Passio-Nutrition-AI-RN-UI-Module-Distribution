import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Image, Modal, StyleSheet, View } from 'react-native';

import { BasicButton, Card, Text } from '..';
import { ICONS } from '../../assets';
import { scaleHeight, scaleWidth } from '../../utils';
interface Props {
  onTryAgain?: () => void;
  onEnterManually?: () => void;
  action?: string;
  note?: string;
  title?: string;
}

export interface NutritionNotFoundModalRef {
  open: () => void;
  close: () => void;
}

export const NutritionNotFoundModal = forwardRef<
  NutritionNotFoundModalRef,
  Props
>((props, ref) => {
  const {
    onTryAgain,
    onEnterManually,
    title = 'No Nutrition Facts Label Found',
    action = 'Enter Manually',
    note = 'Please try again or enter manually',
  } = props;
  const [isVisible, setVisible] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setVisible(true);
    },
    close: () => {
      setVisible(false);
    },
  }));

  if (!isVisible) {
    return null;
  }

  return (
    <Modal visible transparent>
      <View style={styles.modalContainer}>
        <View style={{ flex: 1 }} />
        <Card style={styles.container}>
          <View style={styles.contentContainer}>
            <Text weight="700" size="_20px" style={styles.title}>
              {title}
            </Text>
            <Text style={styles.description}>{note}</Text>
          </View>
          <Image
            source={ICONS.no_nutrition}
            style={{
              height: scaleHeight(200),
              marginVertical: scaleHeight(16),
              alignSelf: 'center',
              width: scaleWidth(200),
            }}
          />
          <View style={styles.buttonContainer}>
            {onTryAgain && (
              <BasicButton
                secondary
                onPress={onTryAgain}
                style={styles.button}
                text={'Try Again'}
              />
            )}
            <BasicButton
              text={action}
              onPress={onEnterManually}
              style={styles.button}
            />
          </View>
        </Card>
        <View style={{ flex: 1 }} />
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: 'white',
    alignContent: 'center',
    paddingHorizontal: scaleWidth(4),
    marginHorizontal: scaleWidth(16),
  },
  contentContainer: {
    flexDirection: 'column',
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 24,
    width: 24,
    marginVertical: 12,
  },
  title: {
    marginTop: 24,
    textAlign: 'center',
  },
  description: {
    marginBottom: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: scaleHeight(16),
    paddingHorizontal: scaleHeight(8),
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  modalContainer: {
    backgroundColor: 'rgba(107, 114, 128, 0.75)',
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
});

export default NutritionNotFoundModal;
