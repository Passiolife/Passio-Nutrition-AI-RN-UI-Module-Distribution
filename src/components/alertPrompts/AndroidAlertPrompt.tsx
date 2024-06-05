import { useBranding } from '../../contexts';
import React, { useState } from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Props } from './AlertPrompt';

export const AndroidAlertPrompt: React.FC<Props> = (props) => {
  const [textInputValue, setTextInputValue] = useState<string>('');
  const brandingContex = useBranding();

  return (
    <View style={styles.centeredView}>
      <Modal animationType="fade" transparent={true} visible={props.visible}>
        <View style={styles.centeredView}>
          <View
            style={
              Platform.OS === 'ios' ? styles.modalView : styles.modalViewAndroid
            }
          >
            <View style={styles.TextHeaderModalViews}>
              <Text style={styles.HeaderText}>{props.title}</Text>
              <Text style={styles.subLineText}>{props.message}</Text>
            </View>
            <View style={styles.TextInputStyle}>
              <TextInput
                value={textInputValue}
                keyboardType={props.keyboardType}
                placeholder={props.hint}
                onChangeText={(val) => setTextInputValue(val)}
              />
            </View>
            <View style={styles.modalBtnStyle}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={props.onCancel}
              >
                <Text
                  style={[
                    styles.textStyle,
                    { color: brandingContex.primaryColor },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => props.onSave(textInputValue)}
                disabled={textInputValue === '' ? true : false}
              >
                <Text
                  style={[
                    styles.textStyle,
                    { color: brandingContex.primaryColor },
                  ]}
                >
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',

    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 320,
    width: 400,
  },
  modalViewAndroid: {
    backgroundColor: 'white',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: 200,
    width: 300,
  },
  button: {
    justifyContent: 'flex-end',
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {},
  textStyle: {
    fontWeight: '400',
    textAlign: 'center',
    marginLeft: 15,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalBtnStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    top: 55,
    overflow: 'hidden',
  },
  centerHeaderStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 170,
  },
  TextInputStyle: {
    height: 40,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: 'grey',
    top: 24,
    paddingHorizontal: 16,
  },
  TextHeaderModalViews: {
    justifyContent: 'flex-start',
  },
  HeaderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  subLineText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
