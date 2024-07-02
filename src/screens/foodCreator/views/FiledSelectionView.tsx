import React, { useImperativeHandle, useState } from 'react';
import { Text } from '../../../components';
import { StyleSheet, View } from 'react-native';
import { Branding, useBranding } from '../../../contexts';
import { ListPicker } from '../../../components/listPickers';

interface Props {
  name: string;
  value?: string;
  label?: string;
  error?: string;
  lists?: string[];
  labelList?: string[];
  onChange?: (value: string) => void;
}
interface FiledSelectionViewRef {
  value?: () => string | undefined;
}

export const FiledSelectionView = React.forwardRef<
  FiledSelectionViewRef,
  Props
>(
  (
    {
      name,
      lists,
      labelList,
      label,
      error,
      onChange,
      value: defaultValue,
    }: Props,
    ref: React.Ref<FiledSelectionViewRef>
  ) => {
    const branding = useBranding();

    const styles = requireNutritionFactStyle(branding);
    const [value, setValue] = useState<string | undefined>(defaultValue);

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
        <View style={styles.formRow}>
          <Text
            weight="400"
            size="_12px"
            color="gray500"
            style={[styles.label, styles.labelMargin]}
          >
            {name}
          </Text>
          <ListPicker
            value={value ?? ''}
            title={name}
            onChange={(item) => {
              onChange?.(item);
              setValue(item);
            }}
            lists={lists ?? []}
            label={label}
            labelList={labelList}
            style={styles.pickerTextInput}
            error={error ?? ''}
          />
        </View>
      );
    };

    return <View>{renderFiled()}</View>;
  }
);

const requireNutritionFactStyle = ({}: Branding) =>
  StyleSheet.create({
    formRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    label: {
      flex: 1,
    },
    labelMargin: {
      marginTop: 10,
    },
    pickerTextInput: {
      flexWrap: 'wrap',
      textAlign: 'right',
    },
  });
