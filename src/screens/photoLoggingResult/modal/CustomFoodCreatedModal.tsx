import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { BasicButton, Text } from '../../../components';
import { scaleHeight, scaleWidth } from '../../../utils';
import type { Branding } from '../../../contexts';
import { useBranding } from '../../../contexts';

export interface CustomFoodCreatedModalProps {}

export interface CustomFoodCreatedModalRef {
  open: () => void;
}
export const CustomFoodCreatedModal = forwardRef<
  CustomFoodCreatedModalRef,
  CustomFoodCreatedModalProps
>((_props, ref) => {
  const [isOpen, setOpen] = useState(false);
  const branding = useBranding();
  const styles = customStyles(branding);

  useImperativeHandle(ref, () => ({
    open: async () => {
      setOpen(true);
    },
  }));

  if (!isOpen) {
    return null;
  }

  return (
    <Modal visible transparent>
      <View style={styles.modalContainer}>
        <View style={{ flex: 1 }} />
        <View style={[styles.card]}>
          <Text size={'_20px'} weight={'700'} style={styles.title}>
            A Custom Food Has Been Created
          </Text>

          <Text weight="400" size="_14px" style={{ textAlign: 'center' }}>
            The edits have been saved for future logs. You can edit this item
            from your
            <Text weight="700" size="_14px">
              {' My Foods '}
            </Text>
            <Text weight="400" size="_14px">
              list
            </Text>
          </Text>
          <View style={styles.buttonContainer}>
            <BasicButton
              text={'Okay'}
              onPress={() => {
                setOpen(false);
              }}
              style={{ flex: 1, marginEnd: 8, maxWidth: scaleWidth(200) }}
            />
          </View>
        </View>
        <View style={{ flex: 1 }} />
      </View>
    </Modal>
  );
});

const customStyles = ({ white }: Branding) =>
  StyleSheet.create({
    row: { flexDirection: 'row' },
    slider: {
      marginVertical: 16,
      width: '100%',
    },
    card: {
      alignItems: 'center',
      padding: scaleWidth(16),
      backgroundColor: white,
      marginHorizontal: 8,
      paddingVertical: 8,
      borderRadius: 8,
      shadowColor: '#00000029',
      shadowOpacity: 1,
      shadowOffset: {
        width: 1.0,
        height: 2.0,
      },
      shadowRadius: 0.5,
      elevation: 1,
    },

    buttonContainer: {
      flexDirection: 'row',
      marginBottom: 16,
      marginTop: scaleHeight(16),
    },
    title: { alignSelf: 'center', marginVertical: 16 },
    modalContainer: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      flex: 1,
    },
  });
