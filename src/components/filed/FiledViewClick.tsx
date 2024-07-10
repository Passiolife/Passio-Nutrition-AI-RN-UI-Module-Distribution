import React, { useImperativeHandle, useState } from 'react';
import { Text } from '..';
import {
  Image,
  KeyboardTypeOptions,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Branding, useBranding } from '../../contexts';
import { scaleHeight } from '../../utils';
import { ICONS } from '../../assets';
import { COLORS } from '../../constants';

interface Props {
  name: string;
  value?: string;
  label?: string;
  keyboardType?: KeyboardTypeOptions;
  isColum?: boolean;
  onValuePress?: () => void;
}

export interface FiledViewClickRef {
  value: () => string | undefined;
  errorCheck: () => boolean | undefined;
}

export const FiledViewClick = React.forwardRef<FiledViewClickRef, Props>(
  (
    { name, value: defaultValue, isColum = false, onValuePress }: Props,
    ref: React.Ref<FiledViewClickRef>
  ) => {
    const branding = useBranding();
    const [value] = useState<string | undefined>(defaultValue);
    const [_error, setError] = useState<string>();

    const styles = requireNutritionFactStyle(branding);

    useImperativeHandle(
      ref,
      () => ({
        value: () => {
          return value;
        },
        errorCheck: () => {
          if (value === undefined || value?.length === 0) {
            setError('please enter value');
          } else {
            setError(undefined);
          }
          return value?.length === 0;
        },
      }),
      [value]
    );

    const renderFiled = () => {
      return (
        <View style={[!isColum && styles.formRow, isColum && styles.formColum]}>
          <Text
            weight="400"
            size="_12px"
            color="gray500"
            style={[styles.label, styles.labelMargin]}
          >
            {name}
          </Text>
          <TouchableOpacity
            style={[styles.textInput, styles.containerTextInput]}
            onPress={() => {
              onValuePress?.();
            }}
          >
            <Text
              color={value || defaultValue ? 'text' : 'secondaryText'}
              style={styles.textInput}
            >
              {defaultValue}
            </Text>
            <Image source={ICONS.camera} style={styles.delete} />
          </TouchableOpacity>
        </View>
      );
    };

    return <View>{renderFiled()}</View>;
  }
);

const requireNutritionFactStyle = ({ white, gray300 }: Branding) =>
  StyleSheet.create({
    formRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    formColum: {
      flexDirection: 'column',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    label: {
      flex: 1,
    },
    labelMargin: {
      marginTop: 10,
    },
    delete: {
      height: 24,
      width: 24,
      marginHorizontal: 6,
      tintColor: COLORS.grey9,
    },
    textInput: {
      fontSize: 14,
      fontWeight: '400',
      alignItems: 'center',
      paddingStart: 4,
      flex: 1,
    },
    containerTextInput: {
      flex: 1,
      flexDirection: 'row',
      textAlign: 'left',
      backgroundColor: white,
      borderColor: gray300,
      borderWidth: 1,
      paddingVertical: scaleHeight(8),
      borderRadius: scaleHeight(4),
    },
  });
