import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Text } from '..';
import {
  Image,
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Branding, useBranding } from '../../contexts';
import { scaleHeight } from '../../utils';
import { ICONS } from '../../assets';
import {
  cleanedDecimalNumber,
  isValidDecimalNumber,
} from '../../screens/foodCreator/FoodCreator.utils';
import { COLORS } from '../../constants';

interface Props {
  name: string;
  value?: string;
  label?: string;
  keyboardType?: KeyboardTypeOptions;
  isColum?: boolean;
  onDelete?: () => void;
  isCharacter?: boolean;
  multiLine?: boolean;
}

export interface FiledViewRef {
  value: () => string | undefined;
  input: () => string | undefined;
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
      isCharacter = false,
      multiLine = false,
      onDelete,
    }: Props,
    ref: React.Ref<FiledViewRef>
  ) => {
    const branding = useBranding();
    const value = useRef<string | undefined>(defaultValue);
    const [error, setError] = useState<string>();

    const styles = requireNutritionFactStyle(branding);
    const inputRef = useRef<TextInput>(null);
    useEffect(() => {
      value.current = defaultValue;
    }, [defaultValue]);

    useImperativeHandle(
      ref,
      () => ({
        value: () => {
          return value.current;
        },
        input: () => {
          return value.current;
        },
        errorCheck: () => {
          if (value === undefined || value.current?.length === 0) {
            setError('Please enter value');
          } else if (isValidDecimalNumber(value?.current, isCharacter)) {
            setError(undefined);
          } else {
            setError('Please enter valid input');
          }
          return !isValidDecimalNumber(value?.current, isCharacter);
        },
      }),
      [isCharacter]
    );

    const renderFiled = () => {
      return (
        <View style={[!isColum && styles.formRow, isColum && styles.formColum]}>
          <Text
            weight="400"
            size="secondlyTitle"
            color="gray500"
            style={[styles.label, styles.labelMargin]}
          >
            {name}
          </Text>
          <View style={{ flex: 1 }}>
            <TextInput
              ref={inputRef}
              style={[
                styles.textInput,
                multiLine && {
                  paddingTop: 8,
                },
              ]}
              multiline={multiLine}
              maxLength={180}
              onChangeText={(text) => {
                value.current = cleanedDecimalNumber(text);
                setError(undefined);
              }}
              returnKeyType={multiLine ? 'default' : 'done'}
              defaultValue={defaultValue?.toString()}
              placeholder={label}
              keyboardType={keyboardType}
            />
            {!!error && <Text style={styles.error}>{error}</Text>}
          </View>
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
      marginBottom: 4,
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
      borderWidth: 1,
      paddingHorizontal: 8,
    },
    containerTextInput: {
      flex: 1,
    },
    errorContainer: {
      borderColor: COLORS.red,
    },
    error: {
      marginTop: 4,
      color: COLORS.red,
      fontSize: 12,
    },
  });
