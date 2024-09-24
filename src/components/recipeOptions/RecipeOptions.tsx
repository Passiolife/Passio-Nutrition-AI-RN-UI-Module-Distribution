import React, { useImperativeHandle, useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Branding, useBranding } from '../../contexts';
import { Text } from '..';
import { ICONS } from '../../assets';
import { scaled, scaledSize, scaleHeight, scaleWidth } from '../../utils';
import Modal from 'react-native-modal';

interface Props {
  onTextSearch: () => void;
  onFavorite: () => void;
}

export interface RecipeOptionsRef {
  onClose: () => void;
  onOpen: () => void;
}

export const RecipeOptions = React.forwardRef(
  (
    { onTextSearch, onFavorite }: Props,
    ref: React.Ref<RecipeOptionsRef> | any
  ) => {
    const branding = useBranding();
    const styles = recipeOptionsStyle(branding);
    const [isOpen, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      onClose: () => setOpen(false),
      onOpen: () => setOpen(true),
    }));

    const renderItem = (icon: number, title: string, onPress: () => void) => (
      <Pressable
        onPress={() => {
          setOpen(false);
          onPress();
        }}
        style={styles.optionContainer}
      >
        <Image source={icon} style={styles.optionIcon} resizeMode="contain" />
        <Text weight="500" size="_16px" color="text" style={styles.optionTitle}>
          {title}
        </Text>
      </Pressable>
    );

    if (!isOpen) return null;

    return (
      <Modal statusBarTranslucent isVisible={true} style={styles.modal}>
        <View style={styles.container}>
          <View style={styles.optionWrapper}>
            {renderItem(ICONS.logOptionSearch, 'Text Search', onTextSearch)}
            {renderItem(ICONS.logOptionFavorite, 'Favorite', onFavorite)}
          </View>
          <TouchableOpacity
            onPress={() => setOpen(false)}
            style={styles.addPlusContainer}
          >
            <Image source={ICONS.floatingClose} style={styles.addPlus} />
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
);

const recipeOptionsStyle = ({ white, primaryColor }: Branding) =>
  StyleSheet.create({
    modal: {
      margin: 0, // Set margin to 0 to ensure the modal covers the full screen width
    },
    container: {
      position: 'absolute',
      bottom: 48,
      left: 0,
      right: 0,
    },
    optionWrapper: {
      alignItems: 'center',
    },
    addPlusContainer: {
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: primaryColor,
      ...scaled(52),
      borderRadius: scaleWidth(52 / 2),
      justifyContent: 'center',
      marginVertical: 16,
      alignItems: 'center',
      alignSelf: 'center',
      backgroundColor: primaryColor,
    },
    optionContainer: {
      backgroundColor: white,
      paddingVertical: scaleHeight(12),
      marginVertical: scaleHeight(8),
      flexDirection: 'row',
      borderRadius: scaledSize(24),
      minWidth: scaleWidth(180),
    },
    optionTitle: {
      marginHorizontal: scaleWidth(12),
    },
    optionIcon: {
      height: scaleHeight(20),
      width: scaleWidth(20),
      marginStart: scaleWidth(12),
    },
    addPlus: {
      tintColor: white,
      alignSelf: 'center',
      width: 24,
      height: 24,
      justifyContent: 'center',
    },
  });
