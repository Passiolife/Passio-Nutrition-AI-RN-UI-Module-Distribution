import React, { useRef } from 'react';
import {
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useBranding } from '../../contexts';
import { ICONS } from '../../assets';
import { Picker, type PickerRef } from '../picker/Picker';
import { Text } from '../texts';
import menuStyle from './menu.styles';

interface Props<T> {
  lists: string[];
  labelList?: string[];
  value: string;
  defaultInput?: string;
  title: string;
  error?: string;
  style: StyleProp<ViewStyle>;
  label?: string;
  extraWidth?: number;
  onChange: (size: T) => void;
  onChangeText?: (value: string) => void;
  isCenter?: boolean;
  isTextInput?: boolean;
  input?: string;
}

export const ListPicker: React.FC<Props<any>> = ({
  lists,
  label,
  labelList,
  extraWidth,
  value,
  onChange,
  isCenter,
  defaultInput,
  onChangeText,
  isTextInput = false,
  error,
}) => {
  const branding = useBranding();
  const styles = menuStyle(branding);
  const pickerRef = useRef<PickerRef>(null);

  const brandingContext = useBranding();
  const renderItem = ({ item, index }: { item: string; index: number }) => {
    const isSelected = item.toLocaleLowerCase() === value.toLocaleLowerCase();
    return (
      <TouchableOpacity
        style={[styles.optionContainer, isSelected && styles.selected]}
        onPress={() => {
          onChange(item);
          pickerRef?.current?.onClose();
        }}
      >
        <Text
          weight="400"
          size="_12px"
          style={[
            styles.optionTitle,
            {
              color: isSelected
                ? brandingContext.primaryColor
                : brandingContext.text,
            },
          ]}
        >
          {labelList ? labelList[index] : item + ' '}
        </Text>
      </TouchableOpacity>
    );
  };

  const render = () => {
    return (
      <Picker
        ref={pickerRef}
        isCenter={isCenter}
        extraWidth={extraWidth ?? 0}
        options={
          <FlatList
            data={lists}
            keyExtractor={(__: string, index: Number) => index.toString()}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            renderItem={renderItem}
          />
        }
      >
        <View style={styles.main}>
          {isTextInput && (
            <TextInput
              value={defaultInput}
              onChangeText={onChangeText}
              style={{ flex: 1, marginStart: 8 }}
            />
          )}
          <Text
            weight="400"
            size="_12px"
            style={[
              styles.mainTitle,
              isTextInput && {
                flex: undefined,
              },
            ]}
          >
            {label ?? value}
          </Text>
          <Image source={ICONS.down} style={styles.icon} />
        </View>
        {error && (
          <Text weight="400" size="_12px" style={[styles.error]}>
            {error}
          </Text>
        )}
      </Picker>
    );
  };
  return render();
};
