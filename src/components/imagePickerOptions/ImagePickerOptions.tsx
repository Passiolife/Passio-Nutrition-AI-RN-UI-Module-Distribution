import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              marginEnd: 16,
            }}
            onPress={onCloseModel}
          >
            <Image source={ICONS.newClose} style={styles.closeButton} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onSelectGallery}>
            <Text style={styles.buttonText}>Select Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={onSelectCamera}>
            <Text style={styles.buttonText}>Select Camera</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    minWidth: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    marginVertical: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderColor: COLORS.blue,
    borderWidth: 1,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
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
