import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import type { ActionSheetType } from 'src/constants';
import styles from './styles';

const closeIcon = require('../../assets/ic_close_blue.png');

interface Props {
  modalVisible: boolean;
  onCloseActionSheet: () => void;
  actionSheetData: Array<ActionSheetType>;
  onPressOptionItem?: (i: number) => void;
  onPressAction?: (action: ActionSheetType) => void;
  modalTitle?: string;
}

const ActionSheet: React.FC<Props> = (props) => {
  const {
    modalVisible,
    onCloseActionSheet,
    actionSheetData,
    onPressOptionItem,
    onPressAction,
    modalTitle,
  } = props;
  return (
    <Modal
      animationType="slide"
      transparent={true}
      statusBarTranslucent
      visible={modalVisible}
      onRequestClose={() => {
        onCloseActionSheet();
      }}
    >
      <TouchableWithoutFeedback onPress={() => onCloseActionSheet()}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.actionHeader}>
              {modalTitle !== undefined ? (
                <Text style={styles.modalText}>{modalTitle}</Text>
              ) : (
                <View />
              )}

              <TouchableOpacity
                style={styles.iconLayout}
                onPress={() => onCloseActionSheet()}
              >
                <Image source={closeIcon} style={styles.closeIcon} />
              </TouchableOpacity>
            </View>

            <View style={styles.listContainer}>
              {actionSheetData.map((val, index) => {
                return (
                  <TouchableOpacity
                    key={index.toString()}
                    onPress={() => {
                      if (onPressOptionItem) {
                        onPressOptionItem(index);
                      }
                      if (onPressAction) {
                        onPressAction(val);
                      }
                    }}
                    style={styles.actionItem}
                  >
                    {val.icon !== null && (
                      <Image
                        source={val.icon}
                        resizeMode="contain"
                        style={styles.itemImg}
                      />
                    )}
                    <Text style={styles.itemText}>{val.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default React.memo(ActionSheet);
