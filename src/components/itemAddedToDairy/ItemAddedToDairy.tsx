import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Image, Modal, StyleSheet, View } from 'react-native';

import { BasicButton, Card, Text } from '../../components';
import { ICONS } from '../../assets';
import { scaleHeight, scaleWidth } from '../../utils';
interface Props {
  onViewDiaryPress?: () => void;
  onContinuePress?: () => void;
  action?: string;
  note?: string;
  title?: string;
}

export interface ItemAddedToDairyViewModalRef {
  open: () => void;
  close: () => void;
}

export const ItemAddedToDairyViewModal = forwardRef<
  ItemAddedToDairyViewModalRef,
  Props
>((props, ref) => {
  const {
    onViewDiaryPress,
    onContinuePress,
    title = 'Item Added To Diary',
    action = 'Continue Scanning',
    note = 'View your diary or add more',
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
        <Card style={styles.container}>
          <View style={styles.contentContainer}>
            <Image source={ICONS.addedToDiary} style={styles.icon} />
            <Text weight="700" size="_20px" style={styles.title}>
              {title}
            </Text>
            <Text style={styles.description}>{note}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <BasicButton
              secondary
              onPress={onViewDiaryPress}
              style={styles.button}
              text={'View Diary'}
            />
            <BasicButton
              text={action}
              onPress={onContinuePress}
              style={styles.button}
            />
          </View>
        </Card>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'white',
    bottom: 40,
    paddingVertical: scaleHeight(16),
    paddingHorizontal: scaleHeight(8),
    borderRadius: scaleHeight(16),
    right: 8,
    left: 8,
  },
  contentContainer: {
    flexDirection: 'column',
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: scaleHeight(36),
    width: scaleWidth(36),
    marginVertical: 12,
  },
  title: {
    marginVertical: 3,
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

export default ItemAddedToDairyViewModal;
