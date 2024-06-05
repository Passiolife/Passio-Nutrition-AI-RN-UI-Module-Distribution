import React from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { useBranding } from '../../contexts';
import type { Branding } from '../../contexts';
import { scaledSize, scaleHeight } from '../../utils';
import { Text } from '../texts';
import type { SwitchTabLabelEnum } from '../../types';

interface SwitchTabProps {
  containerStyle?: StyleProp<ViewStyle>;
  label1: SwitchTabLabelEnum;
  label2: SwitchTabLabelEnum;
  onChangeSwitch: (val: SwitchTabLabelEnum) => void;
  selectedSwitch: SwitchTabLabelEnum;
}

export const SwitchTab = React.memo(
  ({
    containerStyle,
    label1,
    label2,
    onChangeSwitch,
    selectedSwitch,
  }: SwitchTabProps) => {
    const styles = switchTabStyle(useBranding());
    return (
      <View style={[styles.container, containerStyle]}>
        <TouchableOpacity
          onPress={() => onChangeSwitch(label1)}
          style={[
            styles.buttonView,
            selectedSwitch === label1 && styles.selectedButtonStyle,
          ]}
        >
          <Text
            weight="500"
            size="_14px"
            color={selectedSwitch === label1 ? 'white' : 'text'}
          >
            {label1}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onChangeSwitch(label2)}
          style={[
            styles.buttonView,
            selectedSwitch === label2 && styles.selectedButtonStyle,
          ]}
        >
          <Text
            weight="500"
            size="_14px"
            color={selectedSwitch === label2 ? 'white' : 'text'}
          >
            {label2}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
);

const switchTabStyle = ({ white, primaryColor, black }: Branding) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderRadius: scaledSize(6),
      backgroundColor: white,
      //   SHADOW
      shadowColor: black,
      shadowOffset: {
        width: 0,
        height: 1.5,
      },
      shadowOpacity: 0.25,
      shadowRadius: 1.84,
      elevation: 2,
    },
    buttonView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: scaleHeight(9),
      backgroundColor: white,
      borderRadius: scaledSize(6),
    },
    selectedButtonStyle: {
      backgroundColor: primaryColor,
    },
  });
