import React, { useImperativeHandle, useState } from 'react';
import { Text, TextInput } from '..';
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

interface Props {
  name: string;
  value?: string;
  label?: string;
  keyboardType?: KeyboardTypeOptions;
  isColum?: boolean;
  onDelete?: () => void;
}

export interface FiledViewRef {
  value: () => string | undefined;
  errorCheck: () => boolean | undefined;
}

export const FiledView = React.forwardRef<FiledViewRef, Props>(
  (
    {
      name,
      value: defaultValue,
      keyboardType = 'decimal-pad',
      label = 'value',
      isColum = false,
      onDelete,
    }: Props,
    ref: React.Ref<FiledViewRef>
  ) => {
    const branding = useBranding();
    const [value, setValue] = useState<string | undefined>(defaultValue);
    const [error, setError] = useState<string>();

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
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => {
              setValue(text);
              setError(undefined);
            }}
            value={defaultValue}
            containerStyle={styles.containerTextInput}
            placeholder={label}
            error={error}
            enterKeyHint="next"
            keyboardType={keyboardType}
          />
          {onDelete && (
            <TouchableOpacity onPress={onDelete}>
              <Image source={ICONS.delete} style={styles.delete} />
            </TouchableOpacity>
          )}
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
    },
    textInput: {
      textAlign: 'left',
      flex: 1,
      fontWeight: '400',
      fontSize: 14,
      backgroundColor: white,
      borderColor: gray300,
      paddingVertical: scaleHeight(8),
      borderRadius: scaleHeight(4),
    },
    containerTextInput: {
      flex: 1,
    },
  });
