import React from 'react';
import { TouchableHighlight, View } from 'react-native';

import { COLORS } from '../../constants';

import { useBranding } from '../../contexts';
import selectedBarStyle from './SelectBar.style';
import { Text } from '../texts';

interface Option {
  label: string;
  value: string | number;
}

interface Props {
  options: Array<Option>;
  selectedValue: string | number;
  onChange: (option: Option) => unknown;
}

export const SelectBar: React.FC<Props> = ({
  options,
  onChange,
  selectedValue,
}) => {
  const onOptionPress = (option: Option) => {
    onChange && onChange(option);
  };
  const styles = selectedBarStyle(useBranding());

  return (
    <View style={styles.container}>
      {options.map((option, index, list) => (
        <TouchableHighlight
          key={index}
          style={[
            styles.item,
            index === 0 && styles.first,
            index === list.length - 1 && styles.last,
            option.value === selectedValue && styles.itemSelected,
          ]}
          underlayColor={COLORS.blue}
          onPress={() => onOptionPress(option)}
        >
          <Text
            size="_12px"
            weight="500"
            style={[
              styles.itemText,
              option.value === selectedValue && styles.itemSelectedText,
            ]}
          >
            {option.label}
          </Text>
        </TouchableHighlight>
      ))}
    </View>
  );
};
