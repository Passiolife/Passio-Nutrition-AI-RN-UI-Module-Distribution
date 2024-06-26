import React, { useRef } from 'react';
import {
  FlatList,
  Image,
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
  title: string;
  error: string;
  style: StyleProp<ViewStyle>;
  label?: string;
  extraWidth?: number;
  onChange: (size: T) => void;
}

export const ListPicker: React.FC<Props<any>> = ({
  lists,
  label,
  labelList,
  extraWidth,
  value,
  onChange,
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
          <Text style={styles.mainTitle}>{label ?? value}</Text>
          <Image source={ICONS.down} style={styles.icon} />
        </View>
      </Picker>
    );
  };
  return render();
};
