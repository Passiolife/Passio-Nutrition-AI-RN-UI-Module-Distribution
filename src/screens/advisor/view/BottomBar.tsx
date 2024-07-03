import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { ICONS } from '../../../assets';

interface BottomBarProps {
  inputValue: string;
  textInputChnageHandler: (val: string) => void;
  sendBtnHandler: () => void;
  plusIconHandler?: () => void;
  onImagePicker?: () => void;
  onGalleryPicker?: () => void;
  sending: boolean;
  isOptionShow?: boolean;
}

export const BottomBar = ({
  isOptionShow,
  inputValue,
  sendBtnHandler,
  textInputChnageHandler,
  plusIconHandler,
  onImagePicker,
  onGalleryPicker,
  sending,
}: BottomBarProps) => {
  const styles = BottomBarStyle();
  return (
    <View style={styles.row}>
      <View style={[styles.inputContainer]}>
        {inputValue.length === 0 && (
          <>
            {isOptionShow ? (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={onImagePicker}
                  style={[styles.button, styles.camera]}
                >
                  <Image
                    source={ICONS.camera}
                    tintColor={'white'}
                    resizeMode="contain"
                    style={styles.plusIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onGalleryPicker}
                  style={[styles.button, styles.gallery]}
                >
                  <Image
                    source={ICONS.gallery}
                    tintColor={'white'}
                    resizeMode="contain"
                    style={styles.plusIcon}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={plusIconHandler}
                style={[styles.button, styles.plusIconView]}
              >
                <Image
                  source={ICONS.newAddPlus}
                  tintColor={'white'}
                  resizeMode="contain"
                  style={styles.plusIcon}
                />
              </TouchableOpacity>
            )}
          </>
        )}
        <TextInput
          placeholder="Type your message here..."
          style={styles.input}
          value={inputValue}
          onChangeText={(val) => textInputChnageHandler(val)}
        />
      </View>
      <View>
        {sending ? (
          <ActivityIndicator style={styles.sendBtn} />
        ) : (
          <TouchableOpacity
            onPress={sendBtnHandler}
            disabled={inputValue.length === 0}
            style={[
              styles.sendBtn,
              inputValue.length === 0 && styles.disableSend,
            ]}
          >
            <Text style={styles.sendBtnText}>Send</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Styles for the component
const BottomBarStyle = () =>
  StyleSheet.create({
    row: {
      flexDirection: 'row',
      height: 50,
      alignItems: 'center',
    },
    disableSend: {
      opacity: 0.7,
    },
    inputContainer: {
      flex: 1,
      flexDirection: 'row',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: '#D1D5DB',
      padding: 1,
      height: '100%',
    },
    plusIcon: {
      width: 14,
      height: 14,
    },
    plusIconView: {},
    button: {
      paddingHorizontal: 14,
      backgroundColor: '#4F46E5',
      borderRadius: 4,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    gallery: {
      marginStart: 4,
    },
    camera: {},
    input: {
      flex: 1,
      fontSize: 14,
      fontWeight: '400',
      backgroundColor: 'white',
      paddingHorizontal: 16,
    },
    sendBtn: {
      paddingHorizontal: 16,
      backgroundColor: '#4F46E5',
      borderRadius: 6,
      marginStart: 8,
      minWidth: 60,
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendBtnText: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      color: '#fff',
    },
  });
