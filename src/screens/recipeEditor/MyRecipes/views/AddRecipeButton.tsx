import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { COLORS } from '../../../../constants';
import { rounded_plus_white_x4 } from '../../../../assets';

let { width } = Dimensions.get('window');

interface AddRecipeBtnProps {
  onPressBtn: () => void;
}

const AddRecipeButton = (props: AddRecipeBtnProps) => {
  const { onPressBtn } = props;
  return (
    <TouchableOpacity onPress={onPressBtn} style={styles.btnContainer}>
      <Image source={rounded_plus_white_x4} style={styles.btnIcon} />
      <Text style={styles.btnText}>Add Recipe</Text>
    </TouchableOpacity>
  );
};

export default AddRecipeButton;

const styles = StyleSheet.create({
  btnContainer: {
    width: width / 1.5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.blue,
    alignSelf: 'center',
    borderRadius: 24.5,
    flexDirection: 'row',
  },
  btnText: {
    color: COLORS.white,
    fontSize: 14,
  },
  btnIcon: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
});
