import React, { useRef } from 'react';
import { FlatList, Image, TouchableOpacity, View } from 'react-native';
import { useBranding } from '../../contexts';
import { ICONS } from '../../assets';
import menuStyle from './menu.styles';
import { Picker, type PickerRef } from '../picker/Picker';
import type { ServingUnit } from '../../models';
import { Text } from '../texts';

interface Props {
  servingSize: ServingUnit[];
  selectedUnit: string;
  onTapServingSize: (size: ServingUnit) => void;
}

export const SelectServingSize = ({
  servingSize,
  selectedUnit,
  onTapServingSize,
}: Props) => {
  const branding = useBranding();
  const styles = menuStyle(branding);
  const pickerRef = useRef<PickerRef>(null);

  const brandingContext = useBranding();
  const renderItem = ({ item }: { item: ServingUnit }) => {
    const isSelected = item.unit === selectedUnit;
    return (
      <TouchableOpacity
        style={[styles.optionContainer, isSelected && styles.selected]}
        onPress={() => {
          onTapServingSize(item);
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
          {item.unit + ' '}
        </Text>
      </TouchableOpacity>
    );
  };

  const render = () => {
    return (
      <Picker
        ref={pickerRef}
        options={
          <FlatList
            data={servingSize}
            keyExtractor={(__: ServingUnit, index: Number) => index.toString()}
            showsHorizontalScrollIndicator={false}
            style={{ flex: 1 }}
            renderItem={renderItem}
          />
        }
      >
        <View style={styles.main}>
          <Text style={styles.mainTitle}>{selectedUnit}</Text>
          <Image source={ICONS.down} style={styles.icon} />
        </View>
      </Picker>
    );
  };
  return render();
};
