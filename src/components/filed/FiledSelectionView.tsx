import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Text } from '..';
import { StyleSheet, View } from 'react-native';
import { Branding, useBranding } from '../../contexts';
import { ListPicker } from '../listPickers';

interface Props {
  name: string;
  value?: string;
  input?: string;
  label?: string;
  error?: string;
  lists?: string[];
  labelList?: string[];
  onChange?: (value: string) => void;
  isColum?: boolean;
  isCenter?: boolean;
  isTextInput?: boolean;
}
export interface FiledSelectionViewRef {
  value: () => string | undefined;
  input?: () => string | undefined;
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
      input,
      value: defaultValue,
      isColum = false,
      isCenter = false,
      isTextInput = false,
    }: Props,
    ref: React.Ref<FiledSelectionViewRef>
  ) => {
    const branding = useBranding();
    const inputRef = useRef<string>(input ?? '');

    const styles = requireNutritionFactStyle(branding);
    const [value, setValue] = useState<string | undefined>(defaultValue);

    useEffect(() => {
      setValue(defaultValue);
    }, [defaultValue]);
    const [error, setError] = useState<string>();

    useEffect(() => {
      inputRef.current = input ?? '';
    }, [input]);

    useImperativeHandle(
      ref,
      () => ({
        value: () => {
          return value;
        },
        input: () => {
          return inputRef.current;
        },
        errorCheck: () => {
          if (value === undefined || value?.length === 0) {
            setError('please enter value');
          } else {
            setError(undefined);
          }

          if (
            isTextInput &&
            (inputRef.current === undefined || inputRef.current.length === 0)
          ) {
            setError('please enter value');
          }
          return value?.length === 0;
        },
      }),
      [isTextInput, value]
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
            defaultInput={input}
            onChange={(item) => {
              onChange?.(item);
              setError(undefined);
              setValue(item);
            }}
            onChangeText={(text) => {
              inputRef.current = text;
            }}
            lists={lists ?? []}
            label={label}
            labelList={labelList}
            isTextInput={isTextInput}
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
