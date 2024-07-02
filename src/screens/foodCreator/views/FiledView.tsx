import React, { useImperativeHandle, useState } from 'react';
import { Text, TextInput } from '../../../components';
import { KeyboardTypeOptions, StyleSheet, View } from 'react-native';
import { Branding, useBranding } from '../../../contexts';
import { scaleHeight } from '../../../utils';

interface Props {
  name: string;
  value?: string;
  label?: string;
  keyboardType?: KeyboardTypeOptions;
  isColum?: boolean;
}

interface FiledViewRef {
  value?: () => string | undefined;
}

export const FiledView = React.forwardRef<FiledViewRef, Props>(
  (
    {
      name,
      value: defaultValue,
      keyboardType = 'numeric',
      label = 'value',
      isColum = false,
    }: Props,
    ref: React.Ref<FiledViewRef>
  ) => {
    const branding = useBranding();
    const [value, setValue] = useState<string | undefined>(defaultValue);

    const styles = requireNutritionFactStyle(branding);

    useImperativeHandle(
      ref,
      () => ({
        value: () => {
          return value;
        },
      }),
      [value]
    );

    const renderFiled = () => {
      return (
        <View style={[styles.formRow, isColum && styles.formColum]}>
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
            onChangeText={setValue}
            value={defaultValue}
            containerStyle={styles.containerTextInput}
            placeholder={label}
            keyboardType={keyboardType}
          />
        </View>
      );
    };

    return <View>{renderFiled()}</View>;
  }
);

const requireNutritionFactStyle = ({ white, border }: Branding) =>
  StyleSheet.create({
    formRow: {
      flexDirection: 'row',
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
    textInput: {
      textAlign: 'left',
      flex: 1,
      fontWeight: '400',
      fontSize: 14,
      backgroundColor: white,
      borderColor: border,
      paddingVertical: scaleHeight(8),
      borderRadius: scaleHeight(4),
    },
    containerTextInput: {
      flex: 1,
    },
  });
