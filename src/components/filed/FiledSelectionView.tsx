import React, { useImperativeHandle, useState } from 'react';
import { Text } from '..';
import { StyleSheet, View } from 'react-native';
import { Branding, useBranding } from '../../contexts';
import { ListPicker } from '../listPickers';

interface Props {
  name: string;
  value?: string;
  label?: string;
  error?: string;
  lists?: string[];
  labelList?: string[];
  onChange?: (value: string) => void;
  isColum?: boolean;
  isCenter?: boolean;
}
export interface FiledSelectionViewRef {
  value: () => string | undefined;
  errorCheck: () => boolean | undefined;
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
      onChange,
      value: defaultValue,
      isColum = false,
      isCenter = false,
    }: Props,
    ref: React.Ref<FiledSelectionViewRef>
  ) => {
    const branding = useBranding();

    const styles = requireNutritionFactStyle(branding);
    const [value, setValue] = useState<string | undefined>(defaultValue);
    const [error, setError] = useState<string>();

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
        <View style={[styles.formRow, isColum && styles.formColum]}>
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
            isCenter={isCenter}
            onChange={(item) => {
              onChange?.(item);
              setError(undefined);
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
    pickerTextInput: {
      flexWrap: 'wrap',
      textAlign: 'right',
    },
  });
