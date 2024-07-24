import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from 'react-native';
import { ICONS } from '../../assets';
import { COLORS } from '../../constants';

interface Props {
  onCloseModel: () => void;
  onSelectGallery: () => void;
  onSelectCamera: () => void;
}
const ImagePickerOptions = ({
  onCloseModel,
  onSelectCamera,
  onSelectGallery,
}: Props) => {
  return (
    <Modal transparent={true} visible={true} onRequestClose={onCloseModel}>
      <Pressable onPress={onCloseModel} style={styles.modalOverlay}>
        <Pressable style={styles.modalContent}>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              marginEnd: 16,
            }}
            onPress={onCloseModel}
          >
            <Image
              source={ICONS.newClose}
              tintColor={COLORS.grayscaleLine}
              style={styles.closeButton}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onSelectGallery}>
            <Image
              source={ICONS.camera}
              tintColor={COLORS.grayscaleLine}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Select Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onSelectCamera}>
            <Image
              source={ICONS.gallery}
              tintColor={COLORS.grayscaleLine}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Select Camera</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    padding: 20,
    margin: 2,
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 42,
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: COLORS.grayscaleLine,
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
  },
  buttonIcon: {
    height: 24,
    width: 24,
    marginEnd: 16,
  },
  closeButton: {
    height: 32,
    width: 32,
  },
  closeButtonText: {
    fontSize: 16,
  },
});

export default ImagePickerOptions;
